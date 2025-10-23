System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, StateMachine, _crd;

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "../states/State", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3dc7eK18glJCI64fUkK1BsJ", "SateMachine", undefined);

      _export("default", StateMachine = class StateMachine {
        constructor() {
          this.currentState = null;
          this.states = {};
        }

        addState(name, state) {
          this.states[name] = state;
        }

        setState(name, callback) {
          if (this.currentState) {
            this.currentState.onExit(callback);
          }

          this.currentState = this.states[name];

          if (this.currentState) {
            this.currentState.onEnter(callback);
          }
        }

        getState() {
          return this.currentState;
        }

        getStateName() {
          for (const name in this.states) {
            if (this.states[name] === this.currentState) {
              return name;
            }
          }

          return null;
        }

        update(dt) {
          if (this.currentState) {
            this.currentState.onUpdate(dt);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=88874b416a19b6f0567a0c1f24af234871a0d36c.js.map