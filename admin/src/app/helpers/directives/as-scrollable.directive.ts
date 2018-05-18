import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
declare var $: any;
declare var ResizeSensor: any;

@Directive({
  selector: '[as-scrollable]'
})
export class AsScrollableDirective implements AfterViewInit {

  $el: any;
  api: any;
  hasStarted = false;
  constructor(el: ElementRef) {
    // console.log(el);
    this.$el = $(el.nativeElement);
    // new ResizeSensor(this.$el, () => {
    //    console.log(this.$el.height());
    //   console.log(this.$el.width());
    // });

    this.$el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
      console.log('showed for the first time 45');
      // this.$el.asScrollable({
      //     namespace: 'scrollable',
      //     contentSelector: '> [data-role=\'content\']',
      //     containerSelector: '> [data-role=\'container\']'
      //   });
    });

    console.log(this.$el);
  }

  ngAfterViewInit() {
    console.log(this.$el);
    this.$el.asScrollable({
      namespace: 'scrollable',
      contentSelector: '>',
      containerSelector: '>'
    });

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
}
