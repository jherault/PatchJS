import assert  from 'assert';
import PatchJS from '../src/patch';

describe('PatchJS', function() {
  describe('#observe()', function() {
    it('should throw an error if the first argument is not an object', function() {
      let o = () => {};
      assert.throws(() => PatchJS.observe(o), Error, "Cannot operate on a non-object. Given type: function");
    });
  });
});


describe('PatchJS', function() {
  describe('#observe()', function() {
    describe('#get()', function() {
      it('should return a structured and valued object as the original', function() {
        let o = {a: 5, b: "aString", c: {d: null}};
        let oPrime = PatchJS.observe(o);
        assert.equal(JSON.stringify(o), JSON.stringify(oPrime));
      });
    });
  });
});

describe('PatchJS', function() {
  describe('#observe()', function() {
    describe('#revert()', function() {
      it('should return a proxied object with orignal values', function() {
        let o = {a: 5, b: "aString", c: {d: null}};
        let oPrime = PatchJS.observe(o);
        oPrime.a = 10;
        assert.equal(JSON.stringify(o), JSON.stringify(oPrime.revert().get()));
      });
    });
  });
});

describe('PatchJS', function() {
  describe('#observe()', function() {
    describe('.patchInfos', function() {
      it('should return an object with only changes with original and current values', function() {
        let o = {a: 5, b: "aString", c: {d: null}};
        let oPrime = PatchJS.observe(o);
        oPrime.a = 10;
        assert.equal(JSON.stringify({a: {original: 5, current: 10}}), JSON.stringify(oPrime.patchInfos));
      });
    });
  });
});

describe('PatchJS', function() {
  describe('#observe()', function() {
    describe('#patch()', function() {
      it('should return an object with only the diff (key with current value)', function() {
        let o = {a: 5, b: "aString", c: {d: null}};
        let oPrime = PatchJS.observe(o);
        oPrime.a = 10;
        assert.equal(JSON.stringify({a: 10}), JSON.stringify(oPrime.patch()));
      });
    });
  });
});