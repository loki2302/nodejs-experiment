module.exports = function makePersonDescription(i) {
  return {
    name: 'John' + i,
    avatar: 'http://example' + i + '.org',
    position: 'Developer ' + i,
    city: 'New York ' + i,
    state: 'NY ' + i,
    phone: '+123456789' + i,
    email: 'john' + i + '@john' + i + '.com'
  };
};
