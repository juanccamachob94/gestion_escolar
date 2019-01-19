const router = require('express').Router();
const UserController = require('../controllers/UserController');


const passport = require('passport');
const passportFacebook = require('passport-facebook');
const passportGoogleOauth = require('passport-google-oauth20');
const passportAPIs = require('../config/passportAPIs');
const providers = require('../config/providers');
const User = require('../models/User').model;


router.route('/')
  .get(UserController.index)
;
router.route('/signUp')
  .get(UserController.getSignUp)
  .post(UserController.signUp,UserController.uploadPhoto,UserController.sendVerification)
;

router.route('/facebook')
  .get(passport.authenticate(providers[0],{scope:['email','publish_to_groups','publish_pages','manage_pages','user_friends','user_location']}))
;

router.route('/google')
  .get(passport.authenticate(providers[1],{scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email']}))
;

router.route('/logIn')
  .get(UserController.getLogIn)
  .post(UserController.logIn,UserController.findUserData)
;

router.route('/facebook/callback')
  .get(passport.authenticate(providers[0],{failureRedirect:'/fallo'}),UserController.findUserData)
;
router.route('/google/callback')
  .get(passport.authenticate(providers[1],{failureRedirect:'/fallo'}),UserController.findUserData)
;

router.route('/logOut')
  .get(UserController.logOut)
;

module.exports = router;
