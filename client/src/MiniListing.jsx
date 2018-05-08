import React from 'react';
import ReactDOM from 'react-dom';
import Rating from './Rating.jsx';
import styles from './MiniListingStyle.css';


const MiniListing = ({data}) => {

  return (
    <div className={styles.miniListing}>
      <div>
        <img  className={styles.image} src={data.imageUrl} />
      </div>
        <div className={styles.listText}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.descridivtion}>{data.description}</div>
          <div className={styles.rating}>
            <Rating rating={data.avg_rating}/>
            <span className={styles.numReviews}>{data.num_reviews} reviews</span>
          </div>
        </div>
      </div>
  )

}

export default MiniListing;