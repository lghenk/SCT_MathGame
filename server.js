const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');

const port = process.env.PORT || 3000;
const viewPath = __dirname + '/views/';

var currentlyActivePlayers = [];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render(viewPath + 'index');
  res.end();
});

app.get('/leaderboard', (req, res) => {
  fs.readFile('score.json', (err, data) => {
    if (err) {
      data = null;
    } else {
      data = JSON.parse(data).sort();
    }  

    res.render(viewPath + 'leaderboard', {
      leaderboard: data
    });
    res.end();
  });
});

io.on('connection', (socket) => {
  console.log("OOOOOOOOH WE HAVE A NEW FRIEND TO PLAY WITH");
  currentlyActivePlayers.push(socket);

  socket.on('setName', (data) => {
    console.log("Our new friend has given their name: " + data.name);
    getMySocket(socket).name = data.name;
  });

  socket.on('finished', (data) => {
    console.log("Oooh someone has finished the test");
    saveScore(getMySocket(socket), data);
  });

  socket.on('disconnect', (socket) => {
    console.log("Our friend has left.. How sad");
  });
});

server.listen(port, () => {
  console.log("Magic is happening at http://localhost:" + port);
});

function saveScore(socket, testData) {

  //if(fs.existsSync(''))

  fs.readFile('score.json', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        let d = [];
        d.push({name: socket.name, data: testData});

        fs.writeFile('score.json', JSON.stringify(d), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
        return;
      }
  
      throw err;
    }
  
    let oldData = JSON.parse(data);
    oldData.push({name: socket.name, data: testData});
    fs.writeFile('score.json', JSON.stringify(oldData), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });
}

function getMySocket(socket) {
  return currentlyActivePlayers[currentlyActivePlayers.indexOf(socket)];
}