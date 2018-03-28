module.exports = (app) => {
  const http = require('http');
  const server = http.createServer(app)
  const port = process.env.PORT || 4000;
  const socketIo = require('socket.io');
  const io = socketIo(server)

  let isTimerOn = false
  let isTimerEnd = false
  let isBetStart = false
  let isBetCompleted = false
  let isExecuteOn = false

  let betterStart = []
  let betterEnd = []

  io.on("connection", socket => {

    console.log("New client connected")

    socket.on("BetStart", async data => {

      await betterStart.push(data.transactionID)

      await console.log(betterStart)

      if( !isTimerOn && !isBetStart ){

        isTimerOn = true, isBetStart = true

        await betTimer(data.countDown)

        console.log(data.countDown,'TimerStart')

      } else {

        console.log('another bet added.')
      }
    })

    socket.on("BetReject", async data => {

      await betterStart.pop()

      console.log(data, betterStart)

      if( betterStart.length === betterEnd.length ){

        isBetCompleted = true

        let response = {
          isTimerEnd: isTimerEnd,
          isBetCompleted: isBetCompleted,
          isExecuteOn: isExecuteOn
        }

        let betCompleted = setInterval(() =>{

          if(isTimerEnd) response.isTimerEnd = true

          io.sockets.emit("BetCompleted", response)

          console.log('isBetCompleted: ', response)

          if(isExecuteOn || betterStart.length !== betterEnd.length){
            clearInterval(betCompleted)
            isBetCompleted = false
            response.isBetCompleted = isBetCompleted
            io.sockets.emit("BetCompleted", response)
            console.log('clear betCompleted: ', response)
          }

        }, 1000)

      }
    })

    socket.on("BetEnd", async data => {

      await betterEnd.push(data)

      console.log(betterEnd)

      if( betterStart.length === betterEnd.length ){

        isBetCompleted = true

        let response = {
          isTimerEnd: isTimerEnd,
          isBetCompleted: isBetCompleted,
          isExecuteOn: isExecuteOn
        }

        let betCompleted = setInterval(() =>{

          if(isTimerEnd) response.isTimerEnd = true

          io.sockets.emit("BetCompleted", response)

          console.log('isBetCompleted: ', response)

          if(isExecuteOn || betterStart.length !== betterEnd.length){
            clearInterval(betCompleted)
            isBetCompleted = false
            response.isBetCompleted = isBetCompleted
            io.sockets.emit("BetCompleted", response)
            console.log('clear betCompleted: ', response)
          }

        }, 1000)

      }
    })

    socket.on("ExecuteStart", async data => {

      isTimerEnd = false
      isBetCompleted = false
      isExecuteOn = true

      let response = {
        isTimerEnd: isTimerEnd,
        isBetCompleted: isBetCompleted,
        isExecuteOn: isExecuteOn
      }

      await console.log(data)

      let executeOn = setInterval(() => {

        io.sockets.emit("ExecuteOn", response)

        console.log("ExecuteOn: ", response)

        if(!isExecuteOn) clearInterval(executeOn)

      }, 1000)
    })

    socket.on("ExecutionReject", async data => {

      isTimerEnd = true
      isBetCompleted = true
      isExecuteOn = false

      await console.log(data)

      let response = {
        isTimerEnd: isTimerEnd,
        isBetCompleted: isBetCompleted,
        isExecuteOn: isExecuteOn
      }

      let rewinded = await setInterval(() =>{

        io.sockets.emit("BetCompleted", response)

        console.log('isBetCompleted: ', response)

        if(isExecuteOn) clearInterval(rewinded)

      }, 1000)

    })

    socket.on("ExecuteEnd", async data => {

      isExecuteOn = false

      let response = {
        isTimerEnd: isTimerEnd,
        isBetCompleted: isBetCompleted,
        isExecuteOn: isExecuteOn
      }

      betterStart = []
      betterEnd = []

      await console.log(
        data, 'isTimerEnd: ' + isTimerEnd, 'isBetCompleted: ' + isBetCompleted,
        betterStart, betterEnd
      )

      let executeOn = setTimeout(() => {
        io.sockets.emit("ExecuteCompleted", response)
        console.log('isExecuteOn: ', response.isExecuteOn)
      }, 1000)

    })

    socket.on("disconnect", () => console.log("Client disconnected."))
  })

  const betTimer = async (countDown) => {
    try {

      let timer = await setInterval(() => {

        countDown--

        io.sockets.emit("FromBetTimer", countDown)

        if(countDown <= 0) {

          clearInterval(timer)

          isTimerOn = false, isTimerEnd = true, isBetStart = false

          console.log('isTimerOn: ' + isTimerOn, 'isBetStart: ' + isBetStart, 'isTimerEnd: ' + isTimerEnd)

          let timerEnd = setInterval(() => {
              io.sockets.emit("TimerEnd", isTimerEnd)
              console.log('isTimerEnd: ', isTimerEnd)
              if(isBetCompleted) clearInterval(timerEnd)
          }, 1000)
        }
      }, 1000)

    } catch (error) {
      console.error(`Error: ${error}`)
    }
  }

  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
  });

  return io

}
