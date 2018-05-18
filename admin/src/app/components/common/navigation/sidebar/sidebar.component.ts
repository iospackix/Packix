///<reference path="../../../../../../node_modules/@types/jquery/index.d.ts"/>
import {Component, AfterViewInit} from '@angular/core';
import {RemarkState} from '../../../../helpers/remark-state';
import {Breakpoints} from '../../../../helpers/breakpoints';

declare var $: any;
import {RemarkMenuBar} from '../../../../helpers/remark-menu-bar';
import {RemarkBase} from '../../../../helpers/remark-base';
import {ScrollablePlugin} from "../../../../helpers/plugins/scrollable";
import {RemarkPlugin} from "../../../../helpers/remark-plugin";

const DOC = document;
const $DOC = $(document);
const $BODY = $('body');
const $WINDOW = $(window);

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})

export class SidebarComponent extends RemarkBase implements AfterViewInit {
  lastWidth = 0;
  constructor(
  ) {
    super({
      doLater: true
    });
    Breakpoints();

    // if (1) {
    //   let token = new SDKToken({
    //     this.auth.
    //   })
    //   this.auth.setToken({});
    //   // this.auth.setUser(token);
    //   this.auth.setRememberMe(true);
    //   this.auth.save();
    //   this.userApi.findById(token.userId)
    //     .subscribe(response => {
    //       this.auth.getToken().user = <User>response;
    //       this.userIdentityApi.find({ "where": { "userId": token.userId } }).subscribe((identities: UserIdentity[]) => {
    //         this.auth.getToken().user["identities"] = identities;
    //         this.auth.save();
    //         this.router.navigate(['/']);
    //       })
    //     })
    // }
  }

  _getDefaultMeunbarType() {
    let breakpoint = this.getCurrentBreakpoint();
    let type = '';

    if ($BODY.data('autoMenubar') === false || $BODY.is('.site-menubar-keep')) {
      if ($BODY.hasClass('site-menubar-fold')) {
        type = 'fold';
      } else if ($BODY.hasClass('site-menubar-unfold')) {
        type = 'unfold';
      }
    }

    switch (breakpoint) {
      case 'lg':
        type = type || 'unfold';
        break;
      case 'md':
      case 'sm':
        type = type || 'fold';
        break;
      case 'xs':
        type = 'hide';
        break;
      // no default
    }
    return type;
  }

  getDefaultState() {
    let menubarType = this._getDefaultMeunbarType();
    return {
      menubarType
    };
  }


  getCurrentBreakpoint() {
    let bp = Breakpoints.current();
    return bp ? bp.name : 'lg';
  }

  ngAfterViewInit() {
    this._doLater({
      doLater: false
    });

    $(".has-sub > a").each(function() {
      $( this ).click(function() {
        var parentElm =  $( this ).parent("li");
        parentElm.each(function() {
          $( this ).toggleClass("open")
        });
      });
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

    this.children[0].state = this.children[0].initialState;
    $(document).on('click', '[data-toggle="menubar"]', () => {
      console.log(this.getState('menubarType'));
      let type = this.getState('menubarType');
      switch (type) {
        case 'fold':
          type = 'unfold';
          break;
        case 'unfold':
          type = 'fold';
          break;
        case 'open':
          type = 'hide';
          break;
        case 'hide':
          type = 'open';
          break;
        // no default
      }

      this.setState('menubarType', type);
      console.log(this);
      // console.log(this.children);
      // this.children[0].change(type);
      return false;
    });

    let resizeId;
    $(window).on('resize', () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(() => {
        let windowWidth = $WINDOW.width();

        /* Use !== operator instead of !=. */
        if (this.lastWidth !== windowWidth) {
          // EXECUTE YOUR CODE HERE
          this.lastWidth = windowWidth;
          console.log('changed breakpoints');
          this.setState('menubarType', this._getDefaultMeunbarType());
        }
      }, 500);
    });

    Breakpoints.on('change', () => {
      console.log('changed breakpoints');
      this.setState('menubarType', this._getDefaultMeunbarType());
    });

    // Breakpoints.on('change', () => {
    //   this.menuBar.setState(this._getDefaultMeunbarType());
    // });
  }

  getDefaultActions() {
    return {
      menubarType(type) {
        let toggle = function($el) {
          $el.toggleClass('hided', !(type === 'open'));
          $el.toggleClass('unfolded', !(type === 'fold'));
        };

        $('[data-toggle="menubar"]').each(function() {
          let $this = $(this);
          let $hamburger = $(this).find('.hamburger');

          if ($hamburger.length > 0) {
            toggle($hamburger);
          } else {
            toggle($this);
          }
        });
      }
    };
  }

  getDefaultChildren() {
    let menubar = new RemarkMenuBar({
      $el: $('.site-menubar')
    });
    let children = [menubar];
    return children;
  }
}
