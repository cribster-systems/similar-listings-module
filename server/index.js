const newRelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const db = require('./db.js');
const path = require('path');
const cors = require('cors');
const redisModule = require('redis');
const responseTime = require('response-time');
const port = process.env.PORT || 3000;
const host = process.env.NODE_ENV === 'production' ? '172.17.0.2' : '127.0.0.1';
const redis = redisModule.createClient('6379', '127.0.0.1');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
require('dotenv').config();

const app = express();



redis.on('error', (err) => {
  console.log('Error on redis', err);
})

app.use(morgan('dev'));
app.use(parser.json());
app.use(cors());
app.use(responseTime());

// app.use(':locationId', express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../client/dist')));

// Node cluster allows machine to utilize all cpu cores
if(cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i +=1) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  process.env.NODE_ENV === 'production' 
    ? app.use('/:locationId', express.static(path.join(__dirname, '../public'))) 
    : app.use('/:locationId', express.static(path.join(__dirname, '../client/dist')));

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
}
