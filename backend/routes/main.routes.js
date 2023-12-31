import express from 'express';
import auth from '../middlewares/auth.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
const mainRouter = new express.Router();

// Add routes
mainRouter.get('/', (req, res) => {
  return res.json({
    message: 'Welcome to Api Server' + process.env.MONGO_DATABASE,
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
