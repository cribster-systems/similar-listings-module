# Cribster: similar listings service

> Scaled backend of similar listings microservice for housing rental platform, reaching 2,300 RPS after reconfiguring microservice architecture and database schema, adding a Redis caching server, deploying dockerized app image to AWS and horizontally scaling application layer with AWS Elastic Container Service and an Elastic Load Balancer, and deploying MongoDB sharded cluster with replica sets to maintain performance as database size increases and ensure data availability 

## Related Projects

  - https://github.com/cribster-systems/images-service
  - https://github.com/cribster-systems/booking-service-module
  - https://github.com/cribster-systems/reviews-service-module

# Development
For this project, I scaled the backend of the similar listings microservice for a housing rental platform after inheriting a legacy codebase. To simulate production scale, 10 million listings were added to the database.

## Microservice Architecture and Database Schema Design
First, any computations to determine similar listings for a given listing were decoupled from the retrieval of similar listings and moved to a separate recommendation service that operates as a batch process.

Next, two different databases and database schemas were tested. For the first schema, the value for the similar listings field in the database is simply an array containing the ids of the twelve similar listings (MongoDB) or there was a separate join table that contained twelve rows for every listing for each of its similar listings (PostgreSQL). The second schema (only MongoDB) denormalized the data. In this schema, the value for the similar listings field was an array of objects that held all relevant data for each of the similar listings. 

Two downsides to denormalizing data are the increase in storage space and the fact that anytime information for a listing is updated, that listing must be updated along with everywhere it appears as a similar listing. The latter is mitigated by the fact that a listing can have at most twelve similar listings. A listing should only appear elsewhere as a similar listing approximately twelve times so the number of write operations associated with an update to a listing should be relatively limited. The upside to denormalizing data is much faster read operations and this was borne out in testing with Artillery.

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
          count: 10
```
Initial results:
1. Normalized schema: 945 requests per second (rps), median latency of 106.2 milliseconds (ms)
1. Denormalized schema: 1533 rps, median latency of 61.2ms

Results after implementing Node cluster:
1. Normalized schema: 1815 rps, 46.7ms median latency
1. Denormalized schema: 2388 rps, 24.0ms median latency

After observing the superior performance of the denormalized schema with respect to read operations, that schema was implemented and a Docker image was built.

## Deployment on AWS

The initial production architecture for the microservice consisted of three AWS t2.micro (1 vCPU, 2.5 GHz, Intel Xeon Family, 1 GiB RAM) instances: a Redis caching server, a MongoDB database server and an App server running my Docker image. A t2.micro instance is less powerful than my local machine so, as expected, the first round of in production Artillery stress tests yielded worse metrics than those obtained from testing locally.

Initial production architecture performance:
1. RPS: 250
1. Latency: 1190.5ms

One option to improve performance would be to vertically scale and run my three components on machines that are as powerful, or more powerful than my local machine. Vertical scaling on AWS is as easy as selecting a more powerful instance. Instead, I decided to first horizontally scale my App server. As opposed to selecting a more powerful machine with vertical scaling, horizontal scaling is equivalent to adding more machines.

## Horizontally Scaling App Server

I chose to horizontally scale my App server with an Elastic Load Balancer and AWS auto scaling with Fargate. With auto scaling you can specify a particular metric related to the usage and health of your service, such as average CPU utilization, and if a threshold for that metric is exceeded additional containers will be spun up to help assist with the workload. Conversely, if the value for that metric dips below a certain threshold, containers will be wound down. Auto scaling allows you to use only the resouces that your service requires at that time and is especially cost effective compared to a deployment of a static number of instances if the traffic to that service is highly variable. At any given time my service was running between 5 and 20 containers and these bounds were fine-tuned after observering metrics on New Relic from Artillery tests.

Performance after horizontally scaling App server:

| Number of Containers Running | Requests Per Second | Latency (ms) |
| ---------------------------- | ------------------- | ------------ |
| 1                            | 250                 | 1190.5       |                  
| 5                            | 1171                | 388.0        |
| 10                           | 1972                | 169.1        |
| 15                           | 2308                | 143.6        |
| 20                           | 2357                | 123.7        |

## Database Sharding

After horizontally scaling my App server, I decided to deploy a MongoDB sharded cluster with replica sets to maintain performance as database size increases and ensure data availability. 

Each shard was deployed as a replica set consisting of three copies so that if the primary failed or was corrupted, one of the two secondary copies could step in and fill the role, thereby maintaining availability to that data. I elected to only allow read operations from the primary in each replica set. Mongo does grant the option to allow read operations from secondary members of a replica set which would increase the RPS that the service could handle, but there is a possibility that the data in the secondary copies would not be consistent with the primary due to the asynchronous nature of write operations to secondary members in a replica set. 
