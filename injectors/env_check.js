/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { join } = require('path');
const { existsSync } = require('fs');
const { execSync } = require('child_process');
const { BasicMessages, AnsiEscapes } = require('./log');

const rootPath = join(__dirname, '..');
const nodeModulesPath = join(rootPath, 'node_modules');

function installDeps () {
  console.log('Installing dependencies, please wait...');
  execSync('npm install --only=prod', {
    cwd: rootPath,
    stdio: [ null, null, null ]
  });
  console.log('Dependencies successfully installed!');
}

module.exports = () => {
  // Don't clone in System32
  if (__dirname.toLowerCase().replace(/\\/g, '/').includes('/windows/system32')) {
    console.log(BasicMessages.PLUG_FAILED, '\n');
    console.log('PowerCord detected that you are trying to install PowerCord in the System32 folder.');
    console.log('This shouldn\'t be done as it will prevent PowerCord from functioning as expected.', '\n');
    console.log('This is most likely caused by you opening the command prompt as an administrator.');
    console.log(`Try re-opening your command prompt ${AnsiEscapes.BOLD}without${AnsiEscapes.RESET} opening it as administrator.`);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }

  // Verify if we're on node 10.x
  if (!require('fs').promises) {
    console.log(BasicMessages.PLUG_FAILED, '\n');
    console.log('PowerCord detected you\'re running an outdated version of NodeJS.');
    console.log('You must have at least NodeJS 10 installed for PowerCord to function.', '\n');
    console.log('You can download the latest version of NodeJS at https://nodejs.org');
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }

  // Verify if deps have been installed. If not, install them automatically
  if (!existsSync(nodeModulesPath)) {
    installDeps();
  } else {
    const { dependencies } = require('../package.json');
    for (const dependency in dependencies) {
      const depPath = join(nodeModulesPath, dependency);
      if (!existsSync(depPath)) {
        installDeps();
        break;
      }

      const depPackage = require(join(depPath, 'package.json'));
      const expectedVerInt = parseInt(dependencies[dependency].replace(/[^\d]/g, ''));
      const installedVerInt = parseInt(depPackage.version.replace(/[^\d]/g, ''));
      if (installedVerInt < expectedVerInt) {
        installDeps();
        break;
      }
    }
  }
};
