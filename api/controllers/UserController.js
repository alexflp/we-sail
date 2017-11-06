/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  login: function (req, res) {
    res.view();
  },

  dashboard: function (req, res) {
    res.view();
  },

  logout: function (req, res){
    req.session.user = null;
    req.session.flash = 'You have logged out';
    res.redirect('user/login');
  },

  'wechat': function (req, res, next) {
     passport.authenticate('wechat', { scope: ['snsapi_login']},
        function (err, user) {
            req.logIn(user, function (err) {
            if(err) {
                req.session.flash = 'There was an error';
                res.redirect('user/login');
            } else {
                req.session.user = user;
                res.redirect('/user/dashboard');
            }
        });
    })(req, res, next);
  },

  'wechat/callback': function (req, res, next) {
     passport.authenticate('wechat',
        function (req, res) {
            res.redirect('/user/wechat');
        })(req, res, next);
  }

};

