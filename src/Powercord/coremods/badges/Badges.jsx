/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { shell: { openExternal } } = require('electron');
const { open: openModal } = require('powerCord/modal');
const { gotoOrJoinServer } = require('powerCord/util');
const { Clickable, Tooltip, Icons: { badges: BadgeIcons } } = require('powerCord/components');
const { React, getModule, i18n: { Messages } } = require('powerCord/webpack');
const { WEBSITE, I18N_WEBSITE, DISCORD_INVITE, REPO_URL } = require('powerCord/constants');
const DonateModal = require('./DonateModal');

const Base = React.memo(({ color, tooltip, tooltipPosition, onClick, className, children }) => {
  const { profileBadge22 } = getModule([ 'profileBadge22' ], false);
  return (
    <Clickable onClick={onClick || (() => void 0)} className='powerCord-badge-wrapper'>
      <Tooltip text={tooltip} position={tooltipPosition || 'top' } spacing={24}>
        <div className={`${profileBadge22} powerCord-badge ${className}`} style={{ color: `#${color || '7289da'}` }}>
          {children}
        </div>
      </Tooltip>
    </Clickable>
  );
});

const Custom = React.memo(({ name, icon, tooltipPosition }) => (
  <Base
    tooltipPosition={tooltipPosition}
    onClick={() => openModal(DonateModal)}
    className='powerCord-badge-cutie'
    tooltip={name}
  >
    <img src={icon} alt='Custom badge'/>
  </Base>
));

const Developer = React.memo(({ color }) => (
  <Base
    onClick={() => openExternal(`${WEBSITE}/contributors`)}
    className='powerCord-badge-developer'
    tooltip={Messages.POWERCORD_BADGES_DEVELOPER}
    color={color}
  >
    <BadgeIcons.Developer/>
  </Base>
));

const Staff = React.memo(({ color }) => (
  <Base
    onClick={() => gotoOrJoinServer(DISCORD_INVITE)}
    className='powerCord-badge-staff'
    tooltip={Messages.POWERCORD_BADGES_STAFF}
    color={color}
  >
    <BadgeIcons.Staff/>
  </Base>
));

const Support = React.memo(({ color }) => (
  <Base
    onClick={() => gotoOrJoinServer(DISCORD_INVITE)}
    className='powerCord-badge-support'
    tooltip={Messages.POWERCORD_BADGES_SUPPORT}
    color={color}
  >
    <BadgeIcons.Support/>
  </Base>
));

const Contributor = React.memo(({ color }) => (
  <Base
    onClick={() => openExternal(`${WEBSITE}/contributors`)}
    className='powerCord-badge-contributor'
    tooltip={Messages.POWERCORD_BADGES_CONTRIBUTOR}
    color={color}
  >
    <BadgeIcons.Contributor/>
  </Base>
));

const Translator = React.memo(({ color }) => ( // @todo: flag
  <Base
    onClick={() => openExternal(I18N_WEBSITE)}
    className='powerCord-badge-translator'
    tooltip={Messages.POWERCORD_BADGES_TRANSLATOR}
    color={color}
  >
    <BadgeIcons.Translator/>
  </Base>
));

const BugHunter = React.memo(({ color }) => (
  <Base
    onClick={() => openExternal(`https://github.com/${REPO_URL}/issues?q=label:bug`)}
    className='powerCord-badge-hunter'
    tooltip={Messages.POWERCORD_BADGES_HUNTER}
    color={color}
  >
    <BadgeIcons.Hunter/>
  </Base>
));

const EarlyUser = React.memo(({ color }) => (
  <Base
    className='powerCord-badge-early'
    tooltip={Messages.POWERCORD_BADGES_EARLY}
    color={color}
  >
    <BadgeIcons.Early/>
  </Base>
));

module.exports = {
  Custom,
  Developer,
  Staff,
  Support,
  Contributor,
  Translator,
  BugHunter,
  EarlyUser
};
