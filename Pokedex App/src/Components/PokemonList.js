import React, { Component } from "react";
import axios from "axios";
class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokeList: [],
      prevUrl: "",
      currentUrl: "https://pokeapi.co/api/v2/pokemon",
    };
    this.nextResults = this.nextResults.bind(this);
  }

  componentDidMount() {
    axios.get(this.state.currentUrl).then((res) => {
      let data = res.data.results;
      const boo = data.map((item, index) => {
        return {
          name: item.name,
          img: `https://pokeres.bastionbot.org/images/pokemon/${index + 1}.png`,
        };
      });

      this.setState({
        pokeList: boo,
        currentUrl: res.data.next,
      });
    });
  }
  nextResults(e) {
    console.log(e.target.innerText);
    if (e.target.innerText === "Next") {
      axios.get(this.state.currentUrl).then((res) => {
        let data = res.data.results;
        const boo = data.map((item) => {
          return {
            name: item.name,
            img: `https://pokeres.bastionbot.org/images/pokemon/${+item.url.split(
              "/"
            )[6]}.png`,
          };
        });
        this.setState({
          pokeList: boo,
          currentUrl: res.data.next,
          previousUrl: res.data.previous,
        });
      });
    } else {
      axios.get(this.state.previousUrl).then((res) => {
        let data = res.data.results;
        const boo = data.map((item) => {
          return {
            name: item.name,
            img: `https://pokeres.bastionbot.org/images/pokemon/${+item.url.split(
              "/"
            )[6]}.png`,
          };
        });
        this.setState({
          pokeList: boo,
          currentUrl: res.data.next,
          previousUrl: res.data.previous,
        });
      });
    }
  }
  prevPage() {}
  render() {
    if (this.state.pokeList.length <= 0) {
      return "Loading...";
    } else {
      return (
        <div className="container">
          <div className="poke-btn">
            <button onClick={this.nextResults}>Next</button>
            <button onClick={this.nextResults}>Previous</button>
          </div>
          <ul className="list-group">
            {this.state.pokeList.map((item) => (
              <li className="pokemon-li" key={item.name}>
                <p className="pokemon-list">
                  {" "}
                  {item.name}
                  <img
                    className="pokeball"
                    src="data:image/png;base64,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"
                    alt="pokeball"
                  />
                </p>
                <img src={item.img} alt="" id="poke-img" />
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

export default PokemonList;
