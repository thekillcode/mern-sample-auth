import httpError from 'http-errors';
import validator from 'validator';
import User from '../models/User.js';

export const createUser = async (userData) => {
  const errors = {};
  const { username, email, password, password_confirmation } = userData;

  // check if fields are empty
  !username
    ? (errors.username = 'username is required')
    : !validator.isLength(username, { min: 3, max: 10 })
    ? (errors.username = 'username length must be between 3 to 10 characters')
    : null;
  !email ? (errors.email = 'email is required') : null;
  !password
    ? (errors.password = 'password is required')
    : !validator.isLength(password, { min: 6, max: 128 })
    ? (errors.password = 'password length must be between 5 to 128 character')
    : !validator.equals(password, password_confirmation)
    ? (errors.password = 'password and confirm password mis-match')
    : null;
  // check fields are empty
  if (Object.keys(errors).length > 0) {
    throw httpError.BadRequest(errors);
  }
  const dbUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (dbUser) {
    dbUser.username === username
      ? (errors.username = 'username already exists')
      : null;
    dbUser.email === email ? (errors.email = 'email already exists') : null;
    if (Object.keys(errors).length > 0) {
      throw httpError.BadRequest(errors);
    }
  }
  const newUser = await new User({
    username: username,
    email: email,
    password: password,
  }).save();

  return newUser;
};

export const loginUser = async (loginData) => {
  const errors = {};
  const { username, password } = loginData;

  !username ? (errors.username = 'username is required') : null;
  !password ? (errors.password = 'password is required') : null;

  if (Object.keys(errors).length > 0) throw httpError.BadRequest(errors);

  const queryParam = { username: username };
  if (validator.isEmail(username)) {
    queryParam.email = username;
    delete queryParam['username'];
  }
  const loginUser = await User.findOne(queryParam).select('+password');
  if (!loginUser) throw httpError.Unauthorized('Invalid Credientials');
  const passwordCheck = await loginUser.comparePassword(password);
  if (!passwordCheck) throw httpError.Unauthorized('Invalid Credientials');

  return loginUser;
};
