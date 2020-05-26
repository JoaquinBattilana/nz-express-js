const bcrypt = require('bcrypt');

const { findUserByEmail } = require('../services/user');
const { sessionError } = require('../errors');

const findUser = (request, _response, next) => {
  // eslint-disable-next-line consistent-return
  findUserByEmail(request.body.email).then(user => {
    if (!user) return next(sessionError('User not found'));
    request.user = user;
    next();
  });
};

const comparePassword = (request, _response, next) => {
  const givenPassword = request.body.password;
  const { user } = request;

  bcrypt.compare(givenPassword, user.password, (err, res) => {
    if (res) {
      next();
    } else {
      next(sessionError('Password not match'));
    }
  });
};

exports.validatePassword = [findUser, comparePassword];
