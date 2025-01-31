const { React, getModule } = require('powerCord/webpack');
const { Icons: { SdkWordmark }, AsyncComponent } = require('powerCord/components');

module.exports = AsyncComponent.from((async () => {
  const titleBar = await getModule(m => typeof m === 'function' && m.toString().includes('PlatformTypes.WINDOWS') && m.toString().includes('PlatformTypes.OSX'));
  const windows = titleBar({ type: 'WINDOWS' }).type;
  return (props) => {
    const res = windows(props);
    res.props.className += ' powerCord-sdk-title';
    res.props.children[0].props.children = React.createElement(SdkWordmark, { height: 16 });
    return res;
  };
})());
