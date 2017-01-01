var expect = require('chai').expect;
var moment = require('moment');

describe('moment', function() {
  it('should let me format time as ISO-8601', function() {
    expect(moment('2015-07-27T12:34:56Z').utc().format()).to.equal('2015-07-27T12:34:56Z')
  });

  it('should let me format time as a human-readable string', function() {
    expect(moment('2015-07-27T12:34:56Z').utc().format('D/MMMM/YYYY HH:mm:ss')).to.equal('27/July/2015 12:34:56');
  });

  it('should let me format time difference', function() {
    expect(zeroTime().from(zeroTime().add(1, 'seconds'))).to.equal('a few seconds ago');
    expect(zeroTime().from(zeroTime().subtract(1, 'seconds'))).to.equal('in a few seconds');

    expect(zeroTime().from(zeroTime().add(1, 'minutes'))).to.equal('a minute ago');
    expect(zeroTime().from(zeroTime().subtract(1, 'minutes'))).to.equal('in a minute');

    expect(zeroTime().from(zeroTime().add(1, 'hours'))).to.equal('an hour ago');
    expect(zeroTime().from(zeroTime().subtract(1, 'hours'))).to.equal('in an hour');

    expect(zeroTime().from(zeroTime().add(1, 'days'))).to.equal('a day ago');
    expect(zeroTime().from(zeroTime().subtract(1, 'days'))).to.equal('in a day');

    expect(zeroTime().from(zeroTime().add(1, 'months'))).to.equal('a month ago');
    expect(zeroTime().from(zeroTime().subtract(1, 'month'))).to.equal('in a month');

    expect(zeroTime().from(zeroTime().add(1, 'years'))).to.equal('a year ago');
    expect(zeroTime().from(zeroTime().subtract(1, 'years'))).to.equal('in a year');
  });

  function zeroTime() {
    return moment('2015-07-27T12:34:56Z').utc();
  };

  describe('periods', () => {
    function datesBetween(start, end, step, format) {
      const startStepMoment = start.startOf(step);
      const endStepMoment = end.startOf(step);

      let stepMoment = startStepMoment;
      const dates = [];
      while(stepMoment.isSameOrBefore(endStepMoment)) {
        dates.push(stepMoment.format(format));
        stepMoment = stepMoment.add(1, step);
      }

      return dates;
    }

    it('should give me a list of years between 2 moments', () => {
      const start = moment('2013-03-15');
      const today = moment('2016-05-12');

      const years = datesBetween(start, today, 'year', 'YYYY')
      expect(years).to.deep.equal(['2013', '2014', '2015', '2016']);
    });

    it('should give me a list of months between 2 moments', () => {
      const start = moment('2013-03-15');
      const today = moment('2016-05-12');

      const months = datesBetween(start, today, 'month', 'YYYY-MM')

      expect(months[0]).to.equal('2013-03');
      expect(months[months.length - 1]).to.equal('2016-05');
    });
  });
});
