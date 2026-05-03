const test = require('node:test');
const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Import the Express app

test('API Integration Tests', async (t) => {
  // Test 1: Health Check Endpoint
  await t.test('GET /health returns 200 OK', async () => {
    const response = await request(app).get('/health');
    assert.strictEqual(response.status, 200, 'Expected status to be 200');
    assert.strictEqual(response.text, 'Backend is running!', 'Expected health check string');
  });

  // Test 2: Ideas API Endpoint
  await t.test('GET /api/ideas returns an array of ideas', async () => {
    const response = await request(app).get('/api/ideas');
    assert.strictEqual(response.status, 200, 'Expected status to be 200');
    assert.ok(Array.isArray(response.body), 'Expected response body to be an array');
  });

  // Cleanup: Close the mongoose connection so the test runner can exit
  await t.test('Cleanup Mongoose Connection', async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
});
