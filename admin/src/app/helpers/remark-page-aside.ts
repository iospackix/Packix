import {RemarkComponent} from "./remark-component";
import {Breakpoints} from "./breakpoints";

declare var $: JQueryStatic;
const $BODY = $('body');

export class RemarkPageAside extends RemarkComponent {
  scrollable: any;
  $scroll: any;
  //$el: any;
  native: any;
  api: any;
  constructor(options : any) {
    super(options);
   // this.$el = options.$el[0];
    this.native = false;
    this.api = null;
    console.log(this.$el);

  }

  processed() {
    this.$scroll = $(this.$el).find('.page-aside-scroll');
    this.scrollable = this.$scroll.asScrollable({
      namespace: 'scrollable',
      contentSelector: '>',
      containerSelector: '>'
    }).data('asScrollable');

    console.log(this.$scroll);
    console.log('SCROLL THING');
    console.log(this.$scroll.data('asScrollable'));

    if ($BODY.is('.page-aside-fixed') || $BODY.is('.page-aside-scroll')) {
      this.$el.on('transitionend', () => {
        this.scrollable.update();
      });
    }

    Breakpoints.on('change', () => {
      let current = Breakpoints.current().name;

      if (!$BODY.is('.page-aside-fixed') && !$BODY.is('.page-aside-scroll')) {
        if (current === 'xs') {
          this.scrollable.enable();
          this.$el.on('transitionend', () => {
            this.scrollable.update();
          });
        } else {
          this.$el.off('transitionend');
          this.scrollable.update();
        }
      }
    });

    $(document).on('click.pageAsideScroll', '.page-aside-switch', () => {
      let isOpen = this.$el.hasClass('open');

      if (isOpen) {
        this.$el.removeClass('open');
      } else {
        this.scrollable.update();
        this.$el.addClass('open');
      }
    });

    $(document).on('click.pageAsideScroll', '[data-toggle="collapse"]', (e) => {
      let $trigger = $(e.target);
      if (!$trigger.is('[data-toggle="collapse"]')) {
        $trigger = $trigger.parents('[data-toggle="collapse"]');
      }
      let href;
      let target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
      let $target = $(target);

      if ($target.attr('id') === 'site-navbar-collapse') {
        this.scrollable.update();
      }
    });
  }
}
