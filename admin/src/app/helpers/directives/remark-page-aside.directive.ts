import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {RemarkBase} from "../remark-base";
import {Breakpoints} from "../breakpoints";
import {RemarkPageAside} from "../remark-page-aside";
import {RemarkComponent} from "../remark-component";
declare var $: any;
declare var ResizeSensor: any;

@Directive({
  selector: '[remarkPageAside]'
})
export class RemarkPageAsideDirective extends RemarkComponent implements AfterViewInit {
  lastWidth = 0;
  $el: any;
  api: any;
  $thing: any;
  constructor(el: ElementRef) {
    super({
      doLater: true,
      $el: $(el.nativeElement)
    });
    // console.log('this is the eleement');
    // console.log(el);
    // console.log(el);
    // this.$el = $(el.nativeElement);
    // console.log('this is the el');
    // console.log(el);
    // this.$thing = el;
    console.log(this);
    Breakpoints();
  }

  ngAfterViewInit() {
    console.log(this);
    console.log('called after init');
    console.log(this.$el);
    //this.asideObject = new RemarkPageAside(this.$el[0]);
    this._doLater({
      doLater: true,
      $el: $(this.el)
    });

    this.run(null);
    // this.run();
    // this.menuBar = new RemarkMenuBar({
    //   $el: $('#menubar')[0]
    // });

    // this.menuBar.run(null);
    // $(document).on('click', '[data-toggle="menubar"]', () => {
    //   let body = $('body');
    //   console.log(this._getDefaultMeunbarType());
    //   if (body.hasClass('site-menubar-open')) {
    //     body.removeClass('site-menubar-unfold');
    //     body.addClass('site-menubar-fold');
    //     body.removeClass('site-menubar-open');
    //     body.addClass('site-menubar-close');
    //   } else if (body.hasClass('site-menubar-fold')) {
    //     body.addClass('site-menubar-' + this._getDefaultMeunbarType())
    //     body.removeClass('site-menubar-fold');
    //     body.addClass('site-menubar-unfold');
    //     body.removeClass('site-menubar-close');
    //     body.addClass('site-menubar-open');
    //   }
    //   return false;
    // });

 //  this.children[0].state = this.children[0].initialState;initial

    // let api = this.$el.data('asScrollable');
    // if (api) {
    //   api.update();
    // }
    // window['452'] = $('.list-group').asScrollable({
    //   namespace: 'scrollable',
    //   contentSelector: '[data-role=\'content\']',
    //   containerSelector: '[data-role=\'container\']'
    // });
    // this.api.enable();
    // this.api.update();
    // this.$el.on('resize', () => {
    //   this.api.update();
    // });
    // window['thing34'] = this.api;
  }

  getDefaultChildren() {
    let children = [];
    console.log(this);
    console.log(this.$thing);
    let $aside = this.$el;
    children.push(new RemarkPageAside({
      $el: $aside
    }));
    return children;
  }
}
