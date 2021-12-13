const { React } = require('powerCord/webpack');
const Toast = require('./Toast');

class ToastContainer extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = { leaving: null };
    this._addedHandler = () => this.forceUpdate();
    this._leavingHandler = (id) => {
      this.setState({ leaving: id });
      setTimeout(() => this.setState({ leaving: null }), 510);
    };
  }

  componentDidMount () {
    powerCord.api.notices.on('toastAdded', this._addedHandler);
    powerCord.api.notices.on('toastLeaving', this._leavingHandler);
  }

  componentWillUnmount () {
    powerCord.api.notices.off('toastAdded', this._addedHandler);
    powerCord.api.notices.off('toastLeaving', this._leavingHandler);
  }

  render () {
    const toast = Object.keys(powerCord.api.notices.toasts).pop();
    return <div className='powerCord-toast-container'>
      {toast && <Toast
        leaving={this.state.leaving === toast} id={toast}
        {...powerCord.api.notices.toasts[toast]}
      />}
    </div>;
  }
}

module.exports = ToastContainer;
