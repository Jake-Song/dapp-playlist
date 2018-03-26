const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app)
const io = socketIo(server)

let isTimerOn = false
let isBettingOn = false
let isBettingDone = false
let isExecutingOn = false

io.on("connection", socket => {
  console.log("New client connected")

  socket.on("TimerStart", async data => {
    console.log(isTimerOn)
    if( !isTimerOn && !isExecutingOn && !isBettingOn ){
      isTimerOn = true, isBettingOn = true
      await getApiAndEmit(data)
      console.log(data,'TimerStart')
    } else {
      console.log('another bet added.')
    }
  })

  socket.on("ExecuteStart", async data => {
    isExecutingOn = true
    console.log(data, isExecutingOn)
  })

  socket.on("ExecuteEnd", async data => {
    isExecutingOn = false
    isBettingDone = false
    console.log(data, 'isExecutingOn: ' + isExecutingOn, 'isBettingOn: ' + isBettingOn )
  })

  socket.on("disconnect", () => console.log("Client disconnected."))
})

const getApiAndEmit = async (countDown) => {
  try {
    var interval

    interval = await setInterval(() => {
      countDown--
      io.sockets.emit("FromAPI", countDown)
      if(countDown <= 0) {

        clearInterval(interval), interval = 'undefined'

        isBettingOn = false, isBettingDone = true, isTimerOn = false

        console.log('isBettingOn: ' + isBettingOn, 'isTimerOn: ' + isTimerOn, 'isBettingDone: ' + isBettingDone)

        let emitDone = setInterval(() => {
            io.sockets.emit("BettingIsDone", isBettingDone)
            console.log('isBettingDone: ', isBettingDone)
            if(!isBettingDone) clearInterval(emitDone), emitDone = 'undefined'
        }, 1000)
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
