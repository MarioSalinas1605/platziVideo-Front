const passport = require('passport');
const axios = require('axios');
const { get } = require('lodash');
const boom = require('@hapi/boom');
const { Strategy: FacebookStrategy } = require('passport-facebook');

require('dotenv').config();

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
},
(async (accessToken, refreshToken, profile, cb) => {
  const { data, status } = await axios({
    url: `${process.env.API_URL}/api/auth/sign-provider`,
    method: 'post',
    data: {
      name: profile.displayName,
      email: get(profile, 'emails.0.value', `${profile.id}@facebook.com`),
      password: profile.id,
      apiKeyToken: process.env.API_KEY_TOKEN,
    },
  });

  if (!data || status !== 200) {
    return cb(boom.unauthorized(), false);
  }

  return cb(null, data);
})));
