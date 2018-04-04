module.exports = (app) => {

  const http = require('http');
  const server = http.createServer(app)
  const port = process.env.PORT || 4000;
  const socketIo = require('socket.io');
  const io = socketIo(server)

  let isTimerOn = false
  let isTimerEnd = false
  let isBetOn = false
  let isBetCompleted = false
  let isExecuteOn = false
  let betCompleted = 'undefined'

  let betStart = new Set()

  io.on("connection", socket => {

    console.log("New client connected")

    socket.on("BetStart", async data => {

      try {

        await betStart.add(data.account)
        betStartArr = [...betStart]
        await console.log("betStart: ", betStart)

        if( !isTimerOn && !isBetOn ){

          isTimerOn = true, isBetOn = true, isTimerEnd = false

          await betTimer(data.countDown)

          let response = {
              isBetOn: isBetOn,
              account: betStartArr
          }

          let betOn = setInterval(() => {

            response.account = betStartArr

            io.sockets.emit("BetOn", response)

            if( !isBetOn ) {
              clearInterval(betOn)
              setTimeout(() => {
                let response = {
                    isBetOn: isBetOn,
                    account: betStartArr
                }
                io.sockets.emit("BetOn", response)
                console.log("BetOn: " , response)
              }, 1500)
            }

          }, 1000)

          console.log(data.countDown,'TimerStart')

        } else {

          console.log('another bet added.')
        }

      } catch (e) {

        console.log(e)

      }

    })

    socket.on("BetResponse", async numberOfBets => {

      try {

        if ( betStart.size === numberOfBets ){

          isBetCompleted = true

          if ( betCompleted === 'undefined' ){

            betCompleted = await setInterval(() => {
              let response = {
                isBetCompleted: isBetCompleted
              }
              io.sockets.emit("BetCompleted", response)
              console.log("BetCompleted: " , response)

              if ( isExecuteOn || (betStart.size !== numberOfBets) ){

                isBetCompleted = false
                clearInterval(betCompleted), betCompleted = 'undefined'

                setTimeout(() => {
                  let response = {
                    isBetCompleted: isBetCompleted
                  }
                  io.sockets.emit("BetCompleted", response)
                }, 1500)

              }

            }, 1000)

          }

        }

      } catch (e) {
        console.log(e)
      }

    })

    socket.on("ExecuteStart", async data => {

      isExecuteOn = true

      let response = {
        isExecuteOn: isExecuteOn,
        isTimerEnd: isTimerEnd
      }

      try {

        let executeOn = await setInterval(() => {
          io.sockets.emit("ExecuteOn", response)
          console.log("ExecuteOn", response)

          if ( isExecuteOn === false){

            clearInterval(executeOn)
            isTimerEnd = false

            setTimeout(() => {
              let response = {
                isExecuteOn: isExecuteOn,
                isTimerEnd: isTimerEnd
              }
              io.sockets.emit("ExecuteOn", response)
              console.log("ExecuteOn", response)
            }, 1500)

          }

        }, 1000)

      } catch (e) {
        console.log(e)
      }

    })

    socket.on("ExecuteResponse", data => {
      isExecuteOn = false, betStart.clear()
      console.log("ExecuteEnd!")
    })

    socket.on("disconnect", () => console.log("Client disconnected."))

  })

  const betTimer = async (countDown) => {

    try {

      let timer = await setInterval(() => {

        countDown--

        let response = {
          countDown: countDown,
          isTimerOn: isTimerOn,
          isTimerEnd: isTimerEnd
        }

        io.sockets.emit("FromBetTimer", response)

        if(countDown <= 0) {

          clearInterval(timer)

          isTimerOn = false, isBetOn = false, isTimerEnd = true

          let timerEnd = setInterval(() => {
            io.sockets.emit("TimerEnd", isTimerEnd)
            console.log("TimerEnd", isTimerEnd)
            if ( isExecuteOn ) clearInterval(timerEnd)
          }, 1000)

          setTimeout(() => {
            let response = {
              countDown: countDown,
              isTimerOn: isTimerOn,
              isTimerEnd: isTimerEnd
            }
            io.sockets.emit("FromBetTimer", response)
            console.log('isTimerEnd')

          }, 1500)

          console.log('isTimerEnd')
          console.log('isTimerOn: ', isTimerOn, 'isBetOn: ', isBetOn, 'isTimerEnd', isTimerEnd)

        }

      }, 1000)

    } catch (error) {

      console.error(`Error: ${error}`)

    }

  }

  server.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  return io

}
