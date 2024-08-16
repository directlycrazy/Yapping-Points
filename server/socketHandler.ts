import type { playerData } from '$lib/types';
import { first, insert, remove, update } from 'blinkdb';
import { Server } from 'socket.io';
import type { HttpServer } from 'vite';
import { gameTable, titlesTable, usersTable } from './db';

export default function injectSocketIO(server: HttpServer | null) {
    if (server === null) return;

    const io = new Server(server, {
        cors: {
            origin: "*"
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000
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
                role: data.role,
                played: false,
                presented: false
            }).catch(() => { })

            socket.join(data.code);
            socket.to(data.code).emit('playerJoined', { id: socket.id, username: data.username })
        })

        socket.on('gameStart', () => {
            if (socket.data.role !== "host") return;
            socket.to(socket.data.code).emit("gameStart");
        })

        socket.on('presenterScreen', async (user: playerData) => {
            console.log(user)
            if (socket.data.role !== "host" || !user) return;
            socket.to(socket.data.code).emit('resetView');
            //Set the game presenter
            await update(gameTable, { id: socket.data.code, presenter: user.id })
            socket.to(user.id).emit('changeView', { view: "presenter" })
        })

        socket.on('assistantScreen', async (user: playerData) => {
            console.log(user)
            if (socket.data.role !== "host" || !user) return;
            //Set the assistant
            await update(gameTable, { id: socket.data.code, assistant: user.id })
            socket.to(user.id).emit('changeView', { view: "assistant" })
        })

        socket.on('requestView', async () => {
            const room = await first(gameTable, {
                where: {
                    id: socket.data.code
                }
            })

            if (!room) return;

            if (room.presenter === socket.id) return socket.emit('changeView', { view: "presenter" });
            if (room.assistant === socket.id) return socket.emit('changeView', { view: "assistant" });

            //No view exists
            if (!room.view) return;

            //Change to the view other players have
            socket.emit('changeView', { view: room.view });
        })

        socket.on('roomView', async (data: { view: string }) => {
            const room = await first(gameTable, {
                where: {
                    id: socket.data.code
                }
            })

            if (room && room.host !== socket.id) return;

            console.log(data.view);

            await update(gameTable, {
                id: socket.data.code,
                view: data.view
            })
        })

        socket.on('changeSlide', async (direction: "forward" | "back") => {
            const room = await first(gameTable, {
                where: {
                    id: socket.data.code
                }
            })

            // console.log(room.host)
            // console.log(socket.id, room.presenter)
            if (room && socket.id === room.presenter && (direction === "forward" || direction === "back")) {
                socket.to(room.host).emit('changeSlide', direction);
                console.log('VALIDATED')
            }
        })

        socket.on('selectImage', async img => {
            const room = await first(gameTable, {
                where: {
                    id: socket.data.code
                }
            })

            if (socket.id === room?.assistant) {
                socket.to(room.host).emit('selectImage', img);
            }
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
                speech: title
            })

            socket.to(room.host).emit('titleSelected', { id: socket.id, code: socket.data.code, username: socket.data.username, speech: title });
        })
    });

    io.on('disconnect', async (socket) => {
        console.log('Client disconnected');

        //Check if ever in room
        if (!socket.data) return;

        const room = await first(gameTable, {
            where: {
                id: socket.data.code
            }
        })

        if (!room) return;

        const user = await first(usersTable, {
            where: {
                id: socket.id
            }
        })

        if (!user) return;

        await remove(usersTable, { id: socket.id });
        socket.to(room.host).emit('disconnectPlayer', { id: socket.id });

        console.log(user);
    })

    console.log('SocketIO injected');
}
