const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app)
const io = socketIo(server)

let interval

io.on("connection", socket => {
  console.log("New client connected")
  
  socket.on("Start", async data => {
    await getApiAndEmit()
    console.log(data,'Start')
  })

  socket.on("disconnect", () => console.log("Client disconnected."))
})

const getApiAndEmit = async () => {
  try {

    let countDown = 300

    if(!interval){
      interval = await setInterval(() => {
        countDown--
        io.sockets.emit("FromAPI", countDown)
        if(countDown <= 0) clearInterval(interval)
      }, 1000)
    } else {
      setInterval(() => io.sockets.emit("FromAPI", countDown), 1000)
    }
  } catch (error) {
    console.error(`Error: ${error.code}`)
  }
}

app.engine('ejs', require('express-ejs-extend'));
app.set('views', './views')
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.render('index')
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
