var expect = require('chai').expect;

var StateMachine = require("javascript-state-machine");

describe('javascript state machine', function() {
  it('should work', function() {
    var fsm = StateMachine.create({
      initial: 'off',
      events: [
        { name: 'turnOn', from: 'off', to: 'on' },
        { name: 'turnOff', from: 'on', to: 'off' }
      ]
    });

    expect(fsm.current).to.equal('off');

    fsm.turnOn();
    expect(fsm.current).to.equal('on');

    fsm.turnOff();
    expect(fsm.current).to.equal('off');
  });
});
