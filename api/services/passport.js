var passport = require('passport'),
  WechatStrategy = require('passport-wechat').Strategy;

function findById(id, fn) {
  User.findOne(id).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByWechatId(id, fn) {
  User.findOne({
    wehcatId: id
  }).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new WechatStrategy({
     appID: "wxece32445da1a8867",
     name:"wechat",
     appSecret: "8b35181b21c24a746c8ad31b65a5cc53",
     client:"web",
     callbackURL: "http://websub.flashpayment.com",
     scope: "snsapi_userinfo",
     state:"STATE",
     getToken: "getToken",
        saveToken: "saveToken"
  }, function (accessToken, refreshToken, profile, done) {

    findByWechatId(profile.id, function (err, user) {

      // Create a new User if it doesn't exist yet
      if (!user) {
        User.create({

          wehcatId: profile.id

          // You can also add any other data you are getting back from Facebook here 
          // as long as it is in your model

        }).done(function (err, user) {
          if (user) {
            return done(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return done(err, null, {
              message: 'There was an error logging you in with wechat'
            });
          }
        });

      // If there is already a user, return it
      } else {
        return done(null, user, {
          message: 'Logged In Successfully'
        });
      }
    });
  }
));