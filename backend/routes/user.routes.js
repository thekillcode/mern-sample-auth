import express from 'express';
import trimRequest from 'trim-request';
import { profile, profileUpdate } from '../controllers/user.controller.js';

const userRouter = new express.Router();

// Add routes
userRouter.get('/', trimRequest.all, profile);
userRouter.post('/update', trimRequest.all, profileUpdate);

// routerName.put('/', SessionController.store);
// routerName.delete('/', SessionController.store);

export default userRouter;
