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
                io.emit('queue-request-reponse', {
                    discordId: payload.discordID,
                    gameID: payload.gameID,
                    queueId: payload.queueID,
                    ownerId: payload.ownerID,
                    players: payload.players
                })
            }
            else{
                let q = new queue(payload.queueID, payload.gameID, payload.players_needed, payload.players, payload.filters);
                searchingQueues.push(q);
                io.emit('queue-request-reponse', {
                    discordId: payload.discordID,
                    gameID: payload.gameID,
                    queueId: payload.queueID,
                    ownerId: payload.ownerID,
                    players: payload.players
                })
                return;
            }
            return;
        })
    })

    socket.on('queue-abandon-request', payload =>{
        if(discordID == payload.queue.ownerID) {
            io.emit('queue-quit-announcement', { queueID:payload.queueID })
        }
        else{
            io.emit('queue-leave-announcement', {
                queueID: payload.queueID,
                discordID: payload.discordID
            })
        }
        return;
    })

    socket.on('queue-play-request', payload =>{
        let q = searchingQueues.find(o => (o.queueID - payload.queueID));
        if(payload.ownerID == q.ownerID) {
            // webhook signal to squadup discord to start game @mike
            playingQueues.push(q);
            searchingQueues.splice(q, 1);
            io.emit('queue-play-announcement', { queueID: payload.queueID })
        }
    })

    socket.on('queue-quit-request', payload => {
        let q = playingQueues.find(o => (o.queueID));
        if(payload.queueID == q.queueID) {
            if(q.players.find(payload.discordID)){
                //send webhook to discord to end game @mike
                io.emit('queue-quit-announcement', { queueID: payload.queueID})
            }
        }
        return;
    })
})

module.exports = io;