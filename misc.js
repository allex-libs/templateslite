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
