{(this.state.secondsElapsed === 0 ||
  this.incrementer === this.state.lastClearedIncrementer
  ? <Button className="start-btn" onClick={this.handleStartClick.bind(this)}>start</Button>
  : <Button className="stop-btn" onClick={this.handleStopClick.bind(this)}>stop</Button>
)}

{(this.state.secondsElapsed !== 0 &&
  this.incrementer !== this.state.lastClearedIncrementer
  ? <Button onClick={this.handleLabClick.bind(this)}>lab</Button>
  : null
)}


{(this.state.secondsElapsed !== 0 &&
  this.incrementer === this.state.lastClearedIncrementer
  ? <Button onClick={this.handleResetClick.bind(this)}>reset</Button>
  : null
)}

<ul className="stopwatch-laps">
  { this.state.laps.map((lap, i) =>
      <li className="stopwatch-lap"><strong>{i + 1}</strong>/ {formattedSeconds(lap)}</li>)
  }
</ul>

/** verbose component before 0.14
class Button extends React.Component {
  render() {
    return <button type="button" {...this.props}
                   className={"btn " + this.props.className } />;
  }
}
*/

const Button = (props) =>
  <button type="button" {...props} className={"btn " + props.className } />;
