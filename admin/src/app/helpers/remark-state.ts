declare var $: any;

export class RemarkState {

  _states: any;
  _values: object;
  _relations: object;
  _callbacks: object;

  constructor(states) {
    this._states = Object.assign({}, states);
    this._values = {};
    this._relations = {};
    this._callbacks = {};
    this._define();
  }

  _define() {
    const self: RemarkState = this;
    const keys = Object.keys(this._states);
    const obj: object = {};
    let tmpRelations = [];
    const composites: Array<any> = [];
    let index: number;
    const keysLength  = keys.length;
    for (index = 0; index < keysLength; index++) {
      const key = keys[index],
        value = this._states[key];
      if (typeof value !== 'function') {
        Object.defineProperty(obj, key, {
          set() {
            return false;
          },
          get() {
            tmpRelations.push(key);
            return self._states[key];
          },
          enumerable: true,
          configurable: true
        });
        this._values[key] = this._states[key];
        this._relations[key] = [];
      } else {
        composites.push(key);
      }
    }

    const compositesLength = composites.length;
    let i = 0;
    for (i = 0; i < compositesLength; i++) {
      const key = composites[i];
      Object.defineProperty(obj, key, {
        set() {
          return false;
        },
        get() {
          const value = self._states[key].call(obj);
          self._addRelation(key, tmpRelations);
          tmpRelations = [];
          self._values[key] = value;
          return value;
        },
        enumerable: true,
        configurable: true
      });

      // use get function to create the relationship
      obj[key].get();

    }
  }

  _compare(state) {
    if (this._states[state] !== this._values[state]) {
      const value = this._values[state];
      this._values[state] = this._states[state];
      this._dispatch(state, value, this._states[state]);
      this._compareComposite(state);
    }
  }

  _compareComposite(state) {
    const relations = this.getRelation(state);

    if (relations && relations.length > 0) {
      const relationLength = relations.length;
      let index = 0;
      for (index = 0; index < relationLength; index++) {
        const stateVariable = relations[index];
        const value: any = this._states[stateVariable]();

        if (value !== this._values[stateVariable]) {
          this._dispatch(stateVariable, this._values[stateVariable], value);
          this._values[stateVariable] = value;
        }
      }
    }
  }

  _addRelation(state, relations) {
    const relationsLength = relations.length;
    for (let i = 0; i < relationsLength; i++) {
      const pros = relations[i];
      this._relations[pros].push(state);
    }
  }

  _dispatch(state, origValue, newValue) {
    if (this._callbacks[state]) {
      this._callbacks[state].fire([newValue, origValue]);
    }
  }

  getRelation(state) {
    return this._relations[state].length > 0 ? this._relations[state] : null;
  }

  on(state, callback) {
    if (typeof state === 'function') {
      callback = state;
      state = 'all';
    }

    if (!this._callbacks[state]) {
      this._callbacks[state] = $.Callbacks();
    }
    this._callbacks[state].add(callback);
  }

  off(state, callback) {
    if (this._callbacks[state]) {
      this._callbacks[state].remove(callback);
    }
  }

  set(state: any, value: any, isDeep: boolean = false) {
    if (typeof state === 'string' && typeof value !== 'undefined' && typeof this._states[state] !== 'function') {
      this._states[state] = value;
      if (!isDeep) {
        this._compare(state);
      }
    } else if (typeof state === 'object') {
      for (const key in state) {
        if (typeof state[key] !== 'function') {
          this.set(key, state[key], true);
        }
      }
      for (const key in state) {
        if (typeof state[key] !== 'function') {
          this._compare(key);
        }
      }
    }

    return this._states[state];
  }

  get(state: any) {
    if (state) {
      return this._values[state];
    } else {
      return this._values;
    }
  }
}
