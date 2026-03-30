import { io } from "https://cdn.socket.io/4.8.3/socket.io.esm.min.js";
const socket = io("https://wikipedia-ripoff.onrender.com")
var elementselected = ""

document.addEventListener("mousemove",function(event){
    const clientx = event.clientX + document.getElementById("container").scrollLeft
    const clienty = event.clientY + document.getElementById("container").scrollTop

    const element = document.getElementById(elementselected)
    if (element != undefined){
        element.style.position = "absolute"
        element.style.transform = "none"
        element.style.top = clienty + "px"
        element.style.left = clientx + "px"
        socket.emit("updElement", element.id, clientx, clienty, element.innerHTML)
    }
})

document.addEventListener("click", function(event){
    console.log(event.target.classList)
    if (elementselected == event.target.id || event.target.classList.contains("nondraggable")){
        elementselected = ""
        
    }else{
        elementselected = event.target.id
    }
})

socket.on("onloadelements", (data) =>{
    console.log(data)
    const element = document.getElementById(data[0])
    const results = document.getElementById("results")
    if (element != undefined){
        element.style.transform = "none"
        element.style.top = data[1][1] + "px"
        element.style.left = data[1][0] + "px"
    }else{
        const elementnew = document.createElement("div")
        elementnew.style.transform = "none"
        elementnew.id = data[0]
        elementnew.style.top = data[1][1] + "px"
        elementnew.style.left = data[1][0] + "px"
        elementnew.innerHTML = data[1][2]
        elementnew.style.position = "relative"
        results.append(elementnew)
    }
})

socket.on("newsearchreq", (a) =>{
    var elementlist = document.getElementById("results").children
    for (let element of elementlist){
        console.log(element, element.id)
        socket.on("deleteprevious", element.id)
    }
    var elementlist = document.getElementById("results")
    elementlist.innerHTML = ""
})

socket.on("syncelement", (elementid, posx, posy, text) =>{
    const element = document.getElementById(elementid)
    const results = document.getElementById("results")
    if (element != undefined){
        element.style.transform = "none"
        element.style.top = posy + "px"
        element.style.left = posx + "px"
        element.style.position = "absolute"
        if (text){
            element.innerHTML = text
        }
    }
})
