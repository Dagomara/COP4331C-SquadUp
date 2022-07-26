const axios = require("axios");
const {Webhook} = require('discord-webhook-node');
const webhookURL = process.env.WEBHOOK_URL;

class Queue{
    constructor(queueId, gameId, players_needed, players=[], filters={}, ownerId){
      console.log(`Making a new queue for the owner ${ownerId} with ${players_needed} players needed on game ${gameId}...`)
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
              console.log("Got pretty far with queue #", q.queueId, ". Seeing if anyone's blocked...");
              // filter out blocked players
              let hasBlocked = false;
              await axios.post(`${process.env.URL_ROOT_SERVER}/api/viewBlocked`, {discordID: pl.discordID})
              .then(res => {
                if (res.data) {
                  console.log("viewBlocked data: ", res.data);
                  let blockedIDs = res.data;
                  let intersection = blockedIDs.filter(element => q.discordID.includes(element));
                  console.log("intersection: ", intersection);
                  if(intersection && intersection[0]){
                    console.log("At least one of your queue members is blocked");
                    hasBlocked = true;
                    return;
                  }
                }
              });
              if (hasBlocked)
                return false;
              // All other checking code goes afer this!
              //...
              console.log("fuzzyMatch: Join was a success for ", pl.discordId, `into queue ${q.queueId}!`);
              return true;
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
        let joinedExisting = false;
        searchingQueues.forEach(async (element) => {
            console.log("element: ", element);
            let matches = await fuzzyMatch(payload, element);
            console.log("Matches result: ", matches);
            if(matches) { // see if queue is a good fit
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
                console.log("Sent the thingies. searchingQueues now: ", searchingQueues);
                joinedExisting = true;
                return;
            }
        });
        if (joinedExisting == true)
          return;
        // If an existing queue was not found, make a new one for this player!
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
    });

    socket.on('queue-leave-request', payload =>{
      console.log("queue leave request received. Processing...");
      if(payload.discordId == payload.ownerId) {
          console.log("Queue is being abandoned!");
          io.emit('queue-abandon-announcement', { queueId:payload.queueId })
          //todo: remove this queue from searchingQueues
      }
      else{
          let q = searchingQueues.find(o => (o.queueId == payload.queueId));
          console.log("I think I found ", payload.queueId);
          if (q) { // make sure it found one!
            let index = searchingQueues.findIndex(o => (o.queueId == payload.queueId));
            q.players_needed -= 1;
            q.players.splice(index, 1);
            console.log("Sending a queue leave announcement!");
            io.emit('queue-leave-announcement', {
                queueId: payload.queueId,
                discordId: payload.discordId,
                players: q.players,
                players_needed: q.players_needed
            });
          }
      }
      return;
    })

    socket.on('queue-play-request', payload =>{
      console.log("queue play request received. Processing...");
      let q = searchingQueues.find(o => (o.queueId == payload.queueId));
      if (q) { // make sure it found one!
        let index = searchingQueues.findIndex(o => (o.queueId == payload.queueId)); // for moving to other array
        if(payload.discordId == q.ownerId) {
            // webhook signal to squadup discord to start game @mike
            const hook = new Webhook(webhookURL);
            hook.send("start " + q.players.join(" "));

            console.log("searchingQueues before: ", searchingQueues);
            playingQueues.push(q);
            searchingQueues.splice(index, 1);
            console.log("searchingQueues after: ", searchingQueues);
            io.emit('queue-play-announcement', { queueId: payload.queueId })
            console.log("queue play announcement sent out!")
        }
      }
    })

    socket.on('queue-quit-request', payload => {
      console.log("queue quit request received. Processing...");
      let q = playingQueues.find(o => (o.queueId == payload.queueId));
      if(q && q.players.find(o => (o == payload.discordId))){
          //send webhook to discord to end game @mike
          const hook = new Webhook(webhookURL);
          hook.send("end " + q.players.join(" "));
          io.emit('queue-quit-announcement', { queueId: payload.queueId});
      }
      return;
    })
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  })
  
};

exports.sendMessage = (key, message) => io.emit(key, message);