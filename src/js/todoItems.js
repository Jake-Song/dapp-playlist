import React from 'react'
import './../css/todoItems.css'

class TodoItem extends React.Component{
  constructor(props){
    super(props)
  }

  handleDelete(){
    this.props.onDelete(this.props.item)
  }

  render(){
    return(
      <li>
        <div className="todo-item">
          <span className="item-name">{this.props.item}</span>
          <span className="item-delete" onClick={this.handleDelete.bind(this)}>X</span>
        </div>
      </li>
    )
  } // render

} // class

module.exports = TodoItem;
