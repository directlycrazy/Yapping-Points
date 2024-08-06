import type { playerData } from '$lib/types';
import { Server } from 'socket.io';
import type { HttpServer } from 'vite';

export default function injectSocketIO(server: HttpServer | null) {
    if (server === null) return;

    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    let roomsData = new Map();

    io.on('connection', (socket) => {
        socket.on('joinRoom', (data: playerData) => {
            data['id'] = socket.id;
            socket.data = data;
            let roomData = roomsData.get(data.code);
            if (!roomData && data.role === "host") {
                roomsData.set(data.code, {
                    players: [data]
                })
            } else {
                roomData.players.push(data);
                roomsData.set(data.code, roomData);
            }
            //Can't have two hosts
            if (roomData && data.role === "host") return;

            console.log(roomsData.get(data.code))
            console.log(data)
            socket.join(data.code);
            socket.to(data.code).emit('playerJoined', { username: data.username })
        })

        socket.on('gameStart', () => {
            if (socket.data.role !== "host") return;
            socket.to(socket.data.code).emit("gameStart");
        })

        socket.on('sendTitle', (title) => {
            const roomData = roomsData.get(socket.data.code);
            console.log(socket.data, title)
            socket.to(roomData.players[0].id).emit('titleSelected', socket.data.username);
        })
    });

    console.log('SocketIO injected');
}
