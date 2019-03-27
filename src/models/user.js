const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


import UsersSchema from '../schema/UsersSchema'

UsersSchema.methods.setPassword = function(password, callback) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    if(callback) {
      callback();
    }
};

UsersSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        roles: this.roles,
        token: this.generateJWT(),
    };
};

UsersSchema.methods.defaultReturnUrl = function() {
  var returnUrl = '/';
  if (this.canPlayRoleOf('account')) {
    returnUrl = '/account/';
  }

  if (this.canPlayRoleOf('affiliate')) {
    returnUrl = '/affiliate/';
  }

  if (this.canPlayRoleOf('admin')) {
    returnUrl = '/admin/';
  }

  return returnUrl;
};

UsersSchema.methods.canPlayRoleOf = function(role) {
  if (role === "admin" && this.roles.admin) {
    return true;
  }

  if (role === "account" && this.roles.account) {
    return true;
  }

  if (role === "affiliate" && this.roles.affiliate) {
    return true;
  }

  return false;
};

export default mongoose.model('Users', UsersSchema);
