import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../../utils/logger.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

mongoose.createConnection(
  `${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`
);

mongoose.on('error', (err) => {
  logger.error(`MongoDb Connection error: ${err}`);
  process.exit(1);
});

mongoose.once('connected', () => {
  logger.info('MongoDb Connected Successfully');
});
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info(
      'Mongoose connection is disconnected due to application termination'
    );
  });
});

seeders(seederKey);
