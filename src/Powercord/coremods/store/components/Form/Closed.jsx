/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { React, getModule, getModuleByDisplayName } = require('powerCord/webpack');
const { DISCORD_INVITE, SpecialChannels: { SUPPORT_MISC } } = require('powerCord/constants');
const { gotoOrJoinServer } = require('powerCord/util');

const Banned = React.memo(
  () => {
    const GatedContent = getModuleByDisplayName('GatedContent', false);
    const { pageWrapper } = getModule([ 'pageWrapper' ], false);
    const { ageGatedImage } = getModule([ 'ageGatedImage' ], false);

    return (
      <div className={`powerCord-store ${pageWrapper}`}>
        <GatedContent
          imageClassName={ageGatedImage}
          title={'Sorry not sorry, you\'ve been banned'}
          description={'PowerCord Staff banned you from submitting this form due to abuse. To appeal the ban, please join our support server, and ask for help in #misc-support.'}
          onAgree={() => window.history.back()}
          onDisagree={() => gotoOrJoinServer(DISCORD_INVITE, SUPPORT_MISC)}
          disagreement='Support Server'
          agreement='Back'
        />
      </div>
    );
  }
);

const Unavailable = React.memo(
  () => {
    const GatedContent = getModuleByDisplayName('GatedContent', false);
    const { pageWrapper } = getModule([ 'pageWrapper' ], false);
    const { ageGatedImage } = getModule([ 'ageGatedImage' ], false);

    return (
      <div className={`powerCord-store ${pageWrapper}`}>
        <GatedContent
          imageClassName={ageGatedImage}
          title={'We\'re not accepting submissions at this time'}
          description={'Please try again later.'}
          onAgree={() => window.history.back()}
          onDisagree={() => gotoOrJoinServer(DISCORD_INVITE)}
          disagreement='Support Server'
          agreement='Back'
        />
      </div>
    );
  }
);

module.exports = {
  Banned,
  Unavailable
};
