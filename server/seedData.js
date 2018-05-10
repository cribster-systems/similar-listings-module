const fs = require('fs');
const faker = require('faker');
const gaussian = require('gaussian');
//const Listing = require('./db.js').Listing;

const TOTAL_RECORDS = 10000000;
const BATCH_SIZE = 10000;
const TOTAL_BATCHES = TOTAL_RECORDS / BATCH_SIZE;
const priceGaussian = gaussian(150, 25);
const ratingsGaussian = gaussian(3.5, 0.5);

// https://s3.us-east-1.amazonaws.com/starkillersystems/images/1-1.jpg

const buildFile = async () => {
	for (let i = 0; i < TOTAL_BATCHES; i++) {
		console.log(`${i} / ${TOTAL_BATCHES}`);
		await buildAndAppendBatch(i);
	}
}

const precisionRound = (number, precision) => {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

const buildAndAppendBatch = (batchNum) => {
	return new Promise((resolve, reject) => {
		let batch = [];
		for (let j = 0; j < BATCH_SIZE; j++) {
			let newObj = {};
			newObj['id'] = batchNum * BATCH_SIZE + j;
			let randomImageNumber = Math.floor(Math.random() * 100) + 1;
			newObj['imageUrl'] = `https://s3.us-east-1.amazonaws.com/starkillersystems/images/${randomImageNumber}.jpg`;
			newObj['description'] = faker.company.catchPhraseDescriptor();
			newObj['title'] = faker.address.streetAddress();
			newObj['price'] = Math.floor(priceGaussian.ppf(Math.random()));
			newObj['num_reviews'] = Math.floor(Math.random() * 50);
			newObj['avg_rating'] = precisionRound(Math.min(ratingsGaussian.ppf(Math.random()), 5), 2);
			let numberKeywords = Math.floor(Math.random() * 5);
			let keywords = [];
			for (let i = 0; i < numberKeywords; i++) {
				keywords.push(faker.company.catchPhraseAdjective());
			}
			newObj['keywords'] = keywords;
			newObj['bedrooms'] = Math.floor(Math.random() * 5) + 1;
			let similarListings = [];
			for (let i = 0; i < 12; i++) {
				similarListings.push(Math.floor(Math.random() * 10000000));
			}
			newObj['similarListings'] = similarListings;
			let stringObj = JSON.stringify(newObj);
			batch.push(stringObj);
		}
		let tempString = batch.join('\n') + '\n';
		fs.appendFile('data.json', tempString, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve(1);
			}
		});
	})
}

buildFile();

// let listingSchema = mongoose.Schema({
//   id: Number,
//   imageUrl: String,
//   description: String,
//   title: String,
//   price: Number,
//   num_reviews: Number,
//   avg_rating: Number,
//   keywords: [String],
// });

// 124 Conch Street,1,45,animated happy home,ENTIRE HOUSE 1 BED,96,4.78,https://s3.us-east-2.amazonaws.com/fantasybnb/images/1-1.jpg
// title, id, price, description, keywords, num_reviews, avg_rating, imageUrl