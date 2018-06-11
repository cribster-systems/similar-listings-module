# Cribster: similar listings service

> Project description

## Related Projects

  - https://github.com/cribster-systems/images-service
  - https://github.com/cribster-systems/booking-service-module
  - https://github.com/cribster-systems/reviews-service-module

## Development
For this project, I scaled the backend of the similar listings microservice for a housing rental platform after inheriting a legacy codebase. To simulate production scale, 10 million records were added to the database.

### Microservice Architecture and Database Schema Design
First, any computations to determine similar listings for a given listing were decoupled from the retrieval of similar listings and moved to a separate recommendation service that operates as a batch process.

Next, two different databases and database schemas were tested. For the first schema, the value for the similar listings field in the database is simply an array containing the ids of the twelve similar listings (MongoDB) or there was a separate join table that contained twelve rows for every listing for each of its similar listings (PostgreSQL). The second schema (only MongoDB) denormalized the data. In this schema, the value for the similar listings field was an array of objects that held all relevant data for each of the similar listings. Two downsides to denormalizing data are the increase in storage space and the fact that anytime information for a listing is updated, that listing must be updated along with everywhere it appears as a similar listing. The latter is mitigated by the fact that a listing can have at most twelve similar listings. A listing should only appear elsewhere as a similar listing approximately twelve times so the number of write operations associated with an update to a listing should be relatively limited. The upside to denormalizing data is much faster read operations and this was borne out in testing with Artillery.

Stress Testing (local machine) with Artillery:
```
config:
  target: 'http://localhost:3333'
  phases:
    - duration: 20
      arrivalRate: 20
scenarios:
  - flow:
    - loop:
      - get:
          url: "/rooms/{{ $loopCount }}/similar_listings"
          count: 5
```
Initial results:
1. Normalized schema: 945 requests per second (rps), median latency of 106.2 milliseconds (ms)
1. Denormalized schema: 1533 rps, median latency of 61.2ms

Results after implementing Node cluster:
1. Normalized schema: 1815 rps, 46.7ms median latency
1. Denormalized schema: 2388 rps, 24ms median latency

After observing the superior performance of the denormalized schema with respect to read operations, that schema was implemented and a Docker image was built.

### Deployment on AWS

The initial production architecture for the microservice consisted of three AWS t2.micro (1 vCPU, 2.5 GHz, Intel Xeon Family, 1 GiB RAM) instances: a Redis caching server, a MongoDB database server and an App server running my Docker image. A t2.micro instance is less powerful than my local machine so, as expected, the first round of in production Artillery stress tests yielded worse metrics than those obtained from testing locally.

Initial production architecture performance:
1. RPS: XXXX
1. Latency: XXXX

One option to improve performance would be to vertically scale and run my three components on machines that are as powerful, or more powerful than my local machine. Vertical scaling on AWS is as easy as selecting a more powerful instance. Instead, I decided to first horizontally scale my App server. As opposed to selecting a more powerful machine with vertical scaling, horizontal scaling is equivalent to adding more machines. 
