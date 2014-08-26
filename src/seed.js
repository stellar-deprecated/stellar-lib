//
// Seed support
//

var extend = require('extend');
var utils  = require('./utils');
var sjcl   = require('sjcl');

var BigInteger = require('jsbn');

var Base    = require('./base').Base;
var UInt    = require('./uint').UInt;
var UInt256 = require('./uint256').UInt256;
var UInt160 = require('./uint160').UInt160;
var KeyPair = require('./keypair').KeyPair;

var Seed = extend(function () {
  // Internal form: NaN or BigInteger
  this._value = NaN;
}, UInt);

Seed.width = 32;
Seed.prototype = extend({}, UInt.prototype);
Seed.prototype.constructor = Seed;

// value = NaN on error.
// One day this will support rfc1751 too.
Seed.prototype.parse_json = function (j) {
  if (typeof j === 'string') {
    if (!j.length) {
      this._value = NaN;
    // XXX Should actually always try and continue if it failed.
    } else if (j[0] === 's') {
      this._value = Base.decode_check(Base.VER_SEED, j);
    } else if (j.length === 32) {
      this._value = this.parse_hex(j);
    // XXX Should also try 1751
    } else {
      this.parse_passphrase(j);
    }
  } else {
    this._value = NaN;
  }

  return this;
};

Seed.prototype.parse_passphrase = function (j) {
  if (typeof j !== 'string') {
    throw new Error('Passphrase must be a string');
  }

  var hash = sjcl.hash.sha512.hash(sjcl.codec.utf8String.toBits(j));
  var bits = sjcl.bitArray.bitSlice(hash, 0, 256);

  this.parse_bits(bits);

  return this;
};

Seed.prototype.random = function () {
  this.parse_bits(sjcl.random.randomWords(8));

  return this;
};

Seed.prototype.to_json = function () {
  if (!(this._value instanceof BigInteger)) {
    return NaN;
  }

  var output = Base.encode_check(Base.VER_SEED, this.to_bytes());

  return output;
};

function append_int(a, i) {
  return [].concat(a, i >> 24, (i >> 16) & 0xff, (i >> 8) & 0xff, i & 0xff);
};

function firstHalfOfSHA512(bytes) {
  return sjcl.bitArray.bitSlice(
    sjcl.hash.sha512.hash(sjcl.codec.bytes.toBits(bytes)),
    0, 256
  );
};

function SHA256_RIPEMD160(bits) {
  return sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(bits));
};

/**
 * Generates an ED25519 signing key pair.
 */
Seed.prototype.get_key = function () {
  if (!this.is_valid()) {
    throw new Error('Cannot generate keys from invalid seed!');
  }

  return KeyPair.from_seed_bytes(this.to_bytes());
};

Seed.prototype.get_key_tnacl = function () {
  if (!this.is_valid()) {
    throw new Error('Cannot generate keys from invalid seed!');
  }

  return KeyPair.from_seed_bytes_tnacl(this.to_bytes());
};

exports.Seed = Seed;
