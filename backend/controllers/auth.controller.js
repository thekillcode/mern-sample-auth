import { createUser, loginUser } from '../services/auth.service.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import httpError from 'http-errors';
import { verifyToken } from '../services/token.service.js';
import { findUser } from '../services/user.service.js';
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
export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) throw httpError.Unauthorized('Please Login First');
    const checkToken = await verifyToken(
      refresh_token,
      process.env.JWT_REFRESH_SECRET
    );
    const getUser = await findUser(checkToken.userId);
    const token = await getUser.createAccessToken();

    res.status(StatusCodes.OK).json({ token, user: getUser.publicResponse() });
  } catch (error) {
    next(error);
  }
};
