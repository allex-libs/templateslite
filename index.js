function createLib (execlib) {
  return {
    process: require('./processing.js')(execlib)
  };
}

module.exports = createLib;
