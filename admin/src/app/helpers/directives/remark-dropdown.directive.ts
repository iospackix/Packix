import {AfterViewInit, Directive, ElementRef} from '@angular/core';

declare var $: any;
@Directive({
  selector: '[remark-dropdown]'
})
export class RemarkDropdownDirective implements AfterViewInit {
  $el: any;
  constructor(el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  ngAfterViewInit() {
    this.$el.on('click', '.navbar-mega .dropdown-menu', (e) => {
      e.stopPropagation();
    }).on('show.bs.dropdown', (e) => {
      let $target = $(e.target);
      let $trigger = e.relatedTarget ? $(e.relatedTarget) : $target.children('[data-toggle="dropdown"]');
      let animation = $trigger.data('animation');

      if (animation) {
        let $menu = $target.children('.dropdown-menu');
        $menu
          .addClass(`animation-${animation}`)
          .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            $menu.removeClass('animation-' + animation);
          });
      }
    }).on('shown.bs.dropdown', (e) => {
      let $menu = $(e.target).find('.dropdown-menu-media > .list-group');
      if ($menu.length > 0) {
        let api = $menu.data('asScrollable');
        if (api) {
          api.update();
        } else {
          $menu.asScrollable({
            namespace: 'scrollable',
            contentSelector: '> [data-role=\'content\']',
            containerSelector: '> [data-role=\'container\']'
          });
        }
      }
    });
  }
}
