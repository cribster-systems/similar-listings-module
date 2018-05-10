const newRelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const db = require('./db.js');
const path = require('path');
const cors = require('cors');
const redisModule = require('redis');
const responseTime = require('response-time');

const app = express();

const redis = redisModule.createClient('6379', '127.0.0.1');

redis.on('error', (err) => {
  console.log('Error on redis', err);
})

app.use(morgan('dev'));
app.use(parser.json());
app.use(cors());
app.use(responseTime());

// app.use(':locationId', express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/rooms/:listingId/similar_listings', (req, res) => {

  const id = req.params.listingId;

  // redis.get(id, (err, result) => {
  //   if (result) {
  //     res.send(JSON.parse(result));  
  //   } else {
  db.getSimilarListings(id, (err, listings) => {
    if (err) {
      res.status(404);
      res.end(err);
    } else {
      // redis.setex(id, 300, JSON.stringify(listings));
      res.status(200);
      res.send(listings);
    }
  });
  //   }
  // });
});

app.post('/rooms/:listingId', (req, res) => {

  let listingObj = req.body;
  db.save(listingObj, (err, listing) => {
    if (err) {
      res.status(500);
      res.end();
    } else {
      res.send(listing);
    }
  })

});


let port = 3333;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

