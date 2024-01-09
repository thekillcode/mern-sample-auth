import validator from 'validator';
import User from '../models/User.js';
import ApiError, { ReasonPhrases, StatusCodes } from '../errors/ApiError.js';
import bcrypt from 'bcryptjs';
import Role from '../models/Role.js';

/**
 * The function `createUser` is an asynchronous function that takes in user data and creates a new user
 * in a database, performing validation checks on the input fields.
 * @param userData - The `userData` parameter is an object that contains the following properties: username, email, password, password_confirmation
 * @returns the newly created user object.
 */
export const createUser = async (userData) => {
  const errors = {};
  const { username, email, password, password_confirmation } = userData;

  // check if fields are empty
  !username
    ? (errors.username = 'username is required')
    : !validator.isLength(username, { min: 3, max: 10 })
    ? (errors.username = 'username length must be between 3 to 10 characters')
    : null;
  !email
    ? (errors.email = 'email is required')
    : !validator.isEmail(email)
    ? (errors.email = 'Please Enter Valid Email')
    : null;
  !password
    ? (errors.password = 'password is required')
    : !validator.isLength(password, { min: 6, max: 128 })
    ? (errors.password = 'password length must be between 5 to 128 character')
    : !validator.equals(password, password_confirmation)
    ? (errors.password = 'password and confirm password mis-match')
    : null;
  // check fields are empty
  if (Object.keys(errors).length > 0) {
    throw new ApiError(errors, StatusCodes.BAD_REQUEST);
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
      throw new ApiError(errors, StatusCodes.BAD_REQUEST);
    }
  }
  const userRole = await Role.findOne({ slug: 'user' });
  const newUser = await new User({
    username: username,
    email: email,
    password: password,
    role: userRole._id,
  }).save();

  return newUser;
};

/**
 * The function `loginUser` that logs in a user by checking their username or email
 * and password, and returns the logged in user.
 * @param loginData - The `loginData` parameter is an object that contains the username and password
 * for the user trying to log in.
 * @returns the `loginUser` object if the login credentials are valid.
 */
export const loginUser = async (loginData) => {
  const errors = {};
  const { username, password } = loginData;

  !username ? (errors.username = 'username is required') : null;
  !password ? (errors.password = 'password is required') : null;

  if (Object.keys(errors).length > 0)
    throw new ApiError(errors, StatusCodes.BAD_REQUEST);

  const queryParam = { username: username };
  if (validator.isEmail(username)) {
    queryParam.email = username;
    delete queryParam['username'];
  }
  const loginUser = await User.findOne(queryParam).select('+password');
  if (!loginUser)
    throw new ApiError('Invalid Credientials', StatusCodes.UNAUTHORIZED);
  const passwordCheck = await loginUser.comparePassword(password);
  if (!passwordCheck)
    throw new ApiError('Invalid Credientials', StatusCodes.UNAUTHORIZED);

  return loginUser;
};

export const bcryptPasswod = async (passwod) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(passwod, salt);
};
