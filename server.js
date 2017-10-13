const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
const viewPath = __dirname + '/views/';

var currentlyActivePlayers = [];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render(viewPath + 'index');
  res.end();
});


io.on('connection', (socket) => {
  console.log("OOOOOOOOH WE HAVE A NEW FRIEND TO PLAY WITH");
  currentlyActivePlayers.push(socket);

  socket.on('setName', (data) => {
    console.log("Our new friend has given their name: " + data.name);
    getMySocket(socket).name = data.name;
  })

  socket.on('disconnect', (socket) => {
    console.log("Our friend has left.. How sad");
  })
});

server.listen(port, () => {
  console.log("Magic is happening at http://localhost:" + port);
});

function getMySocket(socket) {
  return currentlyActivePlayers[currentlyActivePlayers.indexOf(socket)];
}