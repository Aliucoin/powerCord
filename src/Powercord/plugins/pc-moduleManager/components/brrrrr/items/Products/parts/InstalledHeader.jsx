const { React, i18n: { Messages } } = require('powerCord/webpack');
const { Tooltip, Switch } = require('powerCord/components');

// @todo: merge with Product/
module.exports = ({ name, enabled, onDisable, onEnable }) =>
  <div className='powerCord-plugin-header'>
    <h4>{name}</h4>
    <Tooltip text={enabled ? Messages.DISABLE : Messages.ENABLE} position='top'>
      <div>
        <Switch value={enabled} onChange={enabled ? onDisable : onEnable}/>
      </div>
    </Tooltip>
  </div>;
