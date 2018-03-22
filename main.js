const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 4001;

const app = express();
const server = http.createServer(app)
const io = socketIo(server)

let interval
let countDown = 300

io.on("connection", socket => {
  console.log("New client connected")
  socket.on("Reset", data => {
    countDown = data
    console.log(countDown,'Reset')
  })
  socket.on("Start", async data => {
    await getApiAndEmit()
    console.log(data,'Start')
  })

  socket.on("disconnect", () => console.log("Client disconnected."))
})

const getApiAndEmit = async () => {
  try {

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
