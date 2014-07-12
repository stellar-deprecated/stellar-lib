var assert = require('assert');
var utils  = require('./testutils');
var Seed   = utils.load_module('seed').Seed;
var config = require('./testutils').get_config();

describe('KeyPair', function() {
  it('can generate an address', function () {
    var seed = Seed.from_json("masterpassphrase");
    var address = seed.get_key().get_address();
    assert.strictEqual(address.to_json(), 'ganVp9o5emfzpwrG5QVUXqMv8AgLcdvySb');
  });
});

// vim:sw=2:sts=2:ts=8:et
