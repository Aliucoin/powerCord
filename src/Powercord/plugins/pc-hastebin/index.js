const { Plugin } = require('powerCord/entities');
const { get, post } = require('powerCord/http');
const { clipboard } = require('electron');

const Settings = require('./Settings.jsx');

module.exports = class Hastebin extends Plugin {
  startPlugin () {
    const domain = this.settings.get('domain', 'https://haste.powerCord.dev');

    powerCord.api.settings.registerSettings('pc-hastebin', {
      category: this.entityID,
      label: 'Hastebin',
      render: Settings
    });

    powerCord.api.commands.registerCommand({
      command: 'hastebin',
      description: 'Lets you paste content to Hastebin',
      usage: '{c} [--send] <--clipboard | FILE_URL>',
      executor: async (args) => {
        const send = args.includes('--send')
          ? !!args.splice(args.indexOf('--send'), 1)
          : this.settings.get('send', false);

        const data = args.includes('--clipboard')
          ? clipboard.readText()
          : await this.parseArguments(args);

        if (!data) {
          return {
            send: false,
            result: `Invalid arguments. Run \`${powerCord.api.commands.prefix}help hastebin\` for more information.`
          };
        }

        try {
          const { body } = await post(`${domain}/documents`)
            .send(data);
          return {
            send,
            result: `${domain}/${body.key}`
          };
        } catch (e) {
          return {
            send: false,
            result: `Upload to the specified domain ${domain} failed. Please check that the server is setup properly.`
          };
        }
      }
    });
  }

  pluginWillUnload () {
    powerCord.api.settings.unregisterSettings('pc-hastebin');
    powerCord.api.commands.unregisterCommand('hastebin');
  }

  parseArguments (args) {
    const input = args.join(' ');
    if (input.startsWith('https://cdn.discordapp.com/attachments')) {
      return get(input).then(res => res.raw);
    }

    return false;
  }
};
