function joinRoom(roomName) {
  // send this room name to the server

  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // we want to update the room total that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} User <span class="glyphicon glyphicon-user"></span>`;
  });

  nsSocket.on("historyCatchUp", (history) => {
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });

    messagesUl.scrollTo(0,messagesUl.scrollHeight)
  });

  nsSocket.on('updateMembers',(numMembers)=>{
    document.querySelector(".curr-room-num-users").innerHTML = `${numMembers} User <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  })
}
