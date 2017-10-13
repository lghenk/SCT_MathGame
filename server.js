const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
const viewPath = __dirname + '/views/';

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render(viewPath + 'index');
  res.end();
});

server.listen(port, () => {
  console.log("Magic is happening at http://localhost:" + port)
});
