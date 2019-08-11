const crossfilter = require('crossfilter');
const expect = require('chai').expect;

describe('crossfilter', () => {
  var payments;
  var paymentsByTime;
  var paymentsByTotal;
  var paymentsByType;
  beforeEach(() => {
    payments = crossfilter([
      {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
      {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
      {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
      {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
      {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
      {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
      {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
      {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
      {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
      {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
      {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
      {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
    ]);

    paymentsByTime = payments.dimension(p => p.date);
    paymentsByTotal = payments.dimension(p => p.total);
    paymentsByType = payments.dimension(p => p.type);
  });

  it('should filter data', () => {
    const top3PaymentsWithHighTotals = paymentsByTotal.top(3);
    expect(top3PaymentsWithHighTotals[0].date).to.equal('2011-11-14T16:28:54Z');
    expect(top3PaymentsWithHighTotals[1].date).to.equal('2011-11-14T17:29:52Z');
    expect(top3PaymentsWithHighTotals[2].date).to.equal('2011-11-14T17:25:45Z');

    paymentsByTime.filterRange(['2011-11-14T16:20:19Z', '2011-11-14T16:30:43Z']);
    const top3PaymentsWithHighTotalInTimeRange = paymentsByTotal.top(3);
    expect(top3PaymentsWithHighTotalInTimeRange[0].date).to.equal('2011-11-14T16:28:54Z');
    expect(top3PaymentsWithHighTotalInTimeRange[1].date).to.equal('2011-11-14T16:20:19Z');
  });


  it('should group data', () => {
    const paymentsByTypes = paymentsByType.group(function(type) { return type; });
    
    if(true) {
      const paymentCountsByTypes = paymentsByTypes.all();
      expect(paymentCountsByTypes.length).to.equal(3);

      const tabStats = paymentCountsByTypes.filter(c => c.key == 'tab')[0];
      expect(tabStats.value).to.equal(8);
    }

    if(true) {
      const paymentTotalsByTypes = paymentsByTypes.reduceSum(p => p.total).all();
      expect(paymentTotalsByTypes.length).to.equal(3);

      const tabStats = paymentTotalsByTypes.filter(c => c.key == 'tab')[0];
      expect(tabStats.value).to.equal(920);
    }
  });
});
