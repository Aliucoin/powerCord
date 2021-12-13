/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powerCord.dev/porkord-license
 */

const { React, getModule } = require('powerCord/webpack');
const { Button } = require('powerCord/components');

module.exports = React.memo(
  ({ renderer, onClick }) => {
    const { size16, size32 } = getModule([ 'size24' ], false);
    const { marginBottom20 } = getModule([ 'marginBottom20' ], false);
    return (
      <>
        {renderer()}
        <h2 className={`${size32} ${marginBottom20}`}>I meet all the requirements!</h2>
        {powerCord.account
          ? <>
            <div className={`${size16} ${marginBottom20}`}>
              You're ready for next step! Click the button below to start filling out the form.
            </div>
            <Button onClick={onClick}>Get started</Button>
          </>
          : <>
            <div className={`${size16} ${marginBottom20}`}>
              You're almost ready for next step. Before you can continue, you'll need to link your PowerCord account to Discord.
            </div>
            <Button onClick={() => getModule([ 'open', 'saveAccountChanges' ], false).open('pc-general')}>Go to settings</Button>
          </>}
      </>
    );
  }
);
