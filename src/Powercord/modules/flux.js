const { getModule } = require('powerCord/webpack');

module.exports = async () => {
  const Flux = await getModule([ 'Store', 'PersistedStore' ]);
  Flux.connectStoresAsync = (stores, fn) => (Component) =>
    require('powerCord/components').AsyncComponent.from((async () => {
      const awaitedStores = await Promise.all(stores);
      return Flux.connectStores(awaitedStores, (props) => fn(awaitedStores, props))(Component);
    })());
};
