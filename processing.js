function createProcessing (execlib, misc) {
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

  function process (templatedesc) {
    var template;
    if (lib.isString(templatedesc)) {
      return templatedesc;
    }
    if (lib.isNumber(templatedesc)) {
      return templatedesc+'';
    }
    if (lib.isBoolean(templatedesc)) {
      return templatedesc+'';
    }
    if (!templatedesc) {
      return null;
    }
    if (templatedesc.template && templatedesc.replacements) {
      template = process(templatedesc.template);
      if (!lib.isString(template)) {
        throw new Error ('Template descriptor\'s template has to be a string or a templatedescriptor');
      }
      return replace(template, misc.concatany(templatedesc.prereplacements, templatedesc.replacements));
    }
    if (templatedesc.multi && lib.isArray(templatedesc.multi)) {
      return templatedesc.multi.map(process).join(templatedesc.separator);
    }
    if (lib.isArray(templatedesc)) {
      return process({separator: '\n', multi:templatedesc});
    }
    console.error(templatedesc);
    throw new Error ('Template descriptor not recognized');
    return null;
  }

  return process;
}

module.exports = createProcessing;
