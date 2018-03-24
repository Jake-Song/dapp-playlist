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
      isStart: false,
      bettingIsDone: false,
      endpoint: "http://ec2-52-79-207-174.ap-northeast-2.compute.amazonaws.com:3000",
    };
    this.socket = socketIOClient(this.state.endpoint)
  }

  componentDidMount(){
    this.socket.on("FromAPI", data => this.setState({ countDown: data }))
    this.socket.on("TimeGetDown", data => this.setState({ isStart: data }))
    this.socket.on("TimeIsUp", data =>
      this.setState({
        isStart: data.isStart,
        bettingIsDone: data.bettingIsDone,
      })
    )
  }

  handleStartClick() {
    let data = {
      countDown: 300,
      isStart: this.state.isStart,
    }
    this.socket.emit("Start", data)
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
