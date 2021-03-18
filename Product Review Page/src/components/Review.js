import React, { useState } from "react";
import styles from "../../public/index.css";
import { FaStar } from "react-icons/fa";

const MoreRatings = (props) => {
  const { ratingsType } = props;
  const categories = [
    "Delivery",
    "Discounts",
    "Description Match",
    "Photo Match",
    "Packaging",
    "Price",
  ];
  const moreRatings = ratingsType.map((item, index) => {
    return (
      <p className={styles.starsGroupContainer} key={Math.random() * 100000}>
        {categories[index]} : <div className="starGroup">{item}</div>
      </p>
    );
  });
  return moreRatings;
};

const Review = (props) => {
  const {
    title,
    useful,
    name,
    comment,
    ratings: {
      Overall,
      delivery_time: delivery,
      discounts_and_offers: discounts,
      matches_description: matchDesc,
      matches_photo: photoMatch,
      packaging,
      price,
    },
  } = props;
  const starsCount = [];
  for (let i = 0; i < Overall; i++) {
    starsCount.push(<FaStar className={styles.stars} key={i} size={20} />);
  }
  for (let i = Overall; i < 5; i++) {
    starsCount.push(<FaStar key={i} size={20} className={styles.plainStars} />);
  }
  const categoryStarsCount = [
    delivery,
    discounts,
    matchDesc,
    photoMatch,
    packaging,
    price,
  ];

  let starsArr = [];

  for (let i = 0; i < categoryStarsCount.length; i++) {
    for (let j = 0; j < categoryStarsCount[i]; j++) {
      starsArr.push(
        <FaStar
          className={styles.stars}
          key={Math.random() * 10000}
          size={20}
        />
      );
    }

    for (let j = categoryStarsCount[i]; j < 5; j++) {
      starsArr.push(
        <FaStar
          key={Math.random() * 10000}
          size={20}
          className={styles.plainStars}
        />
      );
    }
  }

  const slice = [...starsArr];
  const splittedArray = [];
  while (slice.length > 0) {
    splittedArray.push(slice.splice(0, 5));
  }

  const allRatingsArr = (
    <MoreRatings key={Math.random() * 10000} ratingsType={splittedArray} />
  );

  const [ratingShow, setRatingShow] = useState(false);

  const handleRatings = (e) => {
    // console.log(e, e.target.parentElement);
    if (ratingShow) {
      setRatingShow(false);
    } else {
      setRatingShow(true);
    }
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewOwner}>
        <h3>{name}</h3>
        <div className={styles.ratingContainer}>
          <small>{starsCount}</small>
          <h3>{title}</h3>
        </div>
      </div>
      <div className={styles.reviewContent}>
        <p>{comment}</p>
      </div>
      <div className={styles.moreRatingContainer}>
        <p>Usefulness of comment : {useful}</p>
        <button onClick={handleRatings}>More</button>
      </div>
      {ratingShow ? (
        <div className={styles.allRatingsContainer}>{allRatingsArr}</div>
      ) : null}
    </div>
  );
};

export default Review;
