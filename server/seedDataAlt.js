const fs = require('fs');
const faker = require('faker');
const gaussian = require('gaussian');
const Listing = require('./dbAlt.js').Listing;
const db = require('./dbAlt.js').db;

const TOTAL_RECORDS = 10000000;
const BATCH_SIZE = 10000;
const TOTAL_BATCHES = TOTAL_RECORDS / BATCH_SIZE;
const priceGaussian = gaussian(150, 25);
const ratingsGaussian = gaussian(3.5, 0.5);

const buildFile = async () => {
	for (let i = 198; i < TOTAL_BATCHES; i++) {
		console.log(`${i} / ${TOTAL_BATCHES}`);
		await buildAndAppendBatch(i);
	}
	console.log('done');
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
			newObj['locationId'] = batchNum * BATCH_SIZE + j;
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
				let tempListing = {};
				tempListing['locationId'] = Math.floor(Math.random() * 10000000);
				let randomImageNumber = Math.floor(Math.random() * 100) + 1;
				tempListing['imageUrl'] = `https://s3.us-east-1.amazonaws.com/starkillersystems/images/${randomImageNumber}.jpg`;
				tempListing['description'] = faker.company.catchPhraseDescriptor();
				tempListing['title'] = faker.address.streetAddress();
				tempListing['price'] = Math.floor(priceGaussian.ppf(Math.random()));
				tempListing['num_reviews'] = Math.floor(Math.random() * 50);
				tempListing['avg_rating'] = precisionRound(Math.min(ratingsGaussian.ppf(Math.random()), 5), 2);
				let numberKeywords = Math.floor(Math.random() * 5);
				let keywords = [];
				for (let i = 0; i < numberKeywords; i++) {
					keywords.push(faker.company.catchPhraseAdjective());
				}
				tempListing['keywords'] = keywords;
				tempListing['bedrooms'] = Math.floor(Math.random() * 5) + 1;
				similarListings.push(tempListing);
			}
			newObj['similarListings'] = similarListings;
			batch.push(newObj);
		}
		Listing.insertMany(batch, (err, docs) => {
			if (err) {
				reject(err);
			} else {
				resolve(1);
			}
		})
	})
}

db.once('open', () => {
  // we're connected!
  console.log('we are connected!');
  buildFile();
});