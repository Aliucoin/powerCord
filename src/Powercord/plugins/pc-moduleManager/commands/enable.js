module.exports = {
  command: 'enable',
  description: 'Allows you to re-/enable a selected plugin from the given list.',
  usage: '{c} [ plugin ID ]',
  executor (args) {
    let result;

    if (powerCord.pluginManager.plugins.has(args[0])) {
      if (powerCord.pluginManager.isEnabled(args[0])) {
        result = `->> ERROR: Tried to load an already loaded plugin!
            (${args[0]})`;
      } else {
        powerCord.pluginManager.enable(args[0]);
        result = `+>> SUCCESS: Plugin loaded!
            (${args[0]})`;
      }
    } else {
      result = `->> ERROR: Tried to enable a non-installed plugin!
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
        .filter(plugin => plugin.entityID.includes(args[0]))
        .map(plugin => ({
          command: plugin.entityID,
          description: plugin.manifest.description
        })),
      header: 'powerCord plugin list'
    };
  }
};
