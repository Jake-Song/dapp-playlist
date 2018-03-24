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
      endpoint: "localhost:3000",
    };
    this.socket = socketIOClient(this.state.endpoint)
  }

  componentDidMount(){
    this.socket.on("FromAPI", data => this.setState({ countDown: data }))
  }

  handleStartClick() {
    let countDown = 300
    this.socket.emit("Start", countDown)
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
