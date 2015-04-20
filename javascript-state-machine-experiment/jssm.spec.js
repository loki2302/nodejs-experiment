var expect = require('chai').expect;

var StateMachine = require("javascript-state-machine");

describe('javascript state machine', function() {
  describe('light bulb', function() {
    var lightBulb;
    beforeEach(function() {
      lightBulb = StateMachine.create({
        initial: 'off',
        events: [
          { name: 'turnOn', from: 'off', to: 'on' },
          { name: 'turnOff', from: 'on', to: 'off' }
        ]
      });
    });

    it('should be off by default', function() {
      expect(lightBulb.current).to.equal('off');
    });

    it('should say it is possible to turn it on', function() {
      expect(lightBulb.can('turnOn')).to.equal(true);
    });

    it('should be possible to turn it on', function() {
      lightBulb.turnOn();
      expect(lightBulb.current).to.equal('on');
    });

    it('should say it is not be possible to turn it off', function() {
      expect(lightBulb.can('turnOff')).to.equal(false);
    });

    it('should not be possible to turn it off', function() {
      expect(function() {
        lightBulb.turnOff();
      }).to.throw(/event turnOff inappropriate/);
    });

    context('when it is turned on', function() {
      beforeEach(function() {
        lightBulb.turnOn();
      });

      it('should say it is possible to turn it off', function() {
        expect(lightBulb.can('turnOff')).to.equal(true);
      });

      it('should be possible to turn it off', function() {
        lightBulb.turnOff();
        expect(lightBulb.current).to.equal('off');
      });

      it('should say it is not possible to turn it on', function() {
        expect(lightBulb.can('turnOn')).to.equal(false);
      });

      it('should not be possible to turn it on again', function() {
        expect(function() {
          lightBulb.turnOn();
        }).to.throw(/event turnOn inappropriate/);
      });
    });
  });
});
