import React from 'react';
import rightArrow from '../dist/arrow-slider-right.png';
import styles from './style.css';

const NextArrow = ({onClick, incrementIndex, currentIndex, maxLength, debounceInc}) => {
  let visibilityState = (currentIndex < maxLength - 3 ) ? "visible" : 'hidden';
  return (
      <span
          style={{visibility: visibilityState}}
          className="slick-arrow"
          onClick={onClick}
      >
          <img src={rightArrow} className={styles.nextArrow}/>
      </span>
  );
}


export default NextArrow;