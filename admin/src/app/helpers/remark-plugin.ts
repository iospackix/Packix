declare var $: any;

let plugins = {};
let apis = {};

class RemarkPlugin {
  name: any;
  $el: any;
  options: any;
  isRendered: any;

  static registerApi(name, obj) {
    let api = obj.api();

    if (typeof api === 'string') {
      api = obj.api().split('|');
      let event = api[0] + `.plugin.${name}`;
      let func = api[1] || 'render';

      let callback = function(e) {
        let $el = $(this);
        let plugin = $el.data('pluginInstance');

        if (!plugin) {
          plugin = new obj($el, $.extend(true, {}, getDefaults(name), $el.data()));
          plugin = new obj($el, $.extend(true, {}, getDefaults(name), $el.data()));
          plugin.initialize();
          $el.data('pluginInstance', plugin);
        }

        plugin[func](e);
      };

      apis[name] = function(selector, context) {
        if (context) {
          $(context).off(event);
          $(context).on(event, selector, callback);
        } else {
          $(selector).on(event, callback);
        }
      };
    } else if (typeof api === 'function') {
      apis[name] = api;
    }
  }

  static getDefaults() {
    return {};
  }

  static register(name, obj) {
    if (typeof obj === 'undefined') {
      return;
    }

    plugins[name] = obj;

    if (typeof obj.api !== 'undefined') {
      RemarkPlugin.registerApi(name, obj);
    }
  }

  constructor($el, options = {}) {
    this.name = this.getName();
    this.$el = $el;
    this.options = options;
    this.isRendered = false;
  }

  getName() {
    return 'plugin';
  }

  render(): void {
    if ($.fn[this.name]) {
      this.$el[this.name](this.options);
    } else {
      return;
    }
  }

  initialize() {
    if (this.isRendered) {
      return;
    }
    this.render();
    this.isRendered = true;
  }
}

function getPluginAPI(name) {
  if (typeof name === 'undefined') {
    return apis;
  } else {
    return apis[name];
  }
}

function getPlugin(name) {
  if (typeof plugins[name] !== 'undefined') {
    return plugins[name];
  } else {
    console.warn('Plugin:' + name + ' has no warpped class.');
    return false;
  }
}

function getDefaults(name) {
  let PluginClass = getPlugin(name);

  if (PluginClass) {
    return PluginClass.getDefaults();
  } else {
    return {};
  }
}

function pluginFactory(name, $el, options = {}) {
  let PluginClass = getPlugin(name);

  if (PluginClass && typeof PluginClass.api === 'undefined') {
    return new PluginClass($el, $.extend(true, {}, getDefaults(name), options));
  } else if ($.fn[name]) {
    let plugin = new RemarkPlugin($el, options);
    plugin.getName = function() {
      return name;
    };
    plugin.name = name;
    return plugin;
  } else if (typeof PluginClass.api !== 'undefined') {
    // console.log('Plugin:' + name + ' use api render.');
    return false;
  } else {
    console.warn('Plugin:' + name + ' script is not loaded.');
    return false;
  }
}

export {
  RemarkPlugin,
  getPluginAPI,
  getPlugin,
  getDefaults,
  pluginFactory
};
