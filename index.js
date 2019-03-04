function createLib (execlib) {
  var misc = require('./misc.js')(execlib),
    process = require('./processing.js')(execlib, misc),
    override = require('./overriding.js')(execlib, process),
    inherit = require('./inheriting.js')(execlib, misc);
  return {
    process: process,
    override: override,
    inherit: inherit
  };
}

module.exports = createLib;
