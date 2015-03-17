# passport-access-token

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

    passport.use(new AccessTokenStrategy({
        tokenParam: 'token'
      }, function(token, done) {
        User.findOne({ onetimePassword: token }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          // delete the onetimePassword after the user has the a new password
          return done(null, user);
        });
      }
    ));

##### Options

The access token can be stored in three different locations which are configured as follows:

* Inside the url the HTTP GET parameter is specified using the `tokenParam` option
* As a HTTP HEADER field which is specified using the `tokenHeader` option
* In the payload of a HTTP POST request where the field name is specified using the `tokenField` option

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'token'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/login/:token', 
      passport.authenticate('token', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Christian Vaas
