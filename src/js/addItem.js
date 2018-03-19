import React from 'react'
import './../css/addItem.css'

class AddItem extends React.Component{
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <form action="" id="add-todo" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" ref={(input) => { this.newItem = input; }} required />
        <input type="submit" value="Hit me" />
      </form>
    )
  } //render

  handleSubmit(event){
    event.preventDefault()
    this.props.onAdd(this.newItem.value)
  }
}

module.exports = AddItem
