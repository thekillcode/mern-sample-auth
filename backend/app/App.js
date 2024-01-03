import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import routes from '../routes/routes.js';
import logger from '../utils/logger.js';
import {
  routeNotFoundMiddleware,
  defaultErrorHandler,
} from '../middlewares/middleware.js';

class App {
  constructor({ port }) {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

    this.PORT = port;
    this.serverInit();
    this.loadPlugins();
    this.loadRoutes();
    this.loadExceptionMiddlewares();
  }
  serverInit() {
    this.app = express();
    this.server = https.createServer(
      {
        key: fs.readFileSync('configs/localhost+2-key.pem'),
        cert: fs.readFileSync('configs/localhost+2.pem'),
      },
      this.app
    );
  }
  loadDevPlugins() {}
  loadPlugins() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(mongoSanitize());
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(fileUpload({ useTempFiles: true }));
  }
  loadRoutes() {
    this.app.use('/api/v1', routes);
  }
  loadExceptionMiddlewares() {
    this.app.use(routeNotFoundMiddleware);
    this.app.use(defaultErrorHandler);
  }
  startServer() {
    this.server.listen(this.PORT, () => {
      logger.info(`[Server]: Running On http://localhost:${this.PORT}`);
      logger.info(`[Process Id]: PID ${process.ppid}`);
    });
  }
}

export default App;
