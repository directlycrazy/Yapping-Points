import ioClient from 'socket.io-client';

const s = ioClient("/");

export const socket = s;