import http from 'http';
import express from 'express';
import socketIO from './server/socketHandler';
import { handler } from './build/handler.js';

const app = express();
const server = http.createServer(app);

socketIO(server);

app.use(handler);

server.listen(5173, () => {
    console.log(`Running on port 5173`);
})