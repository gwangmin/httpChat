import { config } from './config.js';
import { Server } from 'socket.io';
import express from 'express';

// express
const app = express();

app.get('/', (req, res, next) => {
    res.sendFile(config.baseDir + '/index.html');
});


// socket.io
let rooms = {};

const server = app.listen(config.serverPort);
const sock = new Server(server);

function joinRoom(userName, roomName, s, serv) {
    s.join(roomName);
    serv.to(roomName).emit('chat', `[+] ${userName} joined ${roomName}`);
    rooms[roomName].num += 1;
    s.emit('room info', roomName, Object.keys(rooms));
}

function leaveRoom(userName, roomName, s, serv) {
    s.leave(roomName);
    serv.to(roomName).emit('chat', `[-] ${userName} leaved ${roomName}`)
    rooms[roomName].num -= 1;
    if (rooms[roomName].num <= 0)
        delete rooms[roomName];
    s.emit('room info', undefined, Object.keys(rooms));
}

sock.on('connection', (s) => {
    // connection log
    console.log('[+] New client');
    s.on('disconnect', () => {
        console.log('[-] disconnected');
    });

    // common chat
    s.on('chat', (roomName, msg) => {
        if (roomName)
            sock.to(roomName).emit('chat', msg);
    });

    // room join
    s.on('joinRoom', (userName, roomName, pw) => {
        // check pw
        for (let key in rooms) {
            if (roomName === key) {
                if (pw === rooms[key].pw) {
                    return joinRoom(userName, roomName, s, sock);
                } else {
                    // pw 틀림
                    return;
                }
            }
        }
        // create room
        rooms[roomName] = {
            creator: userName,
            pw: pw,
            num: 0,
        };
        joinRoom(userName, roomName, s, sock);
    });

    // room leave
    s.on('leaveRoom', (userName, roomName) => {
        leaveRoom(userName, roomName, s, sock);
    });
});
