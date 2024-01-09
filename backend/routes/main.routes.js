import express from 'express';
import auth from '../middlewares/auth.js';
import { StatusCodes } from '../errors/ApiError.js';

const mainRouter = new express.Router();

// Add routes
mainRouter.get('/', async (req, res) => {
  return res.json({
    message: 'Welcome to Api Server ',
  });
});

mainRouter.get('/authmiddlewares', auth, (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'Authenticated',
  });
});

// routerName.post('/', SessionController.store);
// routerName.put('/', SessionController.store);
// routerName.delete('/', SessionController.store);

export default mainRouter;
