const { React, i18n: { Messages } } = require('powerCord/webpack');
const { open: openModal, close: closeModal } = require('powerCord/modal');
const { Confirm } = require('powerCord/components/modal');

const InstalledProduct = require('../parts/InstalledProduct');
const Base = require('./Base');

class Plugins extends Base {
  renderItem (item) {
    return (
      <InstalledProduct
        product={item.manifest}
        isEnabled={powerCord.pluginManager.isEnabled(item.entityID)}
        onToggle={async v => {
          await this._toggle(item.entityID, v);
          this.forceUpdate();
        }}
        onUninstall={() => this._uninstall(item.entityID)}
      />
    );
  }

  getItems () {
    const dont = [ 'pc-commands', 'pc-connections', 'pc-docs', 'pc-i18n', 'pc-moduleManager', 'pc-notices', 'pc-rpc', 'pc-sdk', 'pc-settings', 'pc-updater' ];
    const plugins = Array.from(powerCord.pluginManager.plugins.values()).filter((p) => !dont.includes(p.entityID));
    return this._sortItems(plugins);
  }

  fetchMissing () { // @todo: better impl + i18n
    // noinspection JSIgnoredPromiseFromCall
    powerCord.pluginManager.get('pc-moduleManager')._fetchEntities('plugins');
  }

  _toggle (pluginID, enabled) {
    let fn;
    let plugins;
    if (enabled) {
      plugins = [ pluginID ].concat(powerCord.pluginManager.get(pluginID).dependencies);
      fn = powerCord.pluginManager.enable.bind(powerCord.pluginManager);
    } else {
      plugins = [ pluginID ].concat(powerCord.pluginManager.get(pluginID).dependents);
      fn = powerCord.pluginManager.disable.bind(powerCord.pluginManager);
    }

    const apply = async () => {
      for (const plugin of plugins) {
        await fn(plugin);
      }
    };

    if (plugins.length === 1) {
      return apply();
    }

    const title = enabled
      ? Messages.POWERCORD_PLUGINS_ENABLE
      : Messages.POWERCORD_PLUGINS_DISABLE;
    const note = enabled
      ? Messages.POWERCORD_PLUGINS_ENABLE_NOTE
      : Messages.POWERCORD_PLUGINS_DISABLE_NOTE;
    openModal(() => (
      <Confirm
        red={!enabled}
        header={title}
        confirmText={title}
        cancelText={Messages.CANCEL}
        onConfirm={async () => {
          await apply();
          this.forceUpdate();
          closeModal();
        }}
        onCancel={closeModal}
      >
        <div className='powerCord-products-modal'>
          <span>{note}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{powerCord.pluginManager.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  }

  _uninstall (pluginID) {
    const plugins = [ pluginID ].concat(powerCord.pluginManager.get(pluginID).dependents);
    openModal(() => (
      <Confirm
        red
        header={Messages.POWERCORD_PLUGINS_UNINSTALL.format({ pluginCount: plugins.length })}
        confirmText={Messages.POWERCORD_PLUGINS_UNINSTALL.format({ pluginCount: plugins.length })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          for (const plugin of plugins) {
            await powerCord.pluginManager.uninstall(plugin);
          }
          this.forceUpdate();
          closeModal();
        }}
      >
        <div className='powerCord-products-modal'>
          <span>{Messages.POWERCORD_PLUGINS_UNINSTALL_SURE.format({ pluginCount: plugins.length })}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{powerCord.pluginManager.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  }
}

module.exports = Plugins;
