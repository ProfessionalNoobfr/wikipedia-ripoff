var searched = false
import { io } from "https://cdn.socket.io/4.8.3/socket.io.esm.min.js";
const socket = io("https://wikipedia-ripoff.onrender.com")

document.getElementById("searchbtn").addEventListener("click", function(event){
    const query = document.getElementById("searchbox")
    var value = query.value
    searched = true
    if (query){
        pullresults(query.value)
        socket.emit("newsearch")
    }
})

document.getElementById("clearresults").addEventListener("click", function(event){
    const results = document.getElementById("results")   
    results.innerHTML = ""
    socket.emit("newsearch")
})

document.addEventListener("click", function(event){
    if (event.target){
        if (event.target.className == "query"){
            search(event.target.innerHTML)
        }

    }
})

const observer = new IntersectionObserver((entries) => {
    for (let entry of entries){
        if (entry.isIntersecting) {
            entry.target.classList.add('enter');
        }
    }
});

async function search(query) {
    const url = new URL(`https://en.wikipedia.org/w/api.php`)
    url.searchParams.set("origin", "*")
    url.searchParams.set("format", "json")
    url.searchParams.set("action", "parse")
    url.searchParams.set("prop", "text")
    url.searchParams.set("page", query)
    const results = document.getElementById("results")   
    results.innerHTML = ""
    const res = await fetch(url)
    const data = await res.json()
    console.log(data.parse.text["*"])
    console.log(data)
    display(data.parse.text["*"])
}

async function pullresults(query) {
    const url = new URL(`https://en.wikipedia.org/w/api.php`)
    url.searchParams.set("origin", "*")
    url.searchParams.set("format", "json")
    url.searchParams.set("action", "query")
    url.searchParams.set("list", "search")
    url.searchParams.set("srsearch", query)

    const res = await fetch(url)
    const data = await res.json()
    displayreults(data.query.search)
}

async function display(table) {
    const results = document.getElementById("results")
    var newelement = document.createElement("div")
    newelement.innerHTML = table
    newelement.className = "result generaleffect"
    observer.observe(newelement)
    results.append(newelement)
}

async function displayreults(table) {
    const results = document.getElementById("results")
    for (let result of table){
        var newelement = document.createElement("div")
        newelement.innerHTML = `<h1>${result.title}</h1><p>${result.snippet}</p>`
        newelement.className = "result generaleffect"
        newelement.id = "queryresult" + result.pageid
        observer.observe(newelement)
        results.append(newelement)
        socket.emit("syncresults", newelement.id, newelement.innerHTML, newelement.tagName, newelement.style.left,newelement.style.top)
    }
}
