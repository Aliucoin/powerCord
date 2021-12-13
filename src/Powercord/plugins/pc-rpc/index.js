const { Plugin } = require('powerCord/entities');
const { getModule } = require('powerCord/webpack');
const { WEBSITE } = require('powerCord/constants');
const { inject, uninject } = require('powerCord/injector');

module.exports = class RPC extends Plugin {
  async startPlugin () {
    return; // shhhh

    /* eslint-disable */
    this.handlers = await getModule([ 'INVITE_BROWSER' ]);
    this._patchHTTPServer();
    this._patchWebSocketServer();

    this._boundAddEvent = this._addEvent.bind(this);
    this._boundRemoveEvent = this._removeEvent.bind(this);

    powerCord.api.rpc.registerScope('POWERCORD_PRIVATE', w => w === WEBSITE);
    powerCord.api.rpc.on('eventAdded', this._boundAddEvent);
    powerCord.api.rpc.on('eventRemoved', this._boundRemoveEvent);
  }

  pluginWillUnload () {
    return; // shhhh

    /* eslint-disable */
    uninject('pc-rpc-ws');
    uninject('pc-rpc-ws-promise');

    powerCord.rpcServer.removeAllListeners('request');
    powerCord.rpcServer.on('request', this._originalHandler);

    powerCord.api.rpc.unregisterScope('POWERCORD_PRIVATE');
    powerCord.api.rpc.off('eventAdded', this._boundAddEvent);
    powerCord.api.rpc.off('eventRemoved', this._boundRemoveEvent);
  }

  _patchHTTPServer () {
    [ this._originalHandler ] = powerCord.rpcServer.listeners('request');
    powerCord.rpcServer.removeAllListeners('request');
    powerCord.rpcServer.on('request', (req, res) => {
      if (req.url === '/powerCord') {
        const data = JSON.stringify({
          code: 69,
          powerCord: powerCord.gitInfos,
          plugins: [ ...powerCord.pluginManager.plugins.values() ].filter(p => !p.isInternal).map(p => p.entityID),
          themes: [ ...powerCord.styleManager.themes.values() ].filter(t => t.isTheme).map(t => t.entityID)
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Length', data.length);
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      } else {
        this._originalHandler(req, res);
      }
    });
  }

  async _patchWebSocketServer () {
    const websocketHandler = await getModule([ 'validateSocketClient' ]);

    inject('pc-rpc-ws', websocketHandler, 'validateSocketClient', args => {
      if (args[2] === 'powerCord') {
        args[2] = void 0;
        args[3] = 'powerCord';
      }
      return args;
    }, true);

    inject('pc-rpc-ws-promise', websocketHandler, 'validateSocketClient', (args, res) => {
      if (args[3] === 'powerCord') {
        res.catch(() => void 0); // Shut
        args[0].authorization.scopes = [
          'POWERCORD',
          ...Object.keys(powerCord.api.rpc.scopes).filter(s => powerCord.api.rpc.scopes[s](args[1]))
        ];
        return Promise.resolve(null);
      }
      return res;
    });
  }

  _addEvent (event) {
    this.handlers[event] = powerCord.rpc.api.events[event];
  }

  _removeEvent (event) {
    delete this.handlers[event];
  }
};
