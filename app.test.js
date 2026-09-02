const request = require('supertest');
const app = require('./app');

test('GET / returns HTTP 200 with status ok', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('ok');
});