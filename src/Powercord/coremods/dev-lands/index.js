/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

function _init () {
  powerCord.api.router.registerRoute({
    path: '/dev-lands',
    render: () => 'Why is your cat so damn fat'
  });

  // Imagine here I setup a setInterval that throws an error every 10ms :eyes:
}

function _shut () {
  powerCord.api.router.unregisterRoute('/dev-lands');
}

module.exports = function () {
  // const styleId = loadStyle(join(__dirname, 'style/style.scss'));
  powerCord.api.labs.registerExperiment({
    id: 'pc-dev-lands',
    name: 'Developer Lands',
    date: 1598446784383,
    description: 'Heaven but for plugin & theme developers',
    callback: (enabled) => enabled ? _init() : _shut()
  });

  if (powerCord.api.labs.isExperimentEnabled('pc-dev-lands')) {
    _init();
  }

  return () => {
    // unloadStyle(styleId);
    powerCord.api.labs.unregisterExperiment('pc-dev-lands');
    _shut();
  };
};
