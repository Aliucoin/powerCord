const { Plugin } = require('powerCord/entities');
const { React, getModule } = require('powerCord/webpack');
const { inject, uninject } = require('powerCord/injector');
const { WEBSITE } = require('powerCord/constants');

const SettingsConnections = require('./components/settings/ConnectedAccounts');
const ProfileConnections = require('./components/profile/ConnectedAccounts');

module.exports = class Connections extends Plugin {
  constructor () {
    super();

    this.baseUrl = powerCord.settings.get('backendURL', WEBSITE);
  }

  async startPlugin () {
    this.classes = {
      ...await getModule([ 'userInfoSection' ]),
      ...await getModule([ 'modal', 'inner' ]),
      ...await getModule([ 'connectedAccount' ])
    };

    this.loadStylesheet('style.css');
    this.patchSettingsConnections();
    this.patchUserConnections();
  }

  pluginWillUnload () {
    uninject('pc-connections-settings');
    uninject('pc-connections-profile');
  }

  async patchSettingsConnections () {
    const UserSettingsConnections = await getModule(m => m.default?.displayName === 'UserSettingsConnections');
    inject('pc-connections-settings', UserSettingsConnections, 'default', (args, res) => {
      if (!res.props.children) {
        return res;
      }

      const connectedAccounts = res.props.children[2].props.children;
      connectedAccounts.push(React.createElement(SettingsConnections, {}));
      return res;
    });

    UserSettingsConnections.default.displayName = 'UserSettingsConnections';
  }

  async patchUserConnections () {
    const UserInfoBase = await getModule((m) => m.default?.displayName === 'UserInfoBase');
    inject('pc-connections-profile', UserInfoBase, 'default', ([ props ], res) => {
      const ogType = res.props.children[1].type;
      res.props.children[1].type = (p) => {
        let res = ogType(p);
        if (!res) {
          res = React.createElement('div', { className: `${this.classes.userInfoSection} pc-connections` },
            React.createElement('div', {
              className: this.classes.connectedAccounts,
              children: []
            })
          );
        }

        res.props.children.props.children.push(React.createElement(ProfileConnections, { id: props.user.id }));
        return res;
      };

      return res;
    });

    UserInfoBase.default.displayName = 'UserInfoBase';
  }
};
