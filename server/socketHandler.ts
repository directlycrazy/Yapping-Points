import type { playerData } from '$lib/types';
import { first, insert } from 'blinkdb';
import { Server } from 'socket.io';
import type { HttpServer } from 'vite';
import { gameTable, titlesTable, usersTable } from './db';

export default function injectSocketIO(server: HttpServer | null) {
    if (server === null) return;

    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on('connection', (socket) => {
        socket.on('joinRoom', async (data: playerData) => {
            data['id'] = socket.id;
            socket.data = data;

            const room = await first(gameTable, {
                where: {
                    id: data.code
                }
            })

            console.log(room)

            if (room && data.role === "host") return;

            if (!room && data.role === "host") {
                await insert(gameTable, {
                    id: data.code,
                    host: socket.id
                })
            }

            await insert(usersTable, {
                id: socket.id,
                code: data.code,
                username: data.username,
                role: data.role
            }).catch(() => {})

            socket.join(data.code);
            socket.to(data.code).emit('playerJoined', { username: data.username })
        })

        socket.on('gameStart', () => {
            if (socket.data.role !== "host") return;
            socket.to(socket.data.code).emit("gameStart");
        })

        socket.on('sendTitle', async (title) => {
            const room = await first(gameTable, {
                where: {
                    id: socket.data.code
                }
            })

            if (!room) return;

            await insert(titlesTable, {
                id: socket.id,
                code: socket.data.code,
                title: title
            })

            socket.to(room.host).emit('titleSelected', { id: socket.id, code: socket.data.code, username: socket.data.username, title: title });
        })
    });

    console.log('SocketIO injected');
}
