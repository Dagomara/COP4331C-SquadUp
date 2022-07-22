const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors:{
        origin: process.env.URL_ROOT_CLIENT,
    }
});

class queue{
    constructor(queueID, gameID, players_needed, players=[], filters={}){
        this.queueID = queueID;
        this.gameID = gameID;
        this.players_needed = players_needed;
        this.players = players;
        this.filters = filters;
    }

}
const searchingQueues = [];
const playingQueues = [];

io.on('connection', socket =>{
    console.log('connection made successfully');
    socket.on('queue-request', payload =>{
        searchingQueues.forEach(element => {
            if(element.filters == payload.filters) {
                // send qrr payload
            }
            else{
                var q = new queue(payload.queueID, payload.gameID, payload.players_needed, payload.players, payload.filters);
                searchingQueues.push(q);
                // send qrr payload
                return;
            }
            return;
        })
    })

    socket.on('queue-request-response', payload =>{
        
    })

    socket.on('queue-join-announcement', payload =>{
        
    })

    socket.on('queue-abandon-request', payload =>{
        if(discordID == payload.queue.ownerID) {
            //send queue quit anouncement
        }
        return;
    })

    socket.on('queue-play-request', payload =>{
        
    })

    socket.on('queue-play-announcement', payload =>{
        
    })

    socket.on('queue-quit-request', payload =>{
        
    })

    socket.on('queue-quit-announcement', payload =>{
        
    })
})

module.exports = io;