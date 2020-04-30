const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { keystone } = require('../index')

var assert = require('assert');
describe('Keystone cms', function() {
  describe('Mongo Connection', function() {
    it('should connect to MongoDB', function() {
      assert.equal(process.env.CONNECT_TO, keystone.adapters.MongooseAdapter.config.mongoUri);
    });
  });

  describe('Keystone', function() {
    it('should be an object',function() {
      assert.equal(typeof(keystone),typeof({}));
    });
  })
});