var sjcl    = require('./utils').sjcl;
var nacl = require('js-nacl').instantiate();

var UInt160 = require('./uint160').UInt160;
var UInt256 = require('./uint256').UInt256;
var Base    = require('./base').Base;

/**
 * Creates an ED25519 key pair for signing.
 *
 * @param {object} naclSigningKeys
 * @constructor
 */
function KeyPair(naclSigningKeys) {
  this._secret = naclSigningKeys.signSk;
  this._pubkey = naclSigningKeys.signPk;
}

/**
 * Returns public key as a byte array.
 *
 * @private
 */
KeyPair.prototype._pub = function() {
  return this._pubkey;
};

/**
 * Returns public key in compressed format as bit array.
 *
 * @private
 */
KeyPair.prototype._pub_bits = function() {
  var pub = this._pub();

  if (!pub) {
    return null;
  }

  return sjcl.codec.bytes.toBits(pub);
};

/**
 * Returns public key as hex.
 *
 */
KeyPair.prototype.to_hex_pub = function() {
  var bits = this._pub_bits();

  if (!bits) {
    return null;
  }

  return sjcl.codec.hex.fromBits(bits).toUpperCase();
};

function SHA256_RIPEMD160(bits) {
  return sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(bits));
}

KeyPair.prototype.get_address = function() {
  var bits = this._pub_bits();

  if (!bits) {
    return null;
  }

  var hash = SHA256_RIPEMD160(bits);

  var address = UInt160.from_bits(hash);
  address.set_version(Base.VER_ACCOUNT_ID);
  return address;
};

KeyPair.prototype.sign = function(hash) {
  hash = UInt256.from_json(hash);
  var sig = nacl.crypto_sign(hash.to_bytes(), this._secret);

  return sjcl.codec.bytes.toBits(sig);
};

exports.KeyPair = KeyPair;
