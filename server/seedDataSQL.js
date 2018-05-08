const fs = require('fs');
const faker = require('faker');
const gaussian = require('gaussian');
//const Listing = require('./db.js').Listing;

const TOTAL_LISTING_RECORDS = 10000000;
const TOTAL_KEYWORD_RECORDS = 1000;

const LISTING_BATCH_SIZE = 10000;
const LISTING_KEYWORD_SIZE = 100;

const TOTAL_LISTING_BATCHES = TOTAL_LISTING_RECORDS / LISTING_BATCH_SIZE;

const priceGaussian = gaussian(150, 25);
const ratingsGaussian = gaussian(3.5, 0.5);

// https://s3.us-east-1.amazonaws.com/starkillersystems/images/1-1.jpg
// let price = listing.price;
// let upperPrice = price + 100;
// let lowerPrice = price - 100;
// let keywords = listing.keywords;
// let numberKeywords = keywords.length;
// let currentId = listing.id;
// SELECT * FROM listings 
//	INNER JOIN listings_keywords ON (listings.id = listings_keywords.listingId) 
//	INNER JOIN keywords ON (keywords.id = listings_keywords.keywordId)
//	WHERE ((listings.price BETWEEN lowerPrice AND upperPrice) AND array_length(keywords))
//	ORDER BY listings.avg_rating DESC
//	LIMIT 12;

const buildFile = async (columns, fileName, buildFunction, total_batches) => {
	// await writeHeader(columns, fileName);
	for (let i = 0; i < total_batches; i++) {
		console.log(`${i} / ${total_batches}`);
		await buildFunction(i, fileName);
	}
}

const buildJoinTableFile = async (columns, fileName, buildFunction, total_batches) => {
	// await writeHeader(columns, fileName);
	let listingKeywordId = 1;
	for (let i = 0; i < total_batches; i++) {
		console.log(`${i} / ${total_batches}`);
		listingKeywordId = await buildFunction(i, fileName, listingKeywordId);
	}
}

// const writeHeader = (columns, fileName) => {
// 	return new Promise((resolve, reject) => {
// 		let columnString = columns.join('|') + '\n';
// 		fs.appendFile(fileName, columnString, (err) => {
// 			if (err) {
// 				reject(err)
// 			} else {
// 				resolve(1);
// 			}
// 		});
// 	})
// }

const buildAndAppendListingsBatch = (batchNum, fileName) => {
	return new Promise((resolve, reject) => {
		let batch = [];
		for (let j = 0; j < LISTING_BATCH_SIZE; j++) {
			let newRow = [];
			newRow.push(batchNum * LISTING_BATCH_SIZE + j);
			let randomImageNumber = Math.floor(Math.random() * 100) + 1;
			newRow.push(`https://s3.us-east-1.amazonaws.com/starkillersystems/images/${randomImageNumber}.jpg`);
			newRow.push(faker.company.catchPhraseDescriptor());
			newRow.push(faker.address.streetAddress());
			newRow.push(Math.floor(priceGaussian.ppf(Math.random())));
			newRow.push(Math.floor(Math.random() * 50));
			newRow.push(Math.min(ratingsGaussian.ppf(Math.random()), 5));
			batch.push(newRow.join('|') + '\n');
		}
		let tempString = batch.join('');
		fs.appendFile(fileName, tempString, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve(1);
			}
		});
	})
}

const buildAndAppendKeywordsBatch = (batchNum, fileName) => {
	return new Promise((resolve, reject) => {
		let batch = [];
		let store = {};
		for (let i = 0; i < LISTING_KEYWORD_SIZE; i++) {
			let newRow = [];
			newRow.push(i);
			let continueSearch = true;
			while (continueSearch) {
				let newKeyword = faker.company.catchPhraseAdjective();
				if (!(newKeyword in store)) {
					newRow.push(newKeyword);
					store[newKeyword] = true;
					continueSearch = false;
				}
			}
			batch.push(newRow.join('|') + '\n');
		}
		let tempString = batch.join('');
		fs.appendFile(fileName, tempString, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve(1);
			}
		});
	})
}

const buildAndAppendListingsKeywordsBatch = (batchNum, fileName, listingKeywordId) => {
	return new Promise((resolve, reject) => {
		let batch = [];
		for (let i = 0; i < LISTING_BATCH_SIZE; i++) {
			let numberKeywords = Math.floor(Math.random() * 5);
			for (let j = 0; j < numberKeywords; j++) {
				let newRow = [];
				newRow.push(listingKeywordId++);
				newRow.push(batchNum * LISTING_BATCH_SIZE + i);
				let keywordId = Math.floor(Math.random() * 100);
				newRow.push(keywordId);
				batch.push(newRow.join('|') + '\n');
			}
		}
		let tempString = batch.join('');
		fs.appendFile(fileName, tempString, (err) => {
			if (err) {
				reject(err)
			} else {
				resolve(listingKeywordId);
			}
		});
	})
}


// buildFile(['id', 'imageUrl', 'description', 'title', 'price', 'num_reviews', 'avg_rating'], 'listings.csv', buildAndAppendListingsBatch, TOTAL_LISTING_BATCHES);
// buildFile(['id', 'keyword'], 'keywords.csv', buildAndAppendKeywordsBatch, 1);
// buildJoinTableFile(['id', 'listingId', 'keywordId'], 'listings_keywords.csv', buildAndAppendListingsKeywordsBatch, TOTAL_LISTING_BATCHES);// let listingSchema = mongoose.Schema({

// COPY listings FROM 'listings.csv' WITH (FORMAT csv);
// COPY keywords FROM 'keywords.csv' WITH (FORMAT csv);
// COPY listings_keywords FROM 'listings_keywords.csv' WITH (FORMAT csv);

// \copy listings FROM 'listings.csv' DELIMITER '|' CSV
// \copy keywords FROM 'keywords.csv' DELIMITER '|' CSV
// \copy listings_keywords FROM 'listings_keywords.csv' DELIMITER '|' CSV

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