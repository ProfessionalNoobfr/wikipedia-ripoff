const express = require("express");
const nunjucks = require("nunjucks");
const { sourceMapsEnabled } = require("process");
const { Socket } = require("socket.io");
const server = express();
const port = 3000;

server.engine("html", nunjucks.render);
server.set("view engine", "html");
server.use(express.static("public"));
const sqlite3 = require("sqlite3");
const { text } = require("stream/consumers");

const http = require('http').createServer(server);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const ElementPositions = new Map()
io.on("connection", socket =>{

  // save updated elements to the server so they can be synced on a refresh on a first load
  socket.on("updElement", (elementid, posx, posy, text) =>{
    ElementPositions.set(elementid, [posx, posy, text])
    io.emit("syncelement", elementid, posx, posy, text)
  })
  socket.on("newsearch", val=>{
    io.emit("newsearch")
  })

  socket.on("syncresults", (elementid, elementtext, type, posx, posy) =>{
    ElementPositions.set(elementid, [posx, posy, elementtext])
    io.emit("syncsearchelements", elementid, elementtext, type, posx, posy)
  })

  // onload we should sync positions between server -> client
  for (let data of ElementPositions.entries()){
    io.emit("onloadelements", data)
  }
})

server.get("/", (request, response) => {
  response.render("index");
});
server.get("/networked", (request, response) => {
  response.render("networked");
});

server.listen(port, () => {
  console.log(
    `Your local server is waiting for requests at 127.0.0.1:${port} or at localhost:${port}`
  );
});

http.listen(3001, () => {
  console.log(`http port and Express are now both listening on localhost:${port}, but http serves requests from ${3001}`);
});
