const mongoose = require('mongoose');
mongoose.Promise = Promise;
const url = 'mongodb://localhost/starkillersystems';
mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('we are connected!');
});

let listingSchema = mongoose.Schema({
  id: Number,
  imageUrl: String,
  description: String,
  title: String,
  price: Number,
  num_reviews: Number,
  avg_rating: Number,
  keywords: [String],
  bedrooms: Number,
  similarListings: [Number]
});

const Listing = mongoose.model('Listing', listingSchema);

const save = (listingObj, callback) => {
  Listing.findOneAndUpdate({id: listingObj.id}, listingObj, {upsert: true, new: true}, (err, listing) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, listing);
    }
  })
};

const getSimilarListings = (id, callback) => {
  let query = {};
  query['id'] = id;
  Listing.findOne(query)
  .then((listing) => {
    let ids = listing.similarListings;
    return Listing.find({ id: {$in: ids} })
                  .sort({avg_rating: -1})
  })
  .then((listings) => {
    callback(null, listings);
  })
  .catch((err) => callback(err, null));

}

module.exports.save = save;
module.exports.getSimilarListings = getSimilarListings;
module.exports.Listing = Listing;