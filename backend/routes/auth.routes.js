import express from 'express';
import trimRequest from 'trim-request';
import {
  login,
  logout,
  refreshToken,
  register,
} from '../controllers/auth.controller.js';

const authRouter = new express.Router();

// Add routes
authRouter.post('/register', trimRequest.all, register);
authRouter.post('/login', trimRequest.all, login);
authRouter.post('/logout', trimRequest.all, logout);
authRouter.post('/refresh-token', trimRequest.all, refreshToken);
// routerName.post('/', SessionController.store);
// routerName.put('/', SessionController.store);
// routerName.delete('/', SessionController.store);

export default authRouter;
