const { React, i18n: { Messages } } = require('powerCord/webpack');
const { Clickable } = require('powerCord/components');

// @todo: Figure out a way to re-enable the button if the snippet gets removed. Requires reload for now.
class SnippetButton extends React.Component {
  render () {
    const applied = this.props.main._quickCSS.includes(`Snippet ID: ${this.props.message.id}`);
    return (
      <div className={[ 'powerCord-snippet-apply', applied && 'applied' ].filter(Boolean).join(' ')}>
        <Clickable onClick={() => {
          if (!applied) {
            this.props.main._applySnippet(this.props.message).then(() => this.forceUpdate()); // yes ik its ew
          }
        }}>
          {applied ? Messages.POWERCORD_SNIPPET_APPLIED : Messages.POWERCORD_SNIPPET_APPLY}
        </Clickable>
      </div>
    );
  }
}

module.exports = SnippetButton;
