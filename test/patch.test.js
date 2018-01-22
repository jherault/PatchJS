import assert  from 'assert';
import Patch from '../dist/patch';

describe('Patch', function() {
  describe('#observe()', function() {
    it('should throw an error if the first argument is not an object', function() {
      let o = () => {};
      assert.throws(() => Patch.observe(o), Error, "Cannot operate on a non-object. Given type: function");
    });
  });
});


describe('Patch', function() {
  describe('#observe()', function() {
    describe('#get()', function() {
      it('should return a structured and valued object as the original', function() {
        let o = {a: 5, b: "aString", c: {d: null}};
        let oPrime = Patch.observe(o);
        assert.equal(JSON.stringify(o), JSON.stringify(oPrime));
      });
    });
  });
});