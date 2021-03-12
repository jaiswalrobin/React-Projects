import React, { Component } from "react";
import TodoItem from "./TodoItem";
import InputBox from "./InputBox";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        {
          id: 1,
          text: "Learn Javascript",
          completed: false,
        },
        {
          id: 2,
          text: "Learn React",
          completed: false,
        },
      ],
    };
  }
  updateTodoState(id) {
    return this.setState((pre) => {
      const updatedTodos = pre.todos.map((item) => {
        if (item.id === id) {
          item.completed = !item.completed;
        }
        return item;
      });
      return {
        todos: updatedTodos,
      };
    });
  }
  updateTodo(text) {
    const { todos } = this.state;
    let todo = {
      id: todos.length + 1,
      text: text,
      completed: false,
    };
    let updatedTodosArr = todos.concat([todo]);

    this.setState({
      todos: updatedTodosArr,
    });
  }

  //ClickHandler for Marking Todos as done
  clickHandler(id) {
    return this.setState((pre) => {
      const updatedTodos = pre.todos.map((item) => {
        if (item.id === id) {
          item.completed = !item.completed;
        }
        return item;
      });
      return {
        todos: updatedTodos,
      };
    });
  }

  render() {
    const TodosArr = this.state.todos.map((item) => {
      return (
        <TodoItem
          changeHandler={this.updateTodoState.bind(this)}
          key={item.text}
          todo={item.text}
          checked={item.completed}
          id={item.id}
          clickHandler={this.clickHandler.bind(this)}
        />
      );
    });

    return (
      <div className="container">
        <h1>
          Todo Ap<span className="last-letter">p</span>
        </h1>
        <div className="todo-container">
          <div className="input-container">
            <InputBox addTodo={this.updateTodo.bind(this)} />
          </div>
          {TodosArr}
          <div className="footer">
            <h5>Press Enter to add todo or click the + icon.</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
