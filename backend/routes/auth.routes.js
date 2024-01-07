import express from 'express';
import trimRequest from 'trim-request';
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  confirmOtp,
  resetPassword,
} from '../controllers/auth.controller.js';

const authRouter = new express.Router();

// Add routes
/* `authRouter.post('/register', trimRequest.all, register);` is defining a route for the HTTP POST
method on the `/register` endpoint of the `authRouter` router. */
authRouter.post('/register', trimRequest.all, register);
/* `authRouter.post('/login', trimRequest.all, login);` is defining a route for the HTTP POST method on
the `/login` endpoint of the `authRouter` router. This route will handle the login functionality and
execute the `login` function from the `auth.controller.js` file. The `trimRequest.all` middleware is
used to trim any leading or trailing white spaces from the request body before it is passed to the
`login` function. */
authRouter.post('/login', trimRequest.all, login);
authRouter.post('/logout', trimRequest.all, logout);
authRouter.post('/refresh-token', trimRequest.all, refreshToken);
authRouter.post('/forgot-password', trimRequest.all, forgotPassword);
authRouter.post('/confirm-otp', trimRequest.all, confirmOtp);
authRouter.post('/reset-password', trimRequest.all, resetPassword);

export default authRouter;
