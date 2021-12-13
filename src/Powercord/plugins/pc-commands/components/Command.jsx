const { React, getModuleByDisplayName } = require('powerCord/webpack');
const { Text } = require('powerCord/components');

const Autocomplete = getModuleByDisplayName('Autocomplete', false);

module.exports = class Command extends Autocomplete.Command {
  renderContent () {
    const res = super.renderContent();
    res.props.children[0] = React.createElement(Text, {
      children: this.props.prefix ? this.props.prefix : powerCord.api.commands.prefix,
      style: {
        color: '#72767d',
        marginRight: 2.5
      }
    });

    return res;
  }
};
