function createOverriding (execlib, process) {
  'use strict';
  var lib = execlib.lib;

  function override(templatedesc) {
    var i, override = {};
    if (arguments.length % 2 !== 1) {
      throw new Error ('override must take an odd number of parameters: desc, token, replacement, ..., token, replacement');
    }
    for (i=1; i<arguments.length; i+=2) {
      override[arguments[i]] = arguments[i+1];
    }
    if (lib.isString(templatedesc)) {
      return process({template: templatedesc, replacements: override});
    }
    return process(lib.extend({}, templatedesc, {replacements: override}));
  }

  return override;
}

module.exports = createOverriding;
