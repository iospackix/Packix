declare var $: any;
import {pluginFactory, getPluginAPI} from './remark-plugin';
import { RemarkComponent } from './remark-component';

class RemarkBase extends RemarkComponent {
  $el: any;
  constructor(options: any = {}) {
    super(options);
  }
  initializePlugins(context = false) {
    $('[data-plugin]', context || this.$el).each(function() {
      let $this = $(this),
        name = $this.data('plugin'),
        plugin = pluginFactory(name, $this, $this.data());
      if (plugin) {
        plugin.initialize();
      }
    });
  }

  initializePluginAPIs(context = document) {
    let apis = getPluginAPI(null);

    for (let name in apis) {
      if (apis.hasOwnProperty(name)) {
        getPluginAPI(name)(`[data-plugin=${name}]`, context);
      }
    }
  }
}

export { RemarkBase }
