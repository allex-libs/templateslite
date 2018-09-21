function createTemplating (execlib) {
  'use strict';

  var lib = execlib.lib;

  function doReplacement (strobj, repl, replname) {
    var re = new RegExp('\\b'+replname+'\\b', 'g');
    strobj.str = strobj.str.replace(re, process(repl));
  }

  function doReplacements (str, repls) {
    var ret;
    if (!str) {
      return str;
    }
    if (!(repls && ('object' === typeof repls))) {
      return str;
    }
    ret = {str: str};
    lib.traverseShallow(repls, doReplacement.bind(null, ret));
    return ret.str;
  }

  function replace (str, repls) {
    if (lib.isArray(repls)) {
      return repls.reduce(doReplacements, str);
    }
    return doReplacements(str, repls);
  }

  function arryforsure (thingy) {
    if (!lib.isVal(thingy)) {
      return [];
    }
    if (lib.isArray(thingy)) {
      return thingy;
    }
    return [thingy];
  }
  function concatany (thingy1, thingy2) {
    return arryforsure(thingy1).concat(arryforsure(thingy2));
  }
  function process (templatedesc) {
    var template;
    if (lib.isString(templatedesc)) {
      return templatedesc;
    }
    if (!templatedesc) {
      return null;
    }
    if (templatedesc.template && templatedesc.replacements) {
      template = process(templatedesc.template);
      if (!lib.isString(template)) {
        throw new Error ('Template descriptor\'s template has to be a string or a templatedescriptor');
      }
      return replace(template, concatany(templatedesc.prereplacements, templatedesc.replacements));
    }
    console.error(templatedesc);
    throw new Error ('Template descriptor not recognized');
    return null;
  }

  return process;
}

module.exports = createTemplating;
