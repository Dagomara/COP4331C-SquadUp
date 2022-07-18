// (MOTL): "More On That Later"

// user sends this first
socket.on("queue-request", {discordId: 321321,
  gameID: 13,
  players_needed: 5,
  filters: {}
}, () => {
  for item in searchingQueues:
    if item matches filters:
      make proper queue-request-response;
      send the q-r-r;
      return;
    else:
      start a new, empty queue;
      send the q-r-r;
      return;
})

// server sees if this player can be fit into any existing queues (MOTL).
// IF not, make them a new queue object (MOTL).
// regardless, the Queue arrays (MOTL) will be updated in some way.

// server sends the player who joined:
"queue-request-response", {
  discordId: 091273987,
  queueId: 24,
  ownerId: 190273098,
  players: [],
  other queue stuff
}
// and sends any other players in the Queue:
"queue-join-announcement", {
  queueId: 24,
  discordId: 321321, // of player who joined
  discordAvatar: "912u3098sndofihsoEWu091" // I can get this for you Leo
}

// At this point, everyone in the Queue is up-to-date on who's there.

socket.on("queue-abandon-request", {
  queueId: 24,
  discordId: 321321
}, () => {
  if discordId == Queue.ownerID {
    send queue-quit-announcement;
  }
  return;
})

// Queue owners can start the game whenever they're ready:
socket.on("queue-play-request", {
  queueId: 24,
  ownerId: 190273098 // will just be the id of the player who sent the request,
                     // for validation purposes
}, () => {
  if (ownerId == searchingQueues.map(o for o.queueId = queueId))
    send webhook signal to squadup discord to start game;
    move Queue to playingQueues [];
    send queue-play-announcement;
  return;
})

// server validates, moves the Queue into playingQueues[] (MOTL)
// server sends to all users:
"queue-play-announcement", {
  queueId: 24
}

// At the same time, the queueId + discordIDs will be webhooked
// towards our Discord server; I'll manage that.
// The game has begun.

// From here, anyone can send:
socket.on("queue-quit-request", {
  queueId: 24,
  discordId: 6424234 // id of person who requested
} () => {
  if discordID is in Queue.players:
    send webhook to discord to end game;
    send queue-quit-announcemnt;
  return;
})

// server validates, and sends to all connected users:
"queue-quit-announcement", {
  queueId: 24
}

// At the same time, the queueId will be webhooked into Discord, and the call will be cancelled.
// Queue object is removed from playingQueues[] (MOTL).
// The game is over!

/*----------------------*/

// The server stores Queues as objects in arrays:
let newQueue = {
  queueId: 24,
  game: 5,
  players_needed: 4,
  players: [091273987],
  filters: {}
}

// The server will have two Queue arrays for navigating all of this:
const searchingQueues = [];
const playingQueues = [];

// Obviously, Queue objects will begin in searchingQueues, later be moved to playingQueues,
// and finally be destroyed when the game is over (or if the server crashes; rn these are not
// stored on MongoDB).
