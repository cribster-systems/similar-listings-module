import React from 'react';
import ReactDOM from 'react-dom';
import Slider from  'react-slick';
import styles from './style.css';
import Listing from './Listing.jsx';
import PrevArrow from './PrevArrow.jsx';
import NextArrow from './NextArrow.jsx';

class SimilarListings extends React.Component {

    constructor(props) {
      //need to change currentlistingID to passed down props id
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
      if (prevProps.currentListingId !== this.props.currentListingId) {
        this.fetchSimilarListings();
      }
    }

    fetchSimilarListings () {
      const url = (process.env.NODE_ENV === 'production') ? 'http://ec2-18-188-208-12.us-east-2.compute.amazonaws.com': 'http://localhost:3333'

      fetch(`${url}/rooms/${this.props.currentListingId}/similar_listings`)
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
      )
    };

}


// const exampleListings = [ { keywords: [ 'animated', 'happy', 'home' ],
// id: 1,
// imageUrl: 'https://s3.us-east-2.amazonaws.com/fantasybnb/images/1.jpg',
// description: 'ENTIRE HOUSE 1 BED',
// title: 'blablah Conch Street',
// price: 45,
// num_reviews: 96,
// avg_rating: 4.78,
// __v: 0 },
// { keywords: [ 'home', 'real' ],
// id: 2,
// imageUrl: 'https://s3.us-east-2.amazonaws.com/fantasybnb/images/2.jpg',
// description: 'ENTIRE APARTMENT 1 BED',
// title: '221b Baker Street',
// price: 199,
// num_reviews: 47,
// avg_rating: 3.29,
// __v: 0 },
// { keywords: [ 'home', 'animated' ],
// id: 4,
// imageUrl: 'https://s3.us-east-2.amazonaws.com/fantasybnb/images/4.jpg',
// description: 'ENTIRE HOUSE 3 BEDS',
// title: '742 Evergreen Terrace',
// price: 125,
// num_reviews: 28,
// avg_rating: 2.35,
// __v: 0 },
// { keywords: [ 'home', 'animated' ],
// id: 3,
// imageUrl: 'https://s3.us-east-2.amazonaws.com/fantasybnb/images/3.jpg',
// description: 'ENTIRE HOUSE 4 BEDS',
// title: '31 Spooner Street',
// price: 120,
// num_reviews: 64,
// avg_rating: 4.82,
// __v: 0 } ]

export default SimilarListings;
