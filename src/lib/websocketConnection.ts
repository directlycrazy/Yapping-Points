import ioClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:5173';

const s = ioClient(ENDPOINT);

export const socket = s;