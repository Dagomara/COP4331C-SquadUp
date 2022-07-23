const server = require('http').createServer(app);
const {Webhook} = require('discord-webhook-node');
const webhookURL = process.env.WEBHOOK_URL;

const io = require('socket.io')(server, {
    cors:{
        origin: process.env.URL_ROOT_CLIENT,
    }
});

class Queue{
    constructor(queueId, gameId, players_needed, players=[], filters={}, ownerId){
        this.queueId = queueId;
        this.gameId = gameId;
        this.players_needed = players_needed;
        this.players = players;
        this.filters = filters;
        this.ownerId = ownerId;
    }
}
const searchingQueues = [];
const playingQueues = [];
const queues = 1;
const newQueue = () => {
    queues++;
    return queues;
};

io.on('connection', socket =>{
    console.log('connection made successfully');
    socket.on('queue-request', payload =>{
        searchingQueues.forEach(element => {
            if(element.filters == payload.filters) {
                element.players_needed -= 1;
                element.players.push(payload.discordId);

                io.emit('queue-request-reponse', {
                    discordId: payload.discordId,
                    gameId: element.gameId,
                    queueId: element.queueId,
                    ownerId: element.ownerId,
                    players: element.players,
                    players_needed: element.players_needed
                });
                io.emit('queue-join-announcement', {
                    queueId: element.queueId,
                    discordId: payload.discordId, // of player who joined
                    discordAvatar: null, // TODO MongoDB call must grab this
                    players_needed: element.players_needed
                });
                return;
            }
        });
        let q = new Queue(newQueue, payload.gameId, payload.players_needed, [payload.discordId], payload.filters, payload.discordId);
        searchingQueues.push(q);
        io.emit('queue-request-reponse', {
            discordId: payload.discordId,
            gameId: q.gameId,
            queueId: q.queueId,
            ownerId: q.ownerId,
            players: q.players,
            players_needed: payload.players_needed
        });
    })

    socket.on('queue-leave-request', payload =>{
        if(payload.discordId == payload.ownerId) {
            io.emit('queue-abandon-announcement', { queueId:payload.queueId })
        }
        else{
            let q = searchingQueues.find(o => (o.queueId == payload.queueId));
            let index = searchingQueues.findIndex(o => (o.queueId == payload.queueId));
            q.players_needed -= 1;
            q.players.splice(index, 1);
            io.emit('queue-leave-announcement', {
                queueId: payload.queueId,
                discordId: payload.discordId,
                players: q.players,
                players_needed: q.players_needed
            });
        }
        return;
    })

    socket.on('queue-play-request', payload =>{
        let q = searchingQueues.find(o => (o.queueId == payload.queueId));
        let index = searchingQueues.findIndex(o => (o.queueId == payload.queueId));
        if(payload.ownerId == q.ownerId) {
            // webhook signal to squadup discord to start game @mike
            const hook = new Webhook(webhookURL);
            hook.send("start" + q.players.join(" "));

            console.log("searchingQueues before: ", searchingQueues);
            playingQueues.push(q);
            searchingQueues.splice(index, 1);
            console.log("searchingQueues after: ", searchingQueues);
            io.emit('queue-play-announcement', { queueId: payload.queueId })
        }
    })

    socket.on('queue-quit-request', payload => {
        let q = playingQueues.find(o => (o.queueId == payload.queueId));
        if(q.players.find(o => (o == payload.discordId))){
            //send webhook to discord to end game @mike
            const hook = new Webhook(webhookURL);
            hook.send("end" + q.players.join(" "));
            io.emit('queue-quit-announcement', { queueId: payload.queueId});
        }
        return;
    })
})

module.exports = io;