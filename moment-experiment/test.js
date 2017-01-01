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
});
