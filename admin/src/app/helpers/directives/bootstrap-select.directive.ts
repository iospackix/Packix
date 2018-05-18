import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

declare var jQuery: any;

/**
 * Directive to wrap bootstrap-select
 */
@Directive({
  selector: '[bootstrapSelect]'
})
export class BootstrapSelectDirective implements OnInit, OnDestroy {
  private el;

  public compareFunction: any = function(ra, rb) {
    return ra && rb ? ra.id === rb.id : false;
  };

  constructor(private elref: ElementRef) {
    this.el = elref.nativeElement;
  }

  ngOnInit() {
    jQuery(this.el).selectpicker({
      iconBase: 'fa',
      tickIcon: 'fa-check'
    });
  }

  ngOnDestroy() {
    jQuery(this.el).selectpicker('destroy');
  }

  // public get compareWith() {
  //   return this.compareFunction;
  // }

  refresh() {
    jQuery(this.el).selectpicker('refresh');
  }

  /**
   * Manually dispatch a change event to let Angular know of a programmatic change to the select
   */
  triggerChangeEvent() {
    this.el.dispatchEvent(new Event('change', { 'bubbles': true }));
  }

  /**
   * Select an option in this select by it's id
   * @param id
   */
  selectOptionById(id) {
    jQuery(this.el).find('#'.concat(id)).prop('selected', true);
    this.triggerChangeEvent();
  }
}
