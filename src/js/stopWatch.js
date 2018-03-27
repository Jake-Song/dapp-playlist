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
      isTimerEnd: false,
      isBetCompleted: false,
      isExecuteOn: false,
      endpoint: "localhost:3000",
    };
    this.socket = socketIOClient(this.state.endpoint)
  }

  componentDidMount(){
    this.socket.on("FromBetTimer", data => this.setState({ countDown: data }))
    this.socket.on("TimerEnd", data => this.setState({ isTimerEnd: data }))
    this.socket.on("BetCompleted", data => this.setState({ isBetCompleted: data }))
    this.socket.on("ExecuteOn", data =>
      this.setState({
        isTimerEnd: data.isTimerEnd,
        isBetCompleted: data.isBetCompleted,
        isExecuteOn: data.isExecuteOn
      })
    )
    this.socket.on("ExecuteCompleted", data =>
      this.setState({
        isExecuteOn: data.isExecuteOn
      })
    )
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
