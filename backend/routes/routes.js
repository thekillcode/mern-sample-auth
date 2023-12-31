import express from 'express';
import mainRouter from './main.routes.js';
import authRouter from './auth.routes.js';

const routes = new express.Router();

routes.use('/', mainRouter);
routes.use('/auth', authRouter);

export default routes;
