import fs from 'fs';
import validator from 'validator';
import {
  bcryptPasswod,
  createUser,
  loginUser,
} from '../services/auth.service.js';
import { verifyToken } from '../services/token.service.js';
import {
  findUser,
  findUserResetPasswordToken,
} from '../services/user.service.js';
import ApiError, { StatusCodes } from '../errors/ApiError.js';
import { sendMail } from '../services/mail.service.js';
import { renderEjsToHTMLStr } from '../utils/ejs.js';
import ResetPasswordToken from '../models/ResetPasswordToken.js';
import { generateString } from '../utils/str.js';
import User from '../models/User.js';

/**
 * The `register` function is an asynchronous function that handles the registration process by
 * creating a new user, generating access and refresh tokens, setting a refresh token cookie, and
 * returning the access token and user information in the response.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is typically
 * provided by the Express.js framework.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting headers, status codes, and sending data back to the client.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used to handle errors or to move on to the
 * next middleware function after completing a specific task.
 * @returns a JSON response with the access_token and user information.
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password, password_confirmation } = req.body;
    const newUser = await createUser({
      username,
      email,
      password,
      password_confirmation,
    });
    const token = await newUser.createAccessToken();
    const refresh_token = await newUser.createRefreshToken();
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ access_token: token, user: newUser.newUserResponse() });
  } catch (error) {
    next(error);
  }
};
/**
 * The `login` function is an asynchronous function that handles user login by validating the username
 * and password, creating access and refresh tokens, and sending the tokens and user information in the
 * response.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is typically
 * provided by the Express.js framework.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting headers, status codes, and sending data back to the client.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used to handle errors or to move on to the
 * next middleware function in the chain.
 * @returns The login function is returning a JSON response with the access_token and user information.
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const loggedUser = await loginUser({ username, password });
    const token = await loggedUser.createAccessToken();
    const refresh_token = await loggedUser.createRefreshToken();
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(StatusCodes.OK)
      .json({ access_token: token, user: loggedUser.loginResponse() });
  } catch (error) {
    next(error);
  }
};
/**
 * The `logout` function clears the `refreshToken` cookie and sends a JSON response indicating
 * successful logout.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request. It includes details such as the request headers, request body, request method, request
 * URL, and more.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to manipulate the response, set headers,
 * and send data back to the client. In this case, the `res` object is used to clear the `
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used to handle errors or to move on to the
 * next middleware function in the chain.
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh-token' });
    return res.json({
      message: 'Logged Out Successfully !',
    });
  } catch (error) {
    next(error);
  }
};
/**
 * The `refreshToken` function is an asynchronous function that handles the refreshing of access tokens
 * for a user.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request headers, request body,
 * request method, request URL, and more.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send a response
 * back to the client. In this code snippet, it is used to send a JSON response with an access token
 * and user information.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used to handle errors or to move on to the
 * next middleware function after completing the current one.
 */
export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token)
      throw new ApiError('Please Login First', StatusCodes.UNAUTHORIZED);
    const checkToken = await verifyToken(
      refresh_token,
      process.env.JWT_REFRESH_SECRET
    );
    const getUser = await findUser(checkToken.userId);
    const token = await getUser.createAccessToken();

    res
      .status(StatusCodes.OK)
      .json({ access_token: token, user: getUser.publicResponse() });
  } catch (error) {
    next(error);
  }
};

/**
 * The `forgotPassword` function is an asynchronous function that handles the logic for sending a
 * forgot password email to a user.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as the request headers, request body,
 * request method, request URL, etc.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, headers, and sending the response body. In this code snippet, the `res`
 * object is
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used to handle errors or to move on to the
 * next middleware function in the chain.
 * @returns a JSON response with the following properties:
 * - otp: The randomly generated OTP (One-Time Password)
 * - status: The HTTP status code (200 OK)
 * - envelope: The envelope information from the email sending process
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const template = fs.readFileSync(
      'templates/emails/forgotPassword.email.template.ejs',
      'utf-8'
    );
    const otp = Math.floor(Math.random() * (9000 - 1000) + 1000);
    const bodyHtml = await renderEjsToHTMLStr(template, { otp: otp });
    const info = await sendMail(
      {
        from: '"PAVF ADMIN 👻" <pavf@thekillcode.com>',
        replyTo: 'no-reply@thekillcode.com', // sender address
        to: `${email}`, // list of receivers
        subject: 'Forgot Password', // Subject line
        text: '', // plain text body
        html: bodyHtml, // html body
      },
      'smtp'
    );
    return res.status(StatusCodes.OK).json({
      otp: otp,
      status: StatusCodes.OK,
      envelope: info.envelope,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmOtp = async (req, res, next) => {
  try {
    const { otp_success, email } = req.body;
    const errors = {};
    !otp_success || otp_success !== 'success'
      ? (errors.otp_success = 'otp_success Field Is Required')
      : null;
    !email ? (errors.email = 'email Field Is Required') : null;

    if (Object.keys(errors).length > 0) {
      throw new ApiError(errors, StatusCodes.BAD_REQUEST);
    }
    const oldToken = await ResetPasswordToken.findOne({ email: email });
    if (oldToken) {
      await oldToken.deleteOne();
    }
    const newToken = generateString(64);
    const newResetPasswordRequest = await new ResetPasswordToken({
      email: email,
      token: newToken,
    }).save();
    res.status(StatusCodes.CREATED).json({
      reset_token: newResetPasswordRequest.token,
      email: newResetPasswordRequest.email,
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { reset_token, email, password, password_confirmation } = req.body;
    const errors = {};
    !reset_token
      ? (errors.reset_token = 'Reset Token Field Is Required')
      : null;
    !email ? (errors.email = 'email Field Is Required') : null;
    !password
      ? (errors.password = 'password is required')
      : !validator.isLength(password, { min: 6, max: 128 })
      ? (errors.password = 'password length must be between 5 to 128 character')
      : !validator.equals(password, password_confirmation)
      ? (errors.password = 'password and confirm password mis-match')
      : null;

    if (Object.keys(errors).length > 0) {
      throw new ApiError(errors, StatusCodes.BAD_REQUEST);
    }
    const getToken = await findUserResetPasswordToken(email, reset_token);
    if (getToken) {
      const hashNewPassword = await bcryptPasswod(password);
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { password: hashNewPassword }
      );
      await getToken.deleteOne();
      res.status(StatusCodes.CREATED).json({
        message: 'User Updated Successfully',
        user: updatedUser.publicResponse(),
      });
    }
  } catch (error) {
    next(error);
  }
};
