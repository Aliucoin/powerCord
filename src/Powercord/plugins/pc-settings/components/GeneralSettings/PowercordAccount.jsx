const http = require('http');
const { shell: { openExternal } } = require('electron');
const { React, Flux, getModule, i18n: { Messages } } = require('powerCord/webpack');
const { Spinner, Card, FormTitle } = require('powerCord/components');
const { WEBSITE } = require('powerCord/constants');

const LinkedAccounts = require('./LinkedAccounts.jsx');

class PowerCordAccount extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      linking: false,
      message: null,
      server: null,
      timeout: null
    };
  }

  render () {
    let Component;
    if (this.props.streamerMode.enabled && this.props.streamerMode.hidePersonalInformation) {
      Component = () => <div>{Messages.NOTICE_STREAMER_MODE_TEXT}</div>;
    } else if (this.state.linking) {
      Component = () => <div className='linking'><Spinner type='pulsingEllipsis'/> {Messages.POWERCORD_LINKING_WAITING}</div>;
    } else if (powerCord.account) {
      Component = () => <LinkedAccounts
        passphrase={this.props.passphrase.bind(this)}
        refresh={this.refresh.bind(this)}
        unlink={this.unlink.bind(this)}
      />;
    } else {
      Component = () => <div>
        {this.state.message || Messages.POWERCORD_LINKING_UNLINKED}
        <a href='#' onClick={() => this.linkLegacy()}>{Messages.POWERCORD_LINK_NOW}</a>
      </div>;
    }

    return <Card className='powerCord-account powerCord-text'>
      <FormTitle>{Messages.POWERCORD_ACCOUNT}</FormTitle>
      <Component/>
    </Card>;
  }

  componentWillUnmount () {
    if (this.state.server) {
      this.state.server.close();
      clearTimeout(this.state.timeout);
    }
  }

  async refresh () {
    await powerCord.fetchAccount();
    this.props.onAccount();
  }

  async unlink () {
    powerCord.settings.set('powerCordToken', null);
    await powerCord.fetchAccount();
    this.props.onAccount();
  }

  /** @deprecated */
  linkLegacy () {
    const _url = '/wallpaper.png?jsonweebtoken=';
    const server = http.createServer({}, async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      if (req.method === 'GET') {
        if (req.url.startsWith(_url)) {
          res.end('thx cutie');
          server.close();

          clearTimeout(this.state.timeout);
          powerCord.settings.set('powerCordToken', req.url.replace(_url, ''));
          await powerCord.fetchAccount();
          this.props.onAccount();
          return this.setState({
            linking: false,
            server: null,
            timeout: null
          });
        }
      }
      res.end('hi cutie');
    });

    server.listen(6462, (err) => {
      if (err) {
        this.setState({
          linking: false,
          server: null,
          message: Messages.POWERCORD_LINKING_ERRORED.format({
            newIssueUrl: 'https://github.com/powerCord-org/powerCord/issues/new?labels=bug&template=bug_report.md&title=Error+while+linking+PowerCord+account+to+Discord'
          })
        });
        return console.error(err);
      }

      const baseUrl = powerCord.settings.get('backendURL', WEBSITE);
      openExternal(`${baseUrl}/api/v2/users/@me/link/legacy`);

      const timeout = setTimeout(() => {
        this.state.server.close();
        this.setState({
          linking: false,
          server: null,
          message: Messages.POWERCORD_LINKING_TIMED_OUT
        });
      }, 30000);
      this.setState({ timeout });
    });

    this.setState({
      linking: true,
      server
    });
  }
}

module.exports = Flux.connectStoresAsync(
  [ getModule([ 'enabled', 'hidePersonalInformation' ]) ],
  ([ settingsStore ]) => ({ streamerMode: settingsStore.getSettings() })
)(PowerCordAccount);
