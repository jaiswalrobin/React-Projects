import React, { Component } from "react";

class InputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  handleKeyUp(e) {
    const { addTodo } = this.props;

    const text = this.state.value.trim();
    if (e.keyCode === 13 && text) {
      addTodo(text);
      this.clear();
    }
  }
  handleClick() {
    const { addTodo } = this.props;
    const text = this.state.value.trim();
    if (text) {
      addTodo(text);
      this.clear();
    }
  }

  updateInput(e) {
    this.setState({
      value: e.target.value,
    });
  }
  clear() {
    this.setState({ value: "" });
  }

  render() {
    return (
      <>
        <input
          onChange={this.updateInput.bind(this)}
          type="text"
          placeholder="Enter the task here"
          value={this.state.value}
          onKeyUp={this.handleKeyUp.bind(this)}
        />
        <button onClick={this.handleClick.bind(this)} className="todo-btn">
          +
        </button>
      </>
    );
  }
}

export default InputBox;
