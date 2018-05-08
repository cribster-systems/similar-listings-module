import React from 'react';
import prevArrow from '../dist/arrow-slider-left.png';
import styles from './style.css';


const PrevArrow = ({onClick, decrementIndex, currentIndex}) => {
  let visibilityState = (currentIndex > 0 ) ? "visible" : 'hidden';
  return (
      <span
          style={{visibility: visibilityState}}
          className="slick-arrow"
          onClick={onClick}
      >
          <img src={prevArrow} className={styles.prevArrow} />
      </span>
  );
}

export default PrevArrow;