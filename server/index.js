const newRelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
//const morgan = require('morgan');
const db = require('./db.js');
const path = require('path');
const cors = require('cors');
const redisModule = require('redis');
const responseTime = require('response-time');
const port = process.env.PORT || 3333;
const host = process.env.NODE_ENV === 'production' ? '54.145.232.124' : '127.0.0.1';
const redis = redisModule.createClient('6379', host);
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
require('dotenv').config();

const app = express();



redis.on('error', (err) => {
  console.log('Error on redis', err);
})

// app.use(morgan('dev'));
app.use(parser.json());
app.use(cors());
// app.use(responseTime());

// Node cluster allows machine to utilize all cpu cores
// if (cluster.isMaster) {

//   // Fork workers
//   for (let i = 0; i < numCPUs; i +=1) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     cluster.fork();
//   });
// } else {
app.use('/:locationId', express.static(path.join(__dirname, '../client/dist')));

app.get('/healthcheck', (req, res) => {
  res.status(200);
  res.end('health check passed');
})

app.get('/rooms/:locationId/similar_listings', (req, res) => {

  const id = req.params.locationId;

  redis.get(id, (err, result) => {
    if (result) {
      res.send(JSON.parse(result));  
    } else {
      db.getSimilarListings(id, (err, listings) => {
        if (err) {
          res.status(404);
          res.end(err);
        } else {
          redis.setex(id, 300, JSON.stringify(listings));
          res.status(200);
          res.send(listings);
        }
      });
    }
  });
});

app.post('/rooms/:locationId', (req, res) => {

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

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

//}