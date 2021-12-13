const { React, getModuleByDisplayName, modal, i18n: { Messages } } = require('powerCord/webpack');
const { AsyncComponent } = require('powerCord/components');
const { open: openModal } = require('powerCord/modal');

const Alert = AsyncComponent.from(getModuleByDisplayName('Alert'));

const ConnectedAccount = require('./ConnectedAccount');
let accountStore = [];

module.exports = class ConnectedAccounts extends React.Component {
  constructor () {
    super();

    this.state = { accounts: accountStore };
  }

  componentDidMount () {
    this.refreshAccounts();
  }

  refreshAccounts () {
    powerCord.api.connections.fetchAccounts().then(accounts => {
      this.setState({ accounts });
      accountStore = accounts;
    });
  }

  handleDisconnect () {
    const _this = this;
    const connection = powerCord.api.connections.get(this.account.type);
    openModal(() => React.createElement(Alert, {
      title: Messages.DISCONNECT_ACCOUNT_TITLE.format({ name: connection.name }),
      body: Messages.DISCONNECT_ACCOUNT_BODY,
      confirmText: Messages.DISCONNECT_ACCOUNT,
      cancelText: Messages.CANCEL,
      transitionState: 1,
      onConfirm: () => {
        if (typeof connection.onDisconnect === 'function') {
          connection.onDisconnect(_this.account).then(() => {
            _this.component.refreshAccounts();
          });
        }

        modal.pop();
      },
      onCancel: modal.pop
    }));
  }

  render () {
    return [
      this.state.accounts.map(account => account && <ConnectedAccount
        account={account}
        onDisconnect={this.handleDisconnect.bind({ component: this,
          account })}
      />)
    ];
  }
};
