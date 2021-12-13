const { React } = require('powerCord/webpack');
const Announcement = require('./Announcement');

class AnnouncementContainer extends React.PureComponent {
  constructor (props) {
    super(props);

    this._handler = () => this.forceUpdate();
  }

  componentDidMount () {
    powerCord.api.notices.on('announcementAdded', this._handler);
    powerCord.api.notices.on('announcementClosed', this._handler);
  }

  componentWillUnmount () {
    powerCord.api.notices.off('announcementAdded', this._handler);
    powerCord.api.notices.off('announcementClosed', this._handler);
  }

  render () {
    const aId = Object.keys(powerCord.api.notices.announcements).pop();
    return aId
      ? <Announcement id={aId} {...powerCord.api.notices.announcements[aId]}/>
      : null;
  }
}

module.exports = AnnouncementContainer;
