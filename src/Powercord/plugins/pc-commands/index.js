const { Plugin } = require('powerCord/entities');
const { getModule } = require('powerCord/webpack');
const { inject, uninject } = require('powerCord/injector');

const commands = require('./commands');
const monkeypatchMessages = require('./monkeypatchMessages.js');
const injectAutocomplete = require('./injectAutocomplete.js');

module.exports = class Commands extends Plugin {
  async startPlugin () {
    Object.values(commands).forEach(command => powerCord.api.commands.registerCommand(command));

    monkeypatchMessages.call(this);
    injectAutocomplete.call(this);

    const slowmodeStore = await getModule([ 'getSlowmodeCooldownGuess' ]);
    const chatRestrictions = await getModule([ 'applyChatRestrictions' ]);
    inject('pc-commands-slowmode', chatRestrictions, 'applyChatRestrictions', (args) => {
      const currentPrefix = powerCord.api.commands.prefix;
      const [ , , content, , channel ] = args;

      if (channel && channel.getGuildId() && slowmodeStore.getSlowmodeCooldownGuess(channel.id) > 0) {
        const [ cmd, ...cmdArgs ] = content.slice(currentPrefix.length).split(' ');
        const currentCommand = powerCord.api.commands.find(c => [
          c.command.toLowerCase(), ...(c.aliases?.map(alias => alias.toLowerCase()) || [])
        ].includes(cmd));

        if (content && content.startsWith(currentPrefix) && currentCommand) {
          const result = currentCommand.executor(cmdArgs);
          if (result instanceof Promise || !result.send) {
            delete args[4];
          }
        }
      }

      return args;
    }, true);
  }

  pluginWillUnload () {
    Object.values(commands).forEach(command => powerCord.api.commands.unregisterCommand(command.command));
    uninject('pc-commands-textarea');
    uninject('pc-commands-plain-autocomplete');
    uninject('pc-commands-slate-autocomplete');
    uninject('pc-commands-slowmode');
  }
};
