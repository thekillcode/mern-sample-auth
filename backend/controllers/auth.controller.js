import { createUser, loginUser } from '../services/auth.service.js';
import { verifyToken } from '../services/token.service.js';
import { findUser } from '../services/user.service.js';
import ApiError, { StatusCodes } from '../errors/ApiError.js';
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
    res.json({
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
