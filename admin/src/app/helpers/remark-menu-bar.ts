import {RemarkComponent} from './remark-component';
import {ScrollablePlugin} from './plugins/scrollable';
import {Breakpoints} from "./breakpoints";

declare var $: JQueryStatic;
const $BODY = $('body');
const $HTML = $('html');

class Scrollable extends ScrollablePlugin {
  $el: any;
  native: any;
  api: any;
  constructor($el) {
    super($el);
    this.$el = $el;
    this.native = false;
    this.api = null;
    this.init();
  }

  init() {
    // if ($BODY.is('.site-menubar-native')) {
    //   this.native = true;
    //   return;
    // }
    // this.api = new AsScrollable(this.$el, {
    //   namespace: 'scrollable',
    //   skin: 'scrollable-inverse',
    //   direction: 'vertical',
    //   contentSelector: '>',
    //   containerSelector: '>'
    // });
    console.log(this.$el);
    this.api = this.$el.asScrollable({
      namespace: 'scrollable',
      skin: 'scrollable-inverse',
      direction: 'vertical',
      contentSelector: '>',
      containerSelector: '>'
    }).data('asScrollable');
  }

  update() {
    if (this.api) {
      this.api.update();
    }
  }

  enable() {
    if (this.native) {
      return;
    }
    if (!this.api) {
      this.init();
    }
    if (this.api) {
      this.api.enable();
    }
  }

  disable() {
    if (this.api) {
      this.api.disable();
    }
  }
}

class Hoverscroll {
  $el: any;
  api: any;
  constructor($el) {
    this.$el = $el;
    this.api = null;

    this.init();
  }

  init() {
    this.api = this.$el.asHoverScroll({
      direction: 'vertical',
      list: '.site-menu',
      item: '> li',
      exception: '.site-menu-sub',
      fixed: false,
      boundary: 100,
      onEnter() {
        // $(this).siblings().removeClass('hover');
        // $(this).addClass('hover');
      },
      onLeave() {
        // $(this).removeClass('hover');
      }
    }).data('asHoverScroll');
  }

  update() {
    if (this.api) {
      this.api.update();
    }
  }

  enable() {
    if (!this.api) {
      this.init();
    }
    if (this.api) {
      this.api.enable();
    }
  }

  disable() {
    if (this.api) {
      this.api.disable();
    }
  }
}

export class RemarkMenuBar extends RemarkComponent {
  top: any;
  folded: any;
  foldAlt: any;
  $menuBody: any;
  $menu: any;
  initialized: any;
  scrollable: any;
  hoverscroll: any;
  constructor(args: any) {
    super(args);

    this.top = false;
    this.folded = false;
    this.foldAlt = false;
    this.$menuBody = this.$el.children('.site-menubar-body');
    this.$menu = this.$el.find('[data-plugin=menu]');
    console.log(this);
    if (this.$menuBody.length > 0) {
      this.initialized = true;
    } else {
      this.initialized = false;
      return;
    }

    $('.site-menu-sub').on('touchstart', function(e) {
      e.stopPropagation();
    }).on('ponitstart', function(e) {
      e.stopPropagation();
    });
    this.scrollable = new Scrollable(this.$menuBody);
    this.hoverscroll = new Hoverscroll(this.$menuBody);
  }

  processed() {
    $HTML.removeClass('css-menubar').addClass('js-menubar');

    if ($BODY.is('.site-menubar-top')) {
      this.top = true;
    }

    if ($BODY.is('.site-menubar-fold-alt')) {
      this.foldAlt = true;
    }
    this.change(this.getState('menubarType'));
  }

  getDefaultState() {
    return {
      menubarType: 'unfold' // unfold, fold, open, hide;
    };
  }

  getDefaultActions() {
    return {
      menubarType: 'change'
    };
  }

  getMenuApi() {
    return this.$menu.data('menuApi');
  }

  setMenuData() {
    let api = this.getMenuApi();

    if (api) {
      api.folded = this.folded;
      api.foldAlt = this.foldAlt;
      api.outerHeight = this.$el.outerHeight();
    }
  }

  update() {
    this.scrollable.update();
    this.hoverscroll.update();
  }

  change(type) {
    if (this.initialized) {
      this.reset();
      this[type]();
      this.setMenuData();
    }
  }

  animate(doing, callback = function() {}) {
    $BODY.addClass('site-menubar-changing');

    doing.call(this);

    this.$el.trigger('changing.site.menubar');

    let menuApi = this.getMenuApi();
    if (menuApi) {
      menuApi.refresh();
    }

    setTimeout(() => {
      callback.call(this);
      $BODY.removeClass('site-menubar-changing');
      this.update();
      this.$el.trigger('changed.site.menubar');
    }, 500);
  }

  reset() {
    $BODY.removeClass('site-menubar-hide site-menubar-open site-menubar-fold site-menubar-unfold');
    $HTML.removeClass('disable-scrolling');
  }

  open() {
    this.animate(() => {
      $BODY.addClass('site-menubar-open site-menubar-unfold');

      $HTML.addClass('disable-scrolling');

    }, function() {
      this.scrollable.enable();
    });
  }

  hide() {
    this.hoverscroll.disable();

    this.animate(() => {
      $BODY.addClass('site-menubar-hide site-menubar-unfold');
    }, function() {
      this.scrollable.enable();
    });
  }

  unfold() {
    this.hoverscroll.disable();

    this.animate(function() {
      $BODY.addClass('site-menubar-unfold');
      this.folded = false;

    }, function() {
      this.scrollable.enable();

      this.triggerResize();
    });
  }

  fold() {
    this.scrollable.disable();

    this.animate(function() {

      $BODY.addClass('site-menubar-fold');
      this.folded = true;

    }, function() {
      this.hoverscroll.enable();

      this.triggerResize();
    });
  }
}
