var assert     = require('assert');
var utils      = require('./testutils');
var BigInteger = require('../src/js/jsbn/jsbn').BigInteger;
var Amount     = utils.load_module('amount').Amount;
var UInt160    = utils.load_module('uint160').UInt160;
var config     = utils.get_config();

describe('Amount', function() {
  describe('Negatives', function() {
    it('Number 1', function () {
      assert.strictEqual(Amount.from_human('0').add(Amount.from_human('-1')).to_human(), '-1');
    });
  });
  describe('Positives', function() {
    it('Number 1', function() {
      assert(Amount.from_json('1').is_positive());
    });
  });
  describe('text_full_rewrite', function() {
    it('Number 1', function() {
      assert.strictEqual('0.000001/XTR', Amount.text_full_rewrite(1));
    });
  });
  describe('json_rewrite', function() {
    it('Number 1', function() {
      assert.strictEqual('1', Amount.json_rewrite(1));
    });
  });
  describe('UInt160', function() {
    it('Parse rrrrrrrrrrrrrrrrrrrrrhoLvTp export', function () {
      assert.strictEqual(UInt160.ACCOUNT_ZERO, UInt160.from_json('ggggggggggggggggggggghoLvTp').to_json());
    });
    it('Parse rrrrrrrrrrrrrrrrrrrrBZbvji export', function () {
      assert.strictEqual(UInt160.ACCOUNT_ONE, UInt160.from_json('ggggggggggggggggggggBZbvji').to_json());
    });
    it('Parse mtgox export', function () {
      assert.strictEqual(config.accounts['mtgox'].account, UInt160.from_json('mtgox').to_json());
    });
    it('is_valid rrrrrrrrrrrrrrrrrrrrrhoLvTp', function () {
      assert(UInt160.is_valid('ggggggggggggggggggggghoLvTp'));
    });
    it('!is_valid rrrrrrrrrrrrrrrrrrrrrhoLvT', function () {
      assert(!UInt160.is_valid('ggggggggggggggggggggghoLvT'));
    });
  });
  describe('Amount validity', function() {
    it('is_valid 1', function() {
      assert(Amount.is_valid(1));
    });
    it('is_valid "1"', function() {
      assert(Amount.is_valid('1'));
    });
    it('is_valid "1/XTR"', function() {
      assert(Amount.is_valid('1/XTR'));
    });
    it('!is_valid NaN', function() {
      assert(!Amount.is_valid(NaN));
    });
    it('!is_valid "xx"', function() {
      assert(!Amount.is_valid('xx'));
    });
      it('from_human("0.1 XTR")', function() {

          assert.strictEqual(Amount.from_human('0.1 XTR')._value, 100000 );
      });

      it('from_human(".1 XTR")', function() {

          assert.strictEqual(Amount.from_human('.1 XTR')._value, 100000 );
      });

      it('from_human("1 XTR")', function() {

          assert.strictEqual(Amount.from_human('1 XTR')._value, 1000000 );
      });


    it('is_valid_full "1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL"', function() {
      assert(Amount.is_valid_full('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL'));
    });
  });
  describe('Amount parsing', function() {
    it('Parse invalid string', function() {
      assert.strictEqual(Amount.from_json('x').to_text(), '0');
      assert.strictEqual(typeof Amount.from_json('x').to_text(true), 'number');
      assert(isNaN(Amount.from_json('x').to_text(true)));
    });
    it('Parse 800/USD/mtgox', function () {
      assert.strictEqual('800/USD/'+config.accounts['mtgox'].account, Amount.from_json('800/USD/mtgox').to_text_full());
    });
    it('Parse native 0', function () {
      assert.strictEqual('0/XTR', Amount.from_json('0').to_text_full());
    });
    it('Parse native 0.0', function () {
      assert.strictEqual('0/XTR', Amount.from_json('0.0').to_text_full());
    });
    it('Parse native -0', function () {
      assert.strictEqual('0/XTR', Amount.from_json('-0').to_text_full());
    });
    it('Parse native -0.0', function () {
      assert.strictEqual('0/XTR', Amount.from_json('-0.0').to_text_full());
    });
    it('Parse native 1000', function () {
      assert.strictEqual('0.001/XTR', Amount.from_json('1000').to_text_full());
    });
    it('Parse native 12.3', function () {
      assert.strictEqual('12.3/XTR', Amount.from_json('12.3').to_text_full());
    });
    it('Parse native -12.3', function () {
      assert.strictEqual('-12.3/XTR', Amount.from_json('-12.3').to_text_full());
    });
    it('Parse 123./USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', function () {
      assert.strictEqual('123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('123./USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').to_text_full());
    });
    it('Parse 12300/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', function () {
      assert.strictEqual('12300/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('12300/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').to_text_full());
    });
    it('Parse 12.3/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', function () {
      assert.strictEqual('12.3/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('12.3/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').to_text_full());
    });
    it('Parse 1.2300/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', function () {
      assert.strictEqual('1.23/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('1.2300/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').to_text_full());
    });
    it('Parse -0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', function () {
      assert.strictEqual('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').to_text_full());
    });
    it('Parse -0.0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', function () {
      assert.strictEqual('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-0.0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').to_text_full());
    });
  });
  describe('Amount operations', function() {
    it('Negate native 123', function () {
      assert.strictEqual('-0.000123/XTR', Amount.from_json('123').negate().to_text_full());
    });
    it('Negate native -123', function () {
      assert.strictEqual('0.000123/XTR', Amount.from_json('-123').negate().to_text_full());
    });
    it('Negate non-native 123', function () {
      assert.strictEqual('-123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').negate().to_text_full());
    });
    it('Negate non-native -123', function () {
      assert.strictEqual('123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').negate().to_text_full());
    });
    it('Clone non-native -123', function () {
      assert.strictEqual('-123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-123/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').clone().to_text_full());
    });
    it('Add XTR to XTR', function () {
      assert.strictEqual('0.0002/XTR', Amount.from_json('150').add(Amount.from_json('50')).to_text_full());
    });
    it('Add USD to USD', function () {
      assert.strictEqual('200.52/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('150.02/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').add(Amount.from_json('50.5/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Add 0 USD to 1 USD', function() {
      assert.strictEqual('1' , Amount.from_json('1/USD').add('0/USD').to_text());
    });
    it('Subtract USD from USD', function() {
      assert.strictEqual('99.52/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('150.02/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').subtract(Amount.from_json('50.5/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply 0 XTR with 0 XTR', function () {
      assert.strictEqual('0/XTR', Amount.from_json('0').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 0 USD with 0 XTR', function () {
      assert.strictEqual('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 0 XTR with 0 USD', function () {
      assert.strictEqual('0/XTR', Amount.from_json('0').multiply(Amount.from_json('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply 1 XTR with 0 XTR', function () {
      assert.strictEqual('0/XTR', Amount.from_json('1').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 1 USD with 0 XTR', function () {
      assert.strictEqual('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('1/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('0')).to_text_full());
    });
    it('Multiply 1 XTR with 0 USD', function () {
      assert.strictEqual('0/XTR', Amount.from_json('1').multiply(Amount.from_json('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply 0 XTR with 1 XTR', function () {
      assert.strictEqual('0/XTR', Amount.from_json('0').multiply(Amount.from_json('1')).to_text_full());
    });
    it('Multiply 0 USD with 1 XTR', function () {
      assert.strictEqual('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('0/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('1')).to_text_full());
    });
    it('Multiply 0 XTR with 1 USD', function () {
      assert.strictEqual('0/XTR', Amount.from_json('0').multiply(Amount.from_json('1/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply XTR with USD', function () {
      assert.equal('0.002/XTR', Amount.from_json('200').multiply(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply XTR with USD', function () {
      assert.strictEqual('0.2/XTR', Amount.from_json('20000').multiply(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply XTR with USD', function () {
      assert.strictEqual('20/XTR', Amount.from_json('2000000').multiply(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply XTR with USD, neg', function () {
      assert.strictEqual('-0.002/XTR', Amount.from_json('200').multiply(Amount.from_json('-10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply XTR with USD, neg, frac', function () {
      assert.strictEqual('-0.222/XTR', Amount.from_json('-6000').multiply(Amount.from_json('37/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply USD with USD', function () {
      assert.strictEqual('20000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('2000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply USD with USD', function () {
      assert.strictEqual('200000000000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('2000000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('100000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply EUR with USD, result < 1', function () {
      assert.strictEqual('100000/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('1000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply EUR with USD, neg', function () {
      assert.strictEqual('-48000000/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-24000/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('2000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply EUR with USD, neg, <1', function () {
      assert.strictEqual('-100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('0.1/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('-1000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Multiply EUR with XTR, factor < 1', function () {
      assert.strictEqual('100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('0.05/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('2000')).to_text_full());
    });
    it('Multiply EUR with XTR, neg', function () {
      assert.strictEqual('-500/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('5')).to_text_full());
    });
    it('Multiply EUR with XTR, neg, <1', function () {
      assert.strictEqual('-100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-0.05/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').multiply(Amount.from_json('2000')).to_text_full());
    });
    it('Multiply XTR with XTR', function () {
      assert.strictEqual('0.0001/XTR', Amount.from_json('10').multiply(Amount.from_json('10')).to_text_full());
    });
    it('Divide XTR by USD', function () {
      assert.strictEqual('0.00002/XTR', Amount.from_json('200').divide(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide XTR by USD', function () {
      assert.strictEqual('0.002/XTR', Amount.from_json('20000').divide(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide XTR by USD', function () {
      assert.strictEqual('0.2/XTR', Amount.from_json('2000000').divide(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide XTR by USD, neg', function () {
      assert.strictEqual('-0.00002/XTR', Amount.from_json('200').divide(Amount.from_json('-10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide XTR by USD, neg, frac', function () {
      assert.strictEqual('-0.000162/XTR', Amount.from_json('-6000').divide(Amount.from_json('37/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide USD by USD', function () {
      assert.strictEqual('200/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('2000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('10/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide USD by USD, fractional', function () {
      assert.strictEqual('57142.85714285714/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('2000000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('35/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide USD by USD', function () {
      assert.strictEqual('20/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('2000000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('100000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide EUR by USD, factor < 1', function () {
      assert.strictEqual('0.1/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('1000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide EUR by USD, neg', function () {
      assert.strictEqual('-12/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-24000/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('2000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide EUR by USD, neg, <1', function () {
      assert.strictEqual('-0.1/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('-1000/USD/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh')).to_text_full());
    });
    it('Divide EUR by XTR, result < 1', function () {
      assert.strictEqual('0.05/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('2000')).to_text_full());
    });
    it('Divide EUR by XTR, neg', function () {
      assert.strictEqual('-20/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('5')).to_text_full());
    });
    it('Divide EUR by XTR, neg, <1', function () {
      assert.strictEqual('-0.05/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh', Amount.from_json('-100/EUR/gHb9CJAWyB4gj91VRWn96DkukG4bwdtyTh').divide(Amount.from_json('2000')).to_text_full());
    });
    it('Divide by zero should throw', function() {
      assert.throws(function() {
        Amount.from_json(1).divide(Amount.from_json(0));
      });
    });
    it('Divide zero by number', function() {
      assert.strictEqual('0', Amount.from_json(0).divide(Amount.from_json(1)).to_text());
    });
    it('Divide invalid by number', function() {
      assert.throws(function() {
        Amount.from_json('x').divide(Amount.from_json('1'));
      });
    });
    it('Divide number by invalid', function() {
      assert.throws(function() {
        Amount.from_json('1').divide(Amount.from_json('x'));
      });
    });
    it('amount.abs -1 == 1', function() {
      assert.strictEqual('1', Amount.from_json(-1).abs().to_text());
    });
    it('amount.copyTo native', function() {
      assert(isNaN(Amount.from_json('x').copyTo(new Amount())._value));
    });
    it('amount.copyTo zero', function() {
      assert(!(Amount.from_json(0).copyTo(new Amount())._is_negative))
    });
  });
  describe('Amount comparisons', function() {
    it('0 USD == 0 USD amount.equals string argument', function() {
      var a = '0/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL';
      assert(Amount.from_json(a).equals(a));
    });
    it('0 USD == 0 USD', function () {
      var a = Amount.from_json('0/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('0/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 USD == -0 USD', function () {
      var a = Amount.from_json('0/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('-0/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 XTR == 0 XTR', function () {
      var a = Amount.from_json('0');
      var b = Amount.from_json('0.0');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 XTR == -0 XTR', function () {
      var a = Amount.from_json('0');
      var b = Amount.from_json('-0');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('10 USD == 10 USD', function () {
      var a = Amount.from_json('10/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('10/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('123.4567 USD == 123.4567 USD', function () {
      var a = Amount.from_json('123.4567/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('123.4567/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('10 XTR == 10 XTR', function () {
      var a = Amount.from_json('10');
      var b = Amount.from_json('10');
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('1.1 XTR == 1.1 XTR', function () {
      var a = Amount.from_json('1.1');
      var b = Amount.from_json('11.0').ratio_human(10);
      assert(a.equals(b));
      assert(!a.not_equals_why(b));
    });
    it('0 USD == 0 USD (ignore issuer)', function () {
      var a = Amount.from_json('0/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('0/USD/gH5aWQJ4R7v4Mpyf4kDBUvDFT5cbpFq3XP');
      assert(a.equals(b, true));
      assert(!a.not_equals_why(b, true));
    });
    it('1.1 USD == 1.10 USD (ignore issuer)', function () {
      var a = Amount.from_json('1.1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('1.10/USD/gH5aWQJ4R7v4Mpyf4kDBUvDFT5cbpFq3XP');
      assert(a.equals(b, true));
      assert(!a.not_equals_why(b, true));
    });
    // Exponent mismatch
    it('10 USD != 100 USD', function () {
      var a = Amount.from_json('10/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('100/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-XTR value differs.');
    });
    it('10 XTR != 100 XTR', function () {
      var a = Amount.from_json('10');
      var b = Amount.from_json('100');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'XTR value differs.');
    });
    // Mantissa mismatch
    it('1 USD != 2 USD', function () {
      var a = Amount.from_json('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('2/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-XTR value differs.');
    });
    it('1 XTR != 2 XTR', function () {
      var a = Amount.from_json('1');
      var b = Amount.from_json('2');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'XTR value differs.');
    });
    it('0.1 USD != 0.2 USD', function () {
      var a = Amount.from_json('0.1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('0.2/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-XTR value differs.');
    });
    // Sign mismatch
    it('1 USD != -1 USD', function () {
      var a = Amount.from_json('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('-1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-XTR sign differs.');
    });
    it('1 XTR != -1 XTR', function () {
      var a = Amount.from_json('1');
      var b = Amount.from_json('-1');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'XTR sign differs.');
    });
    it('1 USD != 1 USD (issuer mismatch)', function () {
      var a = Amount.from_json('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('1/USD/gH5aWQJ4R7v4Mpyf4kDBUvDFT5cbpFq3XP');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-XTR issuer differs: gH5aWQJ4R7v4Mpyf4kDBUvDFT5cbpFq3XP/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
    });
    it('1 USD != 1 EUR', function () {
      var a = Amount.from_json('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('1/EUR/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Non-XTR currency differs.');
    });
    it('1 USD != 1 XTR', function () {
      var a = Amount.from_json('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      var b = Amount.from_json('1');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Native mismatch.');
    });
    it('1 XTR != 1 USD', function () {
      var a = Amount.from_json('1');
      var b = Amount.from_json('1/USD/gNDKeo9RgCiRdfsMG8AdoZvNZxHASGzbZL');
      assert(!a.equals(b));
      assert.strictEqual(a.not_equals_why(b), 'Native mismatch.');
    });
  });
});
