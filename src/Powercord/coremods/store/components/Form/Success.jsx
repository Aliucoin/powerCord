/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { React, getModule, getModuleByDisplayName } = require('powerCord/webpack');
const { Icons: { badges: { Staff } } } = require('powerCord/components');

module.exports = React.memo(
  () => {
    const GatedContent = getModuleByDisplayName('GatedContent', false);
    const { transitionTo } = getModule([ 'transitionTo' ], false);

    return (
      <GatedContent
        imageClassName='powerCord-store-success'
        title={'Success! We received your form.'}
        description={<>We'll give it the attention it deserved and reach out once this process is complete. You can identify PowerCord Staff members thanks to the <Staff width={16} height={16}/> badge on their profile.</>}
        onDisagree={() => transitionTo('/_powerCord/store/plugins')}
        disagreement='Go back to store'
      />
    );
  }
);
