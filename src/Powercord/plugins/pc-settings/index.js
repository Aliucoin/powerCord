const { React, getModuleByDisplayName, getModule, i18n: { Messages } } = require('powerCord/webpack');
const { AsyncComponent, Menu } = require('powerCord/components');
const { inject, uninject } = require('powerCord/injector');
const { WEBSITE } = require('powerCord/constants');
const { Plugin } = require('powerCord/entities');

const ErrorBoundary = require('./components/ErrorBoundary');
const GeneralSettings = require('./components/GeneralSettings');
// const Labs = require('./components/Labs');

const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));

module.exports = class Settings extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');

    powerCord.api.settings.registerSettings('pc-general', {
      category: 'pc-general',
      label: () => Messages.POWERCORD_GENERAL_SETTINGS,
      render: GeneralSettings
    });

    this.patchSettingsContextMenu();
    this.patchSettingsComponent();
    this.patchExperiments();
  }

  async pluginWillUnload () {
    powerCord.api.settings.unregisterSettings('pc-general');
    uninject('pc-settings-items');
    uninject('pc-settings-actions');
    uninject('pc-settings-errorHandler');
  }

  async patchExperiments () {
    try {
      const experimentsModule = await getModule(r => r.isDeveloper !== void 0);
      Object.defineProperty(experimentsModule, 'isDeveloper', {
        get: () => powerCord.settings.get('experiments', false)
      });

      // Ensure components do get the update
      experimentsModule._changeCallbacks.forEach(cb => cb());
    } catch (_) {
      // memes
    }
  }

  async patchSettingsComponent () {
    const SettingsView = await getModuleByDisplayName('SettingsView');
    inject('pc-settings-items', SettingsView.prototype, 'getPredicateSections', (_, sections) => {
      const changelog = sections.find(c => c.section === 'changelog');
      if (changelog) {
        const settingsSections = Object.keys(powerCord.api.settings.tabs).map(s => this._makeSection(s));
        sections.splice(
          sections.indexOf(changelog), 0,
          {
            section: 'HEADER',
            label: 'PowerCord'
          },
          ...settingsSections,
          { section: 'DIVIDER' }
        );
      }

      if (sections.find(c => c.section === 'CUSTOM')) {
        sections.find(c => c.section === 'CUSTOM').element = ((_element) => function () {
          const res = _element();
          if (res.props.children && res.props.children.length === 3) {
            res.props.children.unshift(
              Object.assign({}, res.props.children[0], {
                props: Object.assign({}, res.props.children[0].props, {
                  href: WEBSITE,
                  title: 'PowerCord',
                  className: `${res.props.children[0].props.className} powerCord-pc-icon`
                })
              })
            );
          }
          return res;
        })(sections.find(c => c.section === 'CUSTOM').element);
      }

      const latestCommitHash = powerCord.gitInfos.revision.substring(0, 7);
      const debugInfo = sections[sections.findIndex(c => c.section === 'CUSTOM') + 1];
      if (debugInfo) {
        debugInfo.element = ((_element) => function () {
          const res = _element();
          if (res.props.children && res.props.children.length === 3) {
            res.props.children.push(
              Object.assign({}, res.props.children[0], {
                props: Object.assign({}, res.props.children[0].props, {
                  children: [ 'PowerCord', ' ', React.createElement('span', {
                    className: res.props.children[0].props.children[4].props.className,
                    children: [ powerCord.gitInfos.branch, ' (', latestCommitHash, ')' ]
                  }) ]
                })
              })
            );
          }
          return res;
        })(debugInfo.element);
      }

      return sections;
    });
  }

  _makeSection (tabId) {
    const props = powerCord.api.settings.tabs[tabId];
    const label = typeof props.label === 'function' ? props.label() : props.label;
    return {
      label,
      section: tabId,
      element: () => this._renderWrapper(label, props.render)
    };
  }

  _renderWrapper (label, Component) {
    return React.createElement(ErrorBoundary, null,
      React.createElement(FormSection, {},
        React.createElement(FormTitle, { tag: 'h2' }, label),
        React.createElement(Component)
      )
    );
  }

  async patchSettingsContextMenu () {
    const SettingsContextMenu = await getModule(m => m.default?.displayName === 'UserSettingsCogContextMenu');
    inject('pc-settings-actions', SettingsContextMenu, 'default', (_, res) => {
      const parent = React.createElement(Menu.MenuItem, {
        id: 'powerCord-actions',
        label: 'PowerCord'
      }, Object.keys(powerCord.api.settings.tabs).map(tabId => {
        const props = powerCord.api.settings.tabs[tabId];
        const label = typeof props.label === 'function' ? props.label() : props.label;

        return React.createElement(Menu.MenuItem, {
          label,
          id: tabId,
          action: async () => {
            const settingsModule = await getModule([ 'open', 'saveAccountChanges' ]);
            settingsModule.open(tabId);
          }
        });
      }));

      parent.key = 'PowerCord';

      const items = res.props.children.find(child => Array.isArray(child));
      const changelog = items.find(item => item?.props?.id === 'changelog');
      if (changelog) {
        items.splice(items.indexOf(changelog), 0, parent);
      } else {
        this.error('Unable to locate "Change Log" item; forcing element to context menu!');
        res.props.children.push(parent);
      }

      return res;
    });
  }
};
