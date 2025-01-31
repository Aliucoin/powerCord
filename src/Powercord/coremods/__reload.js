/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

module.exports = function () {
  require('.').unload();
  Object.keys(require.cache).forEach(key => {
    if (key.includes('src/PowerCord/coremods')) {
      delete require.cache[key];
    }
  });
  require('.').load();
};
