import React from 'react'
import ReactDOM from 'react-dom'
import socketIOClient from 'socket.io-client'

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      isStart: false,
    }
  }

  componentDidMount(){
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.on("FromAPI", data => this.setState({ response: data.countDown }))
  }

  render(){
    const { response } = this.state
    return(
      <div style={{ textAlign: "center" }}>
        {response ?
          <p>
            countDown : {formattedSeconds(response)}
          </p>
        : <p>Loading...</p>}
        <button onClick={this.reset.bind(this)}>Reset</button>
        <button onClick={this.start.bind(this)}>Start</button>
      </div>
    )
  }

  start(){
    if(this.state.isStart === false){
      const { endpoint } = this.state
      const socket = socketIOClient(endpoint)
      this.setState({
        isStart: true
      })
      socket.emit("Start", this.state.isStart)
    }
  }

  reset(){
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    let countDown = 300
    socket.emit("Reset", countDown)
  }

}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
