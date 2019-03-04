function createInheriting (execlib, misc) {
  'use strict';

  var lib = execlib.lib;

  function templateOf (templatedesc) {
    if (lib.isString(templatedesc)) {
      return templatedesc;
    }
    if (lib.isNumber(templatedesc)) {
      return templatedesc+'';
    }
    return templatedesc.template;
  }
  function inherit(templatedesc1, templatedesc2) {
    return {
      template: templateOf(templatedesc2) || templateOf(templatedesc1),
      prereplacements: misc.concatany(
        templatedesc1.prereplacements,
        templatedesc2.prereplacements
      ),
      replacements: lib.extend({}, templatedesc1.replacements, templatedesc2.replacements)
    };
  }

  return inherit;
}

module.exports = createInheriting;
