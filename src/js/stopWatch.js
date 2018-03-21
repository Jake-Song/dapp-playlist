import React from 'react'
import socketIOClient from 'socket.io-client'
import './../css/stopWatch.css'

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)


class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: 0,
      endpoint: "http://127.0.0.1:4001",
    };
  }

  componentDidMount(){
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.on("FromAPI", data => this.setState({ countDown: data }))
  }

  handleStartClick() {
    let countDown = 300
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.emit("Start", countDown)
  }
  
  render() {

    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(this.state.countDown)}</h1>
      </div>
    );
  }
}

module.exports = Stopwatch
