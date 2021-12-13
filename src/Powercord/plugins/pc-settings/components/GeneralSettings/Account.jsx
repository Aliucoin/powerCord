const { React, i18n: { Messages } } = require('powerCord/webpack');
const { Icons } = require('powerCord/components');
const { WEBSITE } = require('powerCord/constants');

module.exports = (props) => {
  const baseUrl = powerCord.settings.get('backendURL', WEBSITE);

  return (
    <div className='powerCord-account-list-account'>
      {React.createElement(Icons[props.type])}
      <span className='powerCord-account-item'>
        {powerCord.account.accounts[props.type.toLowerCase()]
          ? powerCord.account.accounts[props.type.toLowerCase()]
          : <a href={`${baseUrl}/api/v2/oauth/${props.type.toLowerCase()}`} target='_blank'>{Messages.POWERCORD_LINK_NOW}</a>}
      </span>
    </div>
  );
};
