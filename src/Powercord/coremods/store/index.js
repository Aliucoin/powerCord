/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { join } = require('path');
const { inject, uninject } = require('powerCord/injector');
const { React, getModule, getModuleByDisplayName, FluxDispatcher, constants: { Permissions }, i18n: { Messages } } = require('powerCord/webpack');
const { Icons: { Plugin: PluginIcon, Theme } } = require('powerCord/components');
const { SpecialChannels: { STORE_PLUGINS, STORE_THEMES } } = require('powerCord/constants');
const { forceUpdateElement } = require('powerCord/util');
const { loadStyle, unloadStyle } = require('../util');

const Sidebar = require('./components/Sidebar');
const Store = require('./components/Store');

async function injectChannels () {
  const permissionsModule = await getModule([ 'can' ]);
  inject('pc-store-channels-perms', permissionsModule, 'can', (args, res) => {
    if (args[1] && (args[1].id === STORE_PLUGINS || args[1].id === STORE_THEMES)) {
      return args[0].data === Permissions.VIEW_CHANNEL.data;
    }
    return res;
  });

  const { transitionTo } = await getModule([ 'transitionTo' ]);
  const ChannelItem = await getModuleByDisplayName('ChannelItem');
  inject('pc-store-channels-props', ChannelItem.prototype, 'render', function (_, res) {
    const data = {
      [STORE_PLUGINS]: {
        icon: PluginIcon,
        name: Messages.POWERCORD_PLUGINS,
        route: '/_powerCord/store/plugins'
      },
      [STORE_THEMES]: {
        icon: Theme,
        name: Messages.POWERCORD_THEMES,
        route: '/_powerCord/store/themes'
      }
    };

    if (this.props.channel.id === STORE_PLUGINS || this.props.channel.id === STORE_THEMES) {
      res.props.children[1].props.children[0].props.children[1].props.children = data[this.props.channel.id].name;
      res.props.children[1].props.children[0].props.children[0] = React.createElement(data[this.props.channel.id].icon, {
        className: res.props.children[1].props.children[0].props.children[0].props.className,
        width: 24,
        height: 24
      });
      res.props.children[1].props.children[0].props.onClick = () => {
        transitionTo(data[this.props.channel.id].route);
        FluxDispatcher.dispatch({
          type: 'CHANNEL_SELECT',
          guildId: null
        });
      };
      delete res.props.children[1].props.children[0].props.onFocus;
      delete res.props.onMouseDown;
      delete res.props.onContextMenu;
    }
    return res;
  });

  const { containerDefault } = await getModule([ 'containerDefault' ]);
  forceUpdateElement(`.${containerDefault}`, true);
}

function _init () {
  injectChannels();

  powerCord.api.router.registerRoute({
    path: '/store',
    render: Store,
    sidebar: Sidebar
  });
}

function _shut () {
  powerCord.api.router.unregisterRoute('/store');
  uninject('pc-store-channels-perms');
  uninject('pc-store-channels-props');

  const classes = getModule([ 'containerDefault' ], false);
  if (classes) {
    forceUpdateElement(`.${classes.containerDefault}`, true);
  }
}

module.exports = function () {
  const styleId = loadStyle(join(__dirname, 'style/style.scss'));
  powerCord.api.labs.registerExperiment({
    id: 'pc-moduleManager-store',
    name: 'PowerCord Store',
    date: 1571961600000,
    description: 'PowerCord Plugin and Theme store',
    callback: (enabled) => enabled ? _init() : _shut()
  });

  if (powerCord.api.labs.isExperimentEnabled('pc-moduleManager-store')) {
    _init();
  }

  return () => {
    unloadStyle(styleId);
    powerCord.api.labs.unregisterExperiment('pc-moduleManager-store');
    _shut();
  };
};
