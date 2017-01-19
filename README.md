# passport-access-token [![Version npm](https://img.shields.io/npm/v/passport-access-token.svg?style=flat-square)](https://www.npmjs.com/package/passport-access-token)[![Dependencies](https://img.shields.io/david/auspexeu/passport-access-token.svg?style=flat-square)](https://david-dm.org/auspexeu/passport-access-token)

[![NPM](https://nodei.co/npm/passport-access-token.png?downloads=true&stars=true)](https://nodei.co/npm/passport-access-token/)

[Passport](http://passportjs.org/) strategy for authenticating with an access token.

This module lets you authenticate using an access token in your Node.js applications. By plugging into Passport, token based authentication can be easily and unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

This can easily be used to create a password reset mechanism by providing the user with a link containing an access token that is then instantaneously revoked as soon as she sets a new password.

## Install

    $ npm install passport-access-token --save

## Usage

#### Configure Strategy

The local authentication strategy authenticates users using an access token. The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

    const AccessTokenStrategy = require('passport-access-token').Strategy
    passport.use(new AccessTokenStrategy({
        tokenParam: 'token'
      }, (token, done) => {
        User.findOne({ onetimePassword: token }, (err, user) => {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          // delete the onetimePassword after the user has set the new password
          return done(null, user);
        });
      }
    ));

##### Options

The access token can be stored in three different locations which are configured as follows:

* Inside the url the HTTP GET parameter is specified using the `tokenParam` option (default: 'token')
* As a HTTP HEADER field which is specified using the `tokenHeader` option (default: 'accessToken')
* In the payload of a HTTP POST request where the field name is specified using the `tokenField` option (default: 'Authorization')
* If none of the above methods suits your purposes there is also the `extractor` option that can be supplied with a function of the signature 
function (req) {...} which returns the access token retrieved by some custom code from the HTTP request (default: *undefined*)

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'token'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/login/:token', 
      passport.authenticate('token', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('/');
      });

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Christian Vaas
