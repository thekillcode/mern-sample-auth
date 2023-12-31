import App from './app/App.js';
import mongodbConnect from './database/mongodb.js';

const myServer = new App({ port: process.env.PORT || 8000 });
mongodbConnect();
myServer.startServer();
