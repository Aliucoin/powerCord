/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { join } = require('path');
const { existsSync } = require('fs');
const { inject } = require('../injectors/main');

if (process.platform === 'win32') { // Should be the only possible case, but we never know
  const injector = require(`../injectors/${process.platform}`);
  const buildInfoFile = join(process.resourcesPath, 'build_info.json');

  const buildInfo = require(buildInfoFile);
  if (buildInfo && buildInfo.newUpdater) {
    const autoStartScript = join(require.main.filename, '..', 'autoStart', 'index.js');
    const { update } = require(autoStartScript);

    // New Updater Injection
    require.cache[autoStartScript].exports.update = async (callback) => {
      const appDir = await injector.getAppDir();

      console.log('[PowerCord] Checking for host updates...');

      if (!existsSync(appDir)) {
        console.log('[PowerCord] Host update is available! Injecting into new version...');
        return inject(injector).then(() => {
          console.log('[PowerCord] Successfully injected into new version!');

          update(callback);
        });
      }

      console.log(`[PowerCord] Host "${buildInfo.version}" is already injected with PowerCord.`);
    };
  } else {
    const hostUpdaterScript = join(require.main.filename, '..', 'hostUpdater.js');
    const { quitAndInstall } = require(hostUpdaterScript);

    // Old Updater Injection
    require.cache[hostUpdaterScript].exports.quitAndInstall = () => {
      console.log('[PowerCord] Host update is available! Injecting into new version...');
      inject(injector).then(() => {
        console.log('[PowerCord] Successfully injected into new version!');

        quitAndInstall.call({ updateVersion: require.cache[hostUpdaterScript].exports.updateVersion });
      });
    };
  }
}
