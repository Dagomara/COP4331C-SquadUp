//socketio stuff here
const server = require('http').createServer(app);


const io = require('socket.io')(server, {
    cors:{
        origin: process.env.URL_ROOT_CLIENT,
    }
});

const searchingQueues = [];
const playingQueues = [];

io.on('connection', socket =>{
    console.log('connection made successfully');
    socket.on('queue-join-request', payload =>{ // "send generic json payload"
        console.log('Message received on server: ', payload);
        io.emit('message', payload);
    });
    socket.on('queue-abandon-request', payload =>{ // "send generic json payload"
        console.log('Message received on server: ', payload);
        io.emit('message', payload);
    });
});


module.exports = io;