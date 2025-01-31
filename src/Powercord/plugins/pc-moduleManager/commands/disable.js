module.exports = {
  command: 'disable',
  description: 'Allows you to disable a selected plugin from the given list.',
  usage: '{c} [ plugin ID ]',
  executor (args) {
    let result;

    if (powerCord.pluginManager.plugins.has(args[0])) {
      if (args[0] === 'pc-commands') {
        result = `->> ERROR: You cannot unload this plugin as it depends on delivering these commands!
            (Tried to unload ${args[0]})`;
      } else if (!powerCord.pluginManager.isEnabled(args[0])) {
        result = `->> ERROR: Tried to unload a non-loaded plugin!
            (${args[0]})`;
      } else {
        powerCord.pluginManager.disable(args[0]);
        result = `+>> SUCCESS: Plugin unloaded!
            (${args[0]})`;
      }
    } else {
      result = `->> ERROR: Tried to disable a non-installed plugin!
          (${args[0]})`;
    }

    return {
      send: false,
      result: `\`\`\`diff\n${result}\`\`\``
    };
  },

  autocomplete (args) {
    const plugins = powerCord.pluginManager.getPlugins()
      .sort((a, b) => a - b)
      .map(plugin => powerCord.pluginManager.plugins.get(plugin));

    if (args.length > 1) {
      return false;
    }

    return {
      commands: plugins
        .filter(plugin => plugin.entityID !== 'pc-commands' &&
          plugin.entityID.includes(args[0]))
        .map(plugin => ({
          command: plugin.entityID,
          description: plugin.manifest.description
        })),
      header: 'powerCord plugin list'
    };
  }
};
