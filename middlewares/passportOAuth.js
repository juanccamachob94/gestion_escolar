const passportFacebook = require('passport-facebook');
const passportGoogleOauth = require('passport-google-oauth20');
const passportLocal = require('passport-local');
const bcryptjs = require('bcryptjs');
const passportAPIs = require('../config/passportAPIs');
const providers = require('../config/providers');
const User = require('../models/User').model;
module.exports = {
  facebookStrategy: () => new passportFacebook.Strategy(
    passportAPIs.facebook,
    (accessToken,refreshToken,profile,callback) => {
      User.findOrCreate({username:profile.id,provider:providers[1]},{familyName:profile.name.familyName,givenName:profile.name.givenName,email: profile.emails[0].value,provider:providers[1],password:accessToken}, function (err,user) {
        err ? callback(err,user) : callback(null,user);
      });
    }
  ),
  googleStrategy: () => new passportGoogleOauth.Strategy(
    passportAPIs.google,
    (accessToken,refreshToken,profile,callback) => {
      //photo es obtenida de la url quitando el tamaño de la misma (?sz=50)
      User.findOrCreate({username:profile.id,provider:providers[2]},{familyName:profile.name.familyName,givenName:profile.name.givenName,email: profile.emails[0].value ,provider:providers[2],password:accessToken,photo:profile.photos[0].value.split('?')[0]}, function (err,user) {
        err ? callback(err,user) : callback(null,user);
      });
    }
  ),
  localStrategy: () => new passportLocal.Strategy((username,password,callback) => {
    User.findOne({username,provider:providers[0]},(err,user) => {
      if(err) throw err;
      if(!user) return callback(null,false,{message:'User not found'});
      if(!user.isVerified) return callback(null,false,{message:'User not verified'});
        bcryptjs.compare(password,user.password,(err,isMatch) => {
          if(err) throw err;
          if(isMatch) callback(null,user);
          else callback(null,false,{message:'Wrong password'});
        });
    });
  })
};
