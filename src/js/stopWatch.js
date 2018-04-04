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
      isBetOn: false,
      isBetCompleted: false,
      isTimerOn: false,
      isTimerEnd: false,
      isExecuteOn: false,
      endpoint: "localhost:4000",
    };
    this.socket = socketIOClient(this.state.endpoint)
  }

  componentDidMount(){
    this.socket.on("FromBetTimer", data => this.setState({ countDown: data.countDown, isTimerOn: data.isTimerOn, isTimerEnd: data.isTimerEnd }))
    this.socket.on("BetOn", data => this.setState({ isBetOn: data.isBetOn }))
    this.socket.on("BetCompleted", data => this.setState({ isBetCompleted: data.isBetCompleted }))
    this.socket.on("ExecuteOn", data => this.setState({ isExecuteOn: data.isExecuteOn, isTimerEnd: data.isTimerEnd }))

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
