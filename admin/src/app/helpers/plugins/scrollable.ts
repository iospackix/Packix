// import $ from 'jquery';
import {RemarkPlugin} from '../remark-plugin';

const NAME = 'scrollable';

class ScrollablePlugin extends RemarkPlugin {
  static getDefaults() {
    return {
      namespace: 'scrollable',
      contentSelector: '> [data-role=\'content\']',
      containerSelector: '> [data-role=\'container\']'
    };
  }
  constructor(args: any) {
    super(args);
  }

  getName() {
    return NAME;
  }

  render() {
    let $el = this.$el;

    $el.asScrollable(this.options);
  }
}

export {ScrollablePlugin}
