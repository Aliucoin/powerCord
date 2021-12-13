const { React } = require('powerCord/webpack');
const { Confirm } = require('powerCord/components/modal');
const { TextInput } = require('powerCord/components/settings');

const { close: closeModal } = require('powerCord/modal');

module.exports = class EmojiNameModal extends React.Component {
  constructor () {
    super();

    this.state = {
      emojiName: ''
    };
  }

  render () {
    return (
      <Confirm
        red={false}
        header='Set the emote name'
        confirmText='Continue'
        cancelText='Cancel'
        onConfirm={() => this.props.onConfirm(this.state.emojiName)}
        onCancel={() => closeModal()}
      >
        <div className='powerCord-emojiName-modal'>
          <TextInput
            defaultValue={this.state.emojiName}
            onChange={emojiName => this.setState({ emojiName })}
          >
            Emote name
          </TextInput>
        </div>
      </Confirm>
    );
  }
};
