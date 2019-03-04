(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
ALLEX.execSuite.libRegistry.register('allex_templateslitelib',require('./index')(ALLEX));

},{"./index":2}],2:[function(require,module,exports){
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

},{"./inheriting.js":3,"./misc.js":4,"./overriding.js":5,"./processing.js":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
function createMisc (execlib) {
  'use strict';

  var lib = execlib.lib;

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

  return {
    arryforsure: arryforsure,
    concatany: concatany
  };
}

module.exports = createMisc;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}]},{},[1]);
