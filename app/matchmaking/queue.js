const express = require('express');
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


const queues = 1;
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
const fuzzyMatch = (pl, q) => {
    if (pl.gameId == q.gameId) { // if same game
        // if almost same # players needed (on a bigger system, n would be 0)
        if (withinN(q.players.length, pl.players_needed, 3)) {
            Object.keys(pl.filters).map(filt => {
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
            })
            // TODO: filter out blocked players
        }
    }
    return false; // if anything fails, return false!
}



module.exports = {
  qReqHandle: (payload) => {
      console.log("queue request received. Looking through searchingQueues:");
      searchingQueues.forEach(element => {
          console.log("element: ", element);
          if(fuzzyMatch(payload, element)) { // see if queue is a good fit
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
                  discordAvatar: `https://cdn.discordapp.com/avatars/${payload.discordId}/${payload.avatar}.png`,
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
  },

  qLeaveHandle: (payload) => {
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
  },

  qPlayHandle: (payload) => {
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
  },

  qQuitHandle: (payload) => {
      let q = playingQueues.find(o => (o.queueId == payload.queueId));
      if(q.players.find(o => (o == payload.discordId))){
          //send webhook to discord to end game @mike
          const hook = new Webhook(webhookURL);
          hook.send("end" + q.players.join(" "));
          io.emit('queue-quit-announcement', { queueId: payload.queueId});
      }
      return;
  }
};