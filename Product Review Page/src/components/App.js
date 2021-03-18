import React, { Component, useState } from "react";
import styles from "../../public/index.css";
import axios from "axios";
import Review from "./Review";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueProduct: "--Choose here--",
      valueViewer: "--Choose here--",
      showReviewList: [],
      totalReviews: [],
      currentPage: 0,
      optionError: "",
      loading: false,
    };
  }
  handleInputChange(e) {
    this.setState({
      valueProduct: e.target.value,
    });
  }
  handleViewChange(e) {
    this.setState({
      valueViewer: e.target.value,
    });
  }
  fetchReviews(Event) {
    Event.preventDefault();
    if (!isNaN(+this.state.valueProduct) && !isNaN(+this.state.valueViewer)) {
      this.setState({
        optionError: "",
        loading: true,
        totalReviews: [],
      });
      axios
        .get(
          `https://www.i2ce.in/reviews/${this.state.valueProduct}/${this.state.valueViewer}`
        )
        .then((data) => {
          const res = data.data.reviews;
          const reviewList = res.map((review, index) => {
            return (
              <Review
                key={index}
                title={review.title}
                useful={review.usefulness}
                comment={review.comment}
                name={review.friend ? review.reviewer.name : "Anonymous"}
                ratings={review.ratings}
              />
            );
          });

          const slice = [...reviewList];
          const splittedArray = [];
          while (slice.length > 0) {
            splittedArray.push(slice.splice(0, 3));
          }
          this.setState({
            totalReviews: splittedArray,
            showReviewList: splittedArray[this.state.currentPage],
            loading: false,
          });
        })
        .catch(() => {
          throw new Error("Something Went Wrong, check status code.");
        });
    } else {
      this.setState({
        optionError: " Choose both you sick!!",
      });
    }
  }
  handlePage(e) {
    if (e.target.innerText === "Next") {
      this.setState(({ currentPage, totalReviews }) => {
        if (currentPage + 1 < totalReviews.length) {
          currentPage = currentPage + 1;
        } else {
          currentPage = totalReviews.length - 1;
        }
        return {
          currentPage: currentPage,
          showReviewList: totalReviews[currentPage],
        };
      });
    } else {
      this.setState(({ currentPage, totalReviews }) => {
        if (currentPage - 1 > totalReviews.length) {
          currentPage = currentPage - 1;
        } else {
          currentPage = 0;
        }
        return {
          currentPage,
          showReviewList: totalReviews[currentPage],
        };
      });
    }
  }

  render() {
    return (
      <div>
        <h1 className={styles.header}>Review Page</h1>
        <form className={styles.reviewsForm}>
          <label htmlFor="product-input">
            Select Product :{" "}
            <select
              onChange={this.handleInputChange.bind(this)}
              value={this.state.valueProduct}
              id="product-id"
            >
              <option value="--Choose here--">--Choose here--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
          </label>

          <label htmlFor="product-input">
            Select viewer :{" "}
            <select
              onChange={this.handleViewChange.bind(this)}
              value={this.state.valueViewer}
              id="viewer-id"
            >
              <option value="--Choose here--">--Choose here--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <p>"Viewer Id" {this.state.valueViewer}</p>
            <p>'Product Id' {this.state.valueProduct}</p>
          </label>
          <button className={styles.btn} onClick={this.fetchReviews.bind(this)}>
            Submit
          </button>
          {this.state.optionError ? (
            <div className={styles.optionErrorContainer}>
              {this.state.optionError}
            </div>
          ) : null}
        </form>
        {this.state.loading ? (
          <div className={styles.loading}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        ) : null}

        {this.state.totalReviews.length > 0 ? (
          <h1>
            Total reviews found :{" "}
            {this.state.totalReviews.flat(Infinity).length}
          </h1>
        ) : null}

        {this.state.totalReviews.length > 0 ? (
          <div className={styles.pageBtn}>
            <button onClick={this.handlePage.bind(this)}>Next</button>
            <button onClick={this.handlePage.bind(this)}>Previous</button>
          </div>
        ) : null}
        {this.state.totalReviews.length > 0 ? (
          <div className={styles.reviewContainer}>
            {this.state.currentPage === this.state.totalReviews.length - 1 &&
            this.state.totalReviews.length !== 1 ? (
              <h2>You reached the last page</h2>
            ) : null}
            {this.state.showReviewList}
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
