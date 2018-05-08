const request = require('request');
const serverUrl = 'http://127.0.0.1:1128';


describe('Server', () => {


  test('Should be able to handle GET request', (done) => {

    request({
      url: `${serverUrl}/rooms/1/similar_listings`,
      method: 'GET',
    }, (error, response, body) => {
      expect(response.statusCode).toBe(200);
    });

    done();
  });

  test('Should be able to handle POST request', (done) => {

    request({
      url: `${serverUrl}/rooms/1`,
      method: 'POST',
    }, (error, response, body) => {
      expect(response.statusCode).toBe(200);
    });

    done();
  });
});