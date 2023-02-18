
let socket=io("http://localhost:9000") //   The "/" namespace endpoint
let nsSocket=""
// listen for the nslist which is the lsit of all the namespaces
socket.on('nsList',(nsData)=>{
    console.log("the List of namespaces has arrived")
    let namespacesDiv=document.querySelector('.namespaces');
    namespacesDiv.innerHTML="";
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML+=`<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"/></div>`
    })

    // Add a click lstener for Each NS
    // console.log(document.getElementsByClassName('namespace'))
    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        // console.log(elem)
        elem.addEventListener('click',(e)=>{
            const nsEndpoint = elem.getAttribute('ns');
            console.log(`${nsEndpoint} I should go to now`)
            joinNs(nsEndpoint)
        })
      
    })
    joinNs("/wiki")
})





