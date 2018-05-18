import * as $ from 'jquery';
import {RemarkState} from './remark-state';

if (typeof Object.assign === 'undefined') {
  Object.assign = $.extend;
}
class RemarkComponent {
  public $el: any;
  public children: any;
  public el: any;
  public actions: any;
  public initialState: any;
  public _willProcess: any;
  public _processed: any;
  public willProcess: any;
  public state: any;
  public isProcessed: any;
  public isInit: any;
  constructor(options: any = {
    doLater: false
  }) {
    if (!options['dontdohere']) {
      this.$el = options.$el ? options.$el : $(document);
      this.el = this.$el[0];
      delete options.$el;

      this.children = this.getDefaultChildren();
      this.actions = this.getDefaultActions();
      this.initialState = this.getDefaultState();

      this._willProcess = $.Callbacks();
      this._processed = $.Callbacks();

      if (this.willProcess) {
        this._willProcess.add(this.willProcess);
      }
      if ((<any>this).processed) {
        this._processed.add((<any>this).processed);
      }

      this.isProcessed = false;

      this.mix(options);

      this.state = null;
    }
  }

  _doLater(options: any = {}) {
    this.$el = options.$el ? options.$el : $(document);
    this.el = this.$el[0];
    delete options.$el;

    this.children = this.getDefaultChildren();
    this.actions = this.getDefaultActions();
    this.initialState = this.getDefaultState();

    this._willProcess = $.Callbacks();
    this._processed = $.Callbacks();

    if (this.willProcess) {
      this._willProcess.add(this.willProcess);
    }
    if ((<any>this).processed) {
      this._processed.add((<any>this).processed);
    }

    this.isProcessed = false;

    this.mix(options);

    this.state = null;
  }

  _combineInitialState() {
    let childrenInitialState = {};
    for (let i = 0, l = this.children.length; i < l; i++) {
      let child = this.children[i];

      Object.assign(childrenInitialState, child.initialState);
    }
    return Object.assign(childrenInitialState, this.initialState);
  }

  _process(state) {
    this._willProcess.fireWith(this);

    this.state = state ? state : new RemarkState(this.initialState);

    this._registerActions();

    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i]._process(this.state);
      this.children[i].isProcessed = true;
    }

    this._processed.fireWith(this);
  }

  _registerActions() {
    let actions = this.actions;
    for (let state in actions) {
      if (actions.hasOwnProperty(state)) {
        let action = actions[state];
        if (typeof action === 'function') {
          this.state.on(state, (...params) => {
            actions[state].apply(this, ...params);
          });
        } else if (typeof action === 'string' && typeof this[action] === 'function') {
          this.state.on(state, (...params) => {
            this[action].apply(this, ...params);
          });
        }
      }
    }
  }

  run(...state) {
    if (!this.isProcessed) {
      this._process(null);
      this.isProcessed = true;
    }

    this.setState(...state);
  }

  setState(...state) {
    if (this.state) {
      this.state.set(...state);
    }
  }

  getState(...state) {
    if (this.state) {
      return this.state.get(...state);
    } else {
      return null;
    }
  }

  getDefaultState() {
    return {};
  }

  getDefaultChildren() {
    return [];
  }

  getDefaultActions() {
    return {};
  }

  mix(options: any = {}) {
    if (this.isInit) {
      return;
    }

    let {
      children = [], actions = {}, state = {}, willProcess = false, processed = false
    }: any = options;

    children = children.filter((child) => {
      return child instanceof RemarkComponent;
    });
    this.children = [...this.children, ...children];

    this.actions = Object.assign({}, this.actions, actions);

    this.initialState = Object.assign({}, this.initialState, state);
    this.initialState = this._combineInitialState();

    if (typeof willProcess !== 'function') {
      this._willProcess.add(willProcess);
    }
    if (typeof processed !== 'function') {
      this._processed.add(processed);
    }

    delete options.children;
    delete options.actions;
    delete options.state;
    delete options.willProcess;
    delete options.processed;

    Object.assign(this, options);
    return this;
  }

  triggerResize() {
    if (document.createEvent) {
      let ev = document.createEvent('Event');
      ev.initEvent('resize', true, true);
      window.dispatchEvent(ev);
    } else {
      let element: any = document.documentElement;
      let event = (<any>document).createEventObject();
      element.fireEvent('onresize', event);
    }
  }
}

export {RemarkComponent}
