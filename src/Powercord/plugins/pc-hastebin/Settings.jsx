const { React } = require('powerCord/webpack');
const { TextInput, SwitchItem } = require('powerCord/components/settings');

module.exports = ({ getSetting, updateSetting, toggleSetting }) => (
  <div>
    <TextInput
      note='The domain used for the Hastebin server.'
      defaultValue={getSetting('domain', 'https://haste.powerCord.dev')}
      required={true}
      onChange={val => updateSetting('domain', val.endsWith('/') ? val.slice(0, -1) : val)}
    >
      Domain
    </TextInput>
    <SwitchItem
      note='Whether the Hastebin link is sent in chat by default or not.'
      value={getSetting('send', false)}
      onChange={() => toggleSetting('send')}
    >
      Send Link
    </SwitchItem>
  </div>
);
