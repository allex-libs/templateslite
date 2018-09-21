(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
ALLEX.execSuite.libRegistry.register('allex_templateslitelib',require('./index')(ALLEX));

},{"./index":2}],2:[function(require,module,exports){
function createLib (execlib) {
  return {
    process: require('./processing.js')(execlib)
  };
}

module.exports = createLib;

},{"./processing.js":3}],3:[function(require,module,exports){
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

},{}]},{},[1]);
