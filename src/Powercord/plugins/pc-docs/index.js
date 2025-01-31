const { getModule, getModuleByDisplayName, messages, constants: discordConsts } = require('powerCord/webpack');
const { inject, uninject } = require('powerCord/injector');
const { Plugin } = require('powerCord/entities');

const DocsLayer = require('./components/DocsLayer');

module.exports = class Documentation extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');
    powerCord.api.labs.registerExperiment({
      id: 'pc-docs',
      name: 'Documentation',
      date: 1572393600000,
      description: 'PowerCord documentation for making plugin and themes',
      callback: enabled => {
        if (enabled) {
          this.addDocsItems();
        } else {
          uninject('pc-docs-tab');
        }
      }
    });

    if (powerCord.api.labs.isExperimentEnabled('pc-docs')) {
      this.addDocsItems();
    }
  }

  pluginWillUnload () {
    uninject('pc-docs-tab');
    powerCord.api.labs.unregisterExperiment('pc-docs');
  }

  async addDocsItems () {
    const { pushLayer } = await getModule([ 'pushLayer' ]);
    const SettingsView = await getModuleByDisplayName('SettingsView');
    inject('pc-docs-tab', SettingsView.prototype, 'getPredicateSections', (args, sections) => {
      const changelog = sections.find(c => c.section === 'changelog');
      if (changelog) {
        sections.splice(
          sections.indexOf(changelog) + 1, 0,
          {
            section: 'pc-documentation',
            onClick: async () => {
              await this._ensureHighlight();
              setImmediate(() => pushLayer(DocsLayer));
            },
            label: 'PowerCord Docs'
          }
        );
      }

      return sections;
    });
  }

  async _ensureHighlight () {
    const module = await getModule([ 'highlight' ]);
    if (typeof module.highlight !== 'function') {
      const currentChannel = (await getModule([ 'getChannelId' ])).getChannelId();
      if (!currentChannel) {
        const router = await getModule([ 'replaceWith' ]);
        const channels = await getModule([ 'getChannels' ]);
        const permissions = await getModule([ 'can' ]);
        const currentLocation = window.location.pathname;
        const channel = channels.getChannels().find(c => c.type === 0 && permissions.can(discordConsts.Permissions.VIEW_CHANNEL, c));
        const route = discordConsts.Routes.CHANNEL(channel.guild_id, channel.id); // eslint-disable-line new-cap
        router.replaceWith(route);
        return setImmediate(async () => {
          await this._loadModule(channel.id);
          router.replaceWith(currentLocation);
        });
      }
      await this._loadModule(currentChannel);
    }
  }

  async _loadModule (channel) {
    const module = await getModule([ 'createBotMessage' ]);
    const message = module.createBotMessage(channel, '```js\nconsole.log("yeet")\n```');
    messages.receiveMessage(channel, message);
    messages.deleteMessage(channel, message.id, true);
  }
};
