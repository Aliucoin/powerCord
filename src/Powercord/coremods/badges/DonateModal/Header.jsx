const { React, getModuleByDisplayName } = require('powerCord/webpack');
const { AsyncComponent, Icons: { PowerCordCutie } } = require('powerCord/components');
const { close: closeModal } = require('powerCord/modal');

module.exports = AsyncComponent.from((async () => {
  const PremiumGuildModalHeader = await getModuleByDisplayName('PremiumGuildModalHeader');
  return () => {
    const res = React.createElement(PremiumGuildModalHeader, { onClose: closeModal });

    const renderer = res.type;
    res.type = (props) => {
      const res = renderer(props);
      res.props.children[1] =
        <div className='powerCord-cutie'>
          <PowerCordCutie height={32}/>
        </div>;

      return res;
    };
    return res;
  };
})());
