var expect = require('chai').expect;
var yaml = require('js-yaml');
var _ = require('lodash');

describe('jsyaml', function() {
  var dom;
  beforeEach(function() {
    var data = `
    phases:
      - &phase1
        name: Phase One
      - &phase2
        name: Phase Two
        description: The second phase
    tasks:
      - { name: task one, min: 20, max: 30, phase: *phase1 }
      - { name: task two, min: 50, max: 80, phase: *phase1 }
      - { name: task three, min: 10, max: 20, phase: *phase2 }
    `;

    dom = yaml.load(data);
  });

  it('should work with references nicely', function() {
    expect(dom.tasks[0].phase).to.equal(dom.phases[0]);
    expect(dom.tasks[2].phase).to.equal(dom.phases[1]);
  });

  it('should let me compute the totals', function() {
    var ballpark = _.reduce(dom.tasks, function(total, item) {
      total.min += item.min;
      total.max += item.max;
      return total;
    }, { min: 0, max: 0});
    expect(ballpark.min).to.equal(80);
    expect(ballpark.max).to.equal(130);
  });
});
