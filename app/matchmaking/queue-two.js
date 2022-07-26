const axios = require("axios");
const {Webhook} = require('discord-webhook-node');
const webhookURL = process.env.WEBHOOK_URL;

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
var queues = 1;
const newQueue = () => {
    queues++;
    return queues;
};

// Takes 2 ints, i and j, and sees if they're within n units of each other
const withinN = (i, j, n) => {
    console.log(`seeing if ${i} and ${j} are within ${n} of each other...`)
    return (-n <= i-j && i-j <= n);
};

// counts matching items between 2 arrays and sees if they're withinN of each other. 
const arraysCloseEnough = (arr1, arr2, n) => {
    let combinedLen = [...arr1, ...arr2].length;
    console.log("Total length of combined arrays: ", combinedLen);
    return (withinN(combinedLen, arr1.length, n));
};

// Takes a payload and a Queue object, and sees if the Queue and payload are a good match for each other. 
// Returns: true if requests are similar enough, false otherwise. 
const fuzzyMatch = async (pl, q) => {
    if (pl.gameId == q.gameId) { // if same game
        // if almost same # players needed (on a bigger system, n would be 0)
        if (withinN(q.players.length, pl.players_needed, 3)) {
            let filtsMatch = Object.keys(pl.filters).map(filt => {
                // make sure this case fits well enough
                switch (typeof pl.filters[filt]) {
                    case "number":
                        let i = q.filters[filt];
                        let j = pl.filters[filt];
                        if (!(i >= j || withinN(i, j, 6)))
                            return false; // stop early if levels don't match
                        break;
                    case "object": // always an array in our app's use case
                        if (!arraysCloseEnough(pl.filters[filt], q.filters[filt], 4))
                            return false; // stop early if not enough similarities
                        break;
                    case "boolean":
                        if (pl.filters[filt] != q.filters[filt])
                          return false;
                        break;
                    default: // should never happen
                        console.log("default case encountered? ", filt, pl.filters[filt]);
                        return false;
                }
                return true;
            });
            if (filtsMatch) {
              // filter out blocked players
              return await axios.post(`${process.env.URL_ROOT_SERVER}/api/viewBlocked`, {discordID: pl.discordID})
              .then(res => {
                if (res.data) {
                  console.log("viewBlocked data: ", res.data);
                  let blockedIDs = res.data;
                  let intersection = blockedIDs.filter(element => q.discordID.includes(element));
                  if(intersection){
                    console.log("At least of your queue members is blocked");
                    return false;
                  }
                  else {
                    // Any other things to add will go in here!!
                    return true;
                  }
                }
              })
            }
        }
    }
    return false; // if anything fails, return false!
}


let io;
exports.socketConnection = (server) => {
  io = require('socket.io')(server, {
    cors:{
        origin: process.env.URL_ROOT_CLIENT,
    },
    rejectUnauthorized: false
  });
  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
    socket.on('ping', () => {
      io.emit('pong');
    })
    
    socket.on('queue-request', async (payload) =>{
        console.log("queue request received. Looking through searchingQueues:");
        searchingQueues.forEach(element => {
            console.log("element: ", element);
            if(fuzzyMatch(payload, element)) { // see if queue is a good fit
                element.players_needed -= 1;
                element.players.push(payload.discordId);
                console.log("Putting player into queue ", element.queueId);
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
                    discordAvatar: `https://cdn.discordapp.com/avatars/${payload.discordId}/${payload.avatar}.png`,
                    players_needed: element.players_needed
                });
                return;
            }
        });
        let q = new Queue(newQueue(), payload.gameId, payload.players_needed, [payload.discordId], payload.filters, payload.discordId);
        searchingQueues.push(q);
        console.log("searchingQueues after push: ", searchingQueues);
        
        io.emit('queue-request-response', {
            discordId: payload.discordId,
            gameId: q.gameId,
            queueId: q.queueId,
            ownerId: q.ownerId,
            players: q.players,
            players_needed: payload.players_needed
        });
        console.log("queue request response sent!");
    })
  });
};

exports.sendMessage = (key, message) => io.emit(key, message);