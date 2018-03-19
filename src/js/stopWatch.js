import React from 'react'
import './../css/stopWatch.css'

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)


class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: 60,
      laps: [],
      lastClearedIncrementer: null,
    };
    this.incrementer = null
  }

  componentDidMount(){
    // if(this.state.secondsElapsed !== 0){
    //   this.state.secondsElapsed = parseInt(localStorage.getItem('seconds'))
    // }
  }

  componentDidUpdate(){
    localStorage.setItem('seconds', this.state.secondsElapsed)
  }

  handleStartClick() {
    var moment = new Date()
    var countDownTime = moment.setTime(moment.getTime() + (1000 * 60))
    this.incrementer = setInterval( () => {

      let now = new Date().getTime()
      let distance = countDownTime - now

      this.setState({
        secondsElapsed: Math.floor(distance / 1000),
      })
    }, 1000);
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    this.setState({
      secondsElapsed: 60,
      laps: [],

    });
  }

  handleLabClick() {
    this.setState({
      laps: this.state.laps.concat([this.state.secondsElapsed])
    })
  }

  render() {

     window.addEventListener("load", event => {

        const cachedSeconds = parseInt(localStorage.getItem('seconds'))

        if(cachedSeconds){
          this.setState({
            secondsElapsed: cachedSeconds
          })

          this.handleStartClick()

          return
        }

    })

    if(this.state.secondsElapsed === 0){
      clearInterval(this.incrementer)
    }

    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(this.state.secondsElapsed)}</h1>
      </div>
    );
  }
}

module.exports = Stopwatch
