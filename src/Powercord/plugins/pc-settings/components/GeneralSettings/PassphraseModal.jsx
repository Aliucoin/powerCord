const { React, i18n: { Messages } } = require('powerCord/webpack');
const { Confirm } = require('powerCord/components/modal');
const { TextInput } = require('powerCord/components/settings');

module.exports = class Passphrase extends React.Component {
  constructor () {
    super();

    this.state = { passphrase: '' };
  }

  render () {
    return (
      <Confirm
        red={false}
        header={Messages.POWERCORD_UPDATE_PASSPHRASE}
        confirmText={Messages.GAME_ACTION_BUTTON_UPDATE}
        cancelText={Messages.CANCEL}
        onConfirm={() => this.props.onConfirm(this.state.passphrase)}
        onCancel={() => this.props.onCancel()}
      >
        <div className='powerCord-passphrase-modal powerCord-text'>
          <div className='powerCord-passphrase-desc'>
            {Messages.POWERCORD_UPDATE_PASSPHRASE_MODAL1}
            <div className='space'/>
            {Messages.POWERCORD_UPDATE_PASSPHRASE_MODAL2.format()}
          </div>
          <TextInput
            type='password'
            defaultValue={this.state.passphrase}
            onChange={passphrase => this.setState({ passphrase })}
          >
            {Messages.POWERCORD_PASSPHRASE}
          </TextInput>
        </div>
      </Confirm>
    );
  }
};
