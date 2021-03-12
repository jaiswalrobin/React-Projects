import React, { Component } from "react";
import ReactDOM from "react-dom";
import PokemonList from "./Components/PokemonList";
import "../src/index.css";
class App extends Component {
  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <div className="pokemon-header-container">
            <img
              src="http://switchplayer.net/wp-content/uploads/2017/06/pokemon-820x461.png"
              alt="Pokemon Img"
              className="pokemon-header"
            />
          </div>

          <PokemonList />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
