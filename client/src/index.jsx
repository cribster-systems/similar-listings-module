import React from 'react';
import ReactDOM from 'react-dom';
import Slider from  'react-slick';
import styles from './style.css';
import Listing from './Listing.jsx';
import PrevArrow from './PrevArrow.jsx';
import NextArrow from './NextArrow.jsx';
// const CSS = styles._getCss();

class SimilarListings extends React.Component {

    constructor(props) {
      //need to change currentlocationId to passed down props id
      super(props);
      this.state = {
        listings: [],
        index: 0,
        listingsLength: 4
      }

      this.fetchSimilarListings = this.fetchSimilarListings.bind(this);
    }

    componentDidMount () {
      this.fetchSimilarListings();
    }
    
    componentDidUpdate(prevProps) {
      if (prevProps.locationId !== this.props.locationId) {
        this.fetchSimilarListings();
      }
    }

    fetchSimilarListings () {
      const url = (process.env.NODE_ENV === 'production') ? 'http://similar-listings-final-lb-70799859.us-east-1.elb.amazonaws.com' : 'http://localhost:3333'

      fetch(`${url}/rooms/${this.props.locationId}/similar_listings`)
        .then(response => response.json())
        .then(
          (listings) => {
            this.setState({
              listings: listings,
              index: 0,
              listingsLength: listings.length
            })
          },
    
          (error)=> {
            console.log('sorry error!', error);
          }  
      )
    }

    render () {

      var settings = {
        slidesToShow: 3,
        slidesToScroll: 1, 
        arrows: true,
        infinite: false,
        nextArrow: <NextArrow  currentIndex = {this.state.index} maxLength = {this.state.listingsLength}/>,
        prevArrow: <PrevArrow currentIndex = {this.state.index}/>,
        afterChange: current => this.setState({index: current})
      };

      return (
        <div>
          { /* <style>{CSS}</style> */ }
          <div className={styles.listings}>
          <h1 className={`${styles.header} ${styles.font} `}>Similar listings</h1>
              <Slider {...settings}>
              {
                this.state.listings.map((listing, index) => {
                  return <Listing key={index} data={listing} index={index}/>
                })
              }
              </Slider>
          </div>
        </div>
      )
    };

}

export default SimilarListings;
