import express from 'express';
import trimRequest from 'trim-request';
import { profile } from '../controllers/user.controller.js';

const userRouter = new express.Router();

// Add routes
userRouter.get('/', trimRequest.all, profile);
// routerName.post('/', SessionController.store);
// routerName.put('/', SessionController.store);
// routerName.delete('/', SessionController.store);

export default userRouter;
