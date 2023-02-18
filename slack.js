const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces=require("./data/namespaces")
// console.log("namespaces+++++++++",namespaces[0])



app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);

const io = socketio(expressServer, {
  path: "/socket.io",
  serveClient: true,
});

// io.on===io.of("/").on
io.of("/").on("connection", (socket) => {
//  build an array to send  back with the img and endpoint for each NS
let nsData=namespaces.map((ns)=>{
  return {
    img:ns.img,
    endpoint:ns.endpoint
  }
})

// console.log(socket.handshake)  // for query object
// send the nsData back to the client.We need to use the socket ,Not IO,because we want it to go to just
// this client
socket.emit('nsList',nsData)

 

});
let clients
// loop through each namespace and listen for a connection
namespaces.forEach((namespace)=>{
  // console.log(namespace)

  // const thisNs=io.of(namespace.endpoint)
  // thisNs.on()

  // either we can do the method above or below
  // console.log(namespace.endpoint)
  io.of(namespace.endpoint).on('connection',(nsSocket)=>{

    const username=nsSocket.handshake.query.username
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)

    // A socket has connected to tone of our chat namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad",namespace.rooms)
    nsSocket.on('joinRoom', async (roomToJoin, numberOfUsersCB) => {
      // deal with history...

      const roomToLeave=Array.from(nsSocket.rooms)[1]
      nsSocket.leave(roomToLeave)
     updateMembers(namespace,roomToLeave)
      nsSocket.join(roomToJoin);

      const nsRoom=namespace.rooms.find((room)=>{
        return room.roomTitle === roomToJoin
      })

      nsSocket.emit('historyCatchUp',nsRoom.history)
      // Send  back the number of users in this room to all the sockets
      // connected to this room

      updateMembers(namespace,roomToJoin)
       
    });
    nsSocket.on('newMessageToServer',(msg)=>{

      console.log(username)

      const fullMsg={
        text:msg.text,
        time:Date.now(),
        username:username,
        avatar:'https://via.placeholder.com/30'
      }

      // console.log(fullMsg)
      // send this message to all the sockets that are in the room that this socket is in
      // console.log(nsSocket.rooms)
      //the user willbe in the 2nd room in the object list
      // this is because the socket ALWAYS joins its own room on connection
      // get the keys
      const roomTitle=Array.from(nsSocket.rooms)[1]
      // we need to find the room object for this room
      const nsRoom=namespace.rooms.find((room)=>{
        return room.roomTitle === roomTitle
      })

      nsRoom.addMessage(fullMsg);
      // console.log(nsRoom)


      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg)
    })

  })
})


async function updateMembers(namespace,roomToJoin){
  clients = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
  // console.log(Array.from(clients));

  // numberOfUsersCB(Array.from(clients).length);
  io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',Array.from(clients).length)
}