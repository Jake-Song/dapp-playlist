const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app)
const io = socketIo(server)

let isTimerOn = false

io.on("connection", socket => {
  console.log("New client connected")

  socket.on("Start", async data => {
    console.log(isTimerOn)
    if(!data.isStart && !isTimerOn ){
      isTimerOn = true
      await getApiAndEmit(data.countDown)
      console.log(data,'Start')
    } else {
      console.log('another bet added.')
    }
  })

  socket.on("disconnect", () => console.log("Client disconnected."))
})

const getApiAndEmit = async (countDown) => {
  try {
    var interval
    var countDown = countDown
    var isStart = true
    var bettingIsDone

    io.sockets.emit("TimeGetDown", isStart)

    interval = await setInterval(() => {
      countDown--
      io.sockets.emit("FromAPI", countDown)
      if(countDown <= 0) {

        let data = {
          isStart: false,
          bettingIsDone: true
        }

        io.sockets.emit("TimeIsUp", data)
        clearInterval(interval), interval = 'undefined', isTimerOn = false
        console.log(isTimerOn)
      }
    }, 1000)


  } catch (error) {
    console.error(`Error: ${error}`)
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
