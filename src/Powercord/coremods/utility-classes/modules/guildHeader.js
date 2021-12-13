/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { forceUpdateElement } = require('powerCord/util');
const { getModule } = require('powerCord/webpack');
const { inject, uninject } = require('powerCord/injector');

module.exports = async () => {
  const GuildHeader = await getModule([ 'AnimatedBanner', 'default' ]);
  inject('pc-utilitycls-guildHeader', GuildHeader.default, 'type', ([ props ], res) => {
    res.props.children[0].props['data-guild-id'] = props.guild.id;
    return res;
  });

  const className = (await getModule([ 'iconBackgroundTierNone', 'container' ])).header.split(' ')[0];
  setImmediate(() => forceUpdateElement(`.${className}`));
  return () => uninject('pc-utilitycls-guildHeader');
};
