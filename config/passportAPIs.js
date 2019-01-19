const secrets = require('./secrets');
const providers = require('./providers');
const server_features = require('./server_features');
let getCallbackURL = (provider) => server_features.url + '/user/' + provider + '/callback';

module.exports = {
  facebook: {
    clientID: '337928400132946',
    clientSecret: secrets.APIs.facebook,
    callbackURL: getCallbackURL(providers[1]),
    profileFields: ['emails','name']
  },
  google: {
    clientID: '471770381546-veko9nsu6aqft4vcuqiquo1vjq5qn3po.apps.googleusercontent.com',
    clientSecret: secrets.APIs.google,
    callbackURL: getCallbackURL(providers[2])
  }
};
