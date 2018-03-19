import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import TodoItem from './todoItems.js'
import AddItem from './AddItem.js'
import About from './about.js'
import './../css/index2.css'

class App extends React.Component{
  render(){
    return(
      <Router>
        <div>
          <Route exact path='/' component={TodoComponent}></Route>
          <Route path='/about' component={About}></Route>
        </div>
      </Router>
    )
  }
}

class TodoComponent extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      todos: ['wash up', 'eat some cheese', 'take a nap', 'buy flowers'],
      age: 30,
    }
  }

  render(){

    var todos = this.state.todos
    todos = todos.map(function(item, index){
      return(
        <TodoItem item={item} key={index} onDelete={this.onDelete.bind(this)} />
      )
    }.bind(this))

    return(
      <div id="todo-list">
        <Link to='/about'>About</Link>
        <p>The busiest people have the most leisure..</p>
        <p>{this.state.age}</p>
        <ul>{todos}</ul>
        <AddItem onAdd = {this.onAdd.bind(this)} />
      </div>
    )
  } // render

  onDelete(item){
    var updatedTodos = this.state.todos.filter(function(val, index){
      return item !== val
    })
    this.setState({
      todos: updatedTodos
    })
  }

  onAdd(item){
    var updatedTodos = this.state.todos;
    updatedTodos.push(item);
    this.setState({
      todos: updatedTodos
    })
  }

  componentWillMount(){
    console.log('componentWillMount')
  }

  componentDidMount(){
    console.log('componentDidMount')
  }

  componentWillUpdate(){
    console.log('componentWillUpdate')
  }

} // class

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)
