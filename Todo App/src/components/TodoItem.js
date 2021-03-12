import React from "react";

function TodoItem(props) {
  const { checked, todo, id } = props;
  let style = "";
  checked ? (style = "true") : "false";
  return (
    <div className="todo">
      <input
        type="checkbox"
        onChange={() => props.changeHandler(id)}
        checked={checked}
      />
      <span
        onClick={() => props.clickHandler(id)}
        style={style === "true" ? { textDecoration: "line-through" } : null}
      >
        {todo}
      </span>
    </div>
  );
}

export default TodoItem;
