/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');

/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted as a HTTP GET, HTTP POST parameter or in a HTTP HEADER field.
 *
 * Applications must supply a `verify` callback which accepts `token`
 * as credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the parameter in which the credentials
 * are stored.
 *
 * Options:
 *   - `tokenParam`  HTTP GET parameter that contains the token defaults to ':token'
 *   - `tokenField`  HTTP POST field that contains the token defaults to 'accessToken'
 *   - `tokenHeader` HTTP HEADER field that contains the token defaults to 'Authorization'
 *   - `extractor` function with the signature function (req) {...}: String that extracts the access token from the req object and returns it as a string
 *
 * Examples:
 *     passport.use(new OnetimeTokenStrategy(
 *       function(token, done) {
 *         User.findOne({ onetime: token }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('AccessTokenStrategy requires a verify callback'); }
  
  this._tokenParam = options.tokenParam || 'token';
  this._tokenField = options.tokenField || 'accessToken';
  this._tokenHeader = options.tokenHeader || 'Authorization';
  this._extractor = options.extractor
  
  passport.Strategy.call(this);
  this.name = 'token';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var token = req.params[this._tokenParam] || req.body[this._tokenField] || req.header(this._tokenHeader);
  if (!token && this._extractor) {
    token = this._extractor(req);
  }
  if (!token) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  try {
    if (self._passReqToCallback) {
      this._verify(req, token, verified);
    } else {
      this._verify(token, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
