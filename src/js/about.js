import React from 'react'
import {Link} from 'react-router-dom'

class About extends React.Component {
  render(){
    return(
      <div>
        <Link to='/'>TodoList</Link>
        <h2>All about me</h2>
      </div>
    )
  }
}

module.exports = About
