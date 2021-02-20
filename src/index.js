const path = require('path');   
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');

const {
    addMailInstance,
    removeMailInstance,
    openMail,
    addMailToInstance,
    removeMail,
    resetMail
} = require('./utils/mails.js');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const publicDirPath = path.join(__dirname, '..', 'public');
const io = socketio(server);
const imagePath = path.join(__dirname, '..', 'public', 'img', 'image.png');


app.use(express.static(publicDirPath))

app.get('/mailImage/:id/:idMail', (req, res) => {
    const instance = openMail(req.params.id, req.params.idMail);

    if (instance) {
        io.to(instance.ownerID).emit('update', instance);
    }

    res.sendFile(imagePath);
})

io.on('connection', (socket) => {
    socket.on('join', (options, cb) => {
        const { error, instance } = addMailInstance({
            socketID: socket.id,
            ...options,
        });
        if (error) {
            return cb(error);
        }
        socket.join(instance.ownerID);

        io.to(instance.ownerID).emit('update', instance);
        cb();
    });

    socket.on('addMail', (ownerID) => {
        const instance = addMailToInstance(ownerID);
        io.to(instance.ownerID).emit('addMail', instance.mails[instance.mails.length - 1]);
    });

    socket.on('resetMail', ({ownerID, mailID}) => {
        const instance = resetMail(ownerID, mailID);
        io.to(instance.ownerID).emit('fullReload', instance);
    });

    socket.on('removeMail', ({ownerID, mailID}) => {
        const instance = removeMail(ownerID, mailID);
        io.to(instance.ownerID).emit('fullReload', instance);
    });

    socket.on('disconnect', () => {
        removeMailInstance(socket.id);
    });
});

server.listen(port, () => {
    console.log(`server up on port ${port}`);
});
