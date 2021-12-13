const { shell: { openExternal } } = require('electron');
const { React, getModule } = require('powerCord/webpack');
const { WEBSITE } = require('powerCord/constants');

let classes;
setImmediate(async () => {
  classes = { ...await getModule([ 'wrapper', 'inner' ]) };
});

module.exports = class ConnectAccountButton extends React.Component {
  constructor (props) {
    super();

    this.connection = powerCord.api.connections.get(props.type);
  }

  handleClick () {
    const baseUrl = powerCord.settings.get('backendURL', WEBSITE);
    openExternal(`${baseUrl}/api/v2/oauth/${this.props.type}`);
  }

  render () {
    return <>
      <div className={[ classes.wrapper, this.props.className ].filter(Boolean).join(' ')}>
        <button
          className={[ classes.inner, this.props.innerClassName ].filter(Boolean).join(' ')}
          type='button'
          disabled={this.props.disabled}
          style={{ backgroundImage: `url(${this.connection.icon.color})` }}
          onClick={this.handleClick.bind(this)}
          aria-label={this.connection.name}
        >
        </button>
      </div>
    </>;
  }
};
