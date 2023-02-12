
let socket=io("http://localhost:9000") //   The "/" namespace endpoint
let socket2=io("http://localhost:9000/admin") // the "admin" namespace endpoint

socket.on('connect',()=>{
    console.log(socket.id)
})

socket2.on('connect',()=>{
    console.log(socket2.id)
})

socket2.on('welcome',(msg)=>{
    console.log(msg)
})


socket.on("messageFromServer",(datafromServer)=>{
    console.log(datafromServer)
    socket.emit("messageToServer",{data:"This is message from Client"})
})

document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault()
    // console.log("FORM SUBMITTED!!")
    const newMessage=document.querySelector("#user-message").value;
    socket.emit("newMessageToServer",{text:newMessage})
})

socket.on('messageToClients',(msg)=>{
    console.log(msg)
    document.querySelector("#messages").innerHTML+=`<li>${msg.text}</li>`
})

