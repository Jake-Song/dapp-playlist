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
      isBettingDone: false,
      endpoint: "http://ec2-52-79-207-174.ap-northeast-2.compute.amazonaws.com:3000",
    };
    this.socket = socketIOClient(this.state.endpoint)
  }

  componentDidMount(){
    this.socket.on("FromAPI", data => this.setState({ countDown: data }))
    this.socket.on("BettingIsDone", data => this.setState({ isBettingDone: data }))
  }

  handleStartClick() {
    let countDown = 300
    this.socket.emit("TimerStart", countDown)
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
