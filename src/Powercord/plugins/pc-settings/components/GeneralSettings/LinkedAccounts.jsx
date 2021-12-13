const { React, i18n: { Messages } } = require('powerCord/webpack');
const { Icons: { Sync, Unlink } } = require('powerCord/components');

const Account = require('./Account.jsx');

// const syncEnabled = powerCord.settings.get('settingsSync', false);
module.exports = (props) => (
  <div className='powerCord-account-list'>
    <div className='powerCord-account-list-accounts'>
      <Account type='Spotify'/>
      {/* syncEnabled && <div className='powerCord-account-list-account'>
        <Key/>
        <a className='powerCord-account-item' href='#' onClick={() => props.passphrase()}>
          {Messages.POWERCORD_UPDATE_PASSPHRASE}
        </a>
      </div> */}
    </div>
    <div>
      <div className='powerCord-account-list-account'>
        <Sync/>
        <a className='powerCord-account-item' href='#' onClick={() => props.refresh()}>
          {Messages.POWERCORD_REFRESH_ACCOUNTS}
        </a>
      </div>

      <div className='powerCord-account-list-account'>
        <Unlink/>
        <a className='powerCord-account-item' href='#' onClick={() => props.unlink()}>
          {Messages.POWERCORD_UNLINK}
        </a>
      </div>
    </div>
  </div>
);
