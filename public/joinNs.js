function joinNs(endpoint){

    // console.log("++++++++++++++++++",endpoint)

    if(nsSocket){
        // check to see if nsSocket is actually a socket
        nsSocket.close()
        // remove the eventlistener before it's added again
        document.querySelector('#user-input').removeEventListener('submit',formSubmission) 
    }

    nsSocket=io(`http://localhost:9000${endpoint}`)


    nsSocket.on('nsRoomLoad',(nsRooms)=>{
        // console.log("+++++++++++++++++++",nsRooms)
        let roomList=document.querySelector(".room-list")
        roomList.innerHTML=""
        nsRooms.forEach((room)=>{

            room.privateRoom?roomList.innerHTML+=`<li class="room"><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`
            :roomList.innerHTML+=`<li class="room"><span class="glyphicon glyphicon-globe"></span>${room.roomTitle}</li>`
        })

        // add a click listener to each room
        let roomNodes=document.getElementsByClassName('room');
        console.log(roomNodes)
        Array.from(roomNodes).forEach((elem)=>{
            elem.addEventListener('click',(e)=>{
                // console.log("Someone CLicked on ",e.target.innerText)
                joinRoom(e.target.innerText)
            })
        })

        // Add room automatically.... first time here
        const topRoom=document.querySelector('.room')
        const topRoomName=topRoom.innerText
        joinRoom(topRoomName)

    })

    nsSocket.on('messageToClients',(msg)=>{
        // console.log(msg)
        const newMsg=buildHTML(msg)
         document.querySelector("#messages").innerHTML+=newMsg
     })

    document.querySelector('.message-form').addEventListener('submit',formSubmission)
    
}

function formSubmission(event){
        event.preventDefault()
    // console.log("FORM SUBMITTED!!")
     const newMessage=document.querySelector("#user-message").value;
     nsSocket.emit("newMessageToServer",{text:newMessage})
    
}

function buildHTML(msg){
    const convertedDate=new Date(msg.time).toLocaleString()
    const newHTML=` <li>
    <div class="user-image">
        <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
        <div class="user-name-time">${msg.username}<span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>`
return newHTML
}