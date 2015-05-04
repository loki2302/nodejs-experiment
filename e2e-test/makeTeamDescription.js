module.exports = function makeTeamDescription(i) {
  return {
    name: 'Team' + i,
    slogan: 'Team' + i + ' slogan',
    url: 'http://team' + i + '.com'
  };
};
