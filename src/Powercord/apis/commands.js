const { API } = require('powerCord/entities');

/**
 * @typedef PowerCordChatCommand
 * @property {String} command Command name
 * @property {String[]} aliases Command aliases
 * @property {String} description Command description
 * @property {String} usage Command usage
 * @property {Function} executor Command executor
 * @property {Function|undefined} autocomplete Autocompletion method
 * @property {Boolean|undefined} showTyping Whether typing status should be shown or not
 */

/**
 * PowerCord chat commands API
 * @property {Object.<String, PowerCordChatCommand>} commands Registered commands
 */
class CommandsAPI extends API {
  constructor () {
    super();

    this.commands = {};
  }

  get prefix () {
    return powerCord.settings.get('prefix', '.');
  }

  get find () {
    const arr = Object.values(this.commands);
    return arr.find.bind(arr);
  }

  get filter () {
    const arr = Object.values(this.commands);
    return arr.filter.bind(arr);
  }

  get map () {
    const arr = Object.values(this.commands);
    return arr.map.bind(arr);
  }

  get sort () {
    const arr = Object.values(this.commands);
    return arr.sort.bind(arr);
  }

  /**
   * Registers a command
   * @param {PowerCordChatCommand} command Command to register
   */
  registerCommand (command) {
    // @todo: remove this once there's a proper implemention (if any) for fetching the command origin.
    const stackTrace = (new Error()).stack;
    const [ , origin ] = stackTrace.match(new RegExp(`${global._.escapeRegExp(powerCord.pluginManager.pluginDir)}.([-\\w]+)`));

    if (typeof command === 'string') {
      console.error('no');
      return;
    }
    if (this.commands[command.command]) {
      throw new Error(`Command ${command.command} is already registered!`);
    }

    this.commands[command.command] = {
      ...command,
      origin
    };
  }

  /**
   * Unregisters a command
   * @param {String} command Command name to unregister
   */
  unregisterCommand (command) {
    if (this.commands[command]) {
      delete this.commands[command];
    }
  }
}

module.exports = CommandsAPI;
