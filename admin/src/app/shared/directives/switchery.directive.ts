import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

declare var jQuery: any;
declare var Switchery: any;

@Directive({
  selector: '[switchery]'
})
export class SwitcheryDirective implements OnInit {
  private el;
  private switch;

  constructor(private elRef: ElementRef) {
    this.el = elRef.nativeElement;
  }

  ngOnInit() {
    this.switch = new Switchery(this.el, {
      size: 'small'
    });
    console.log(this.switch);
  }
}
