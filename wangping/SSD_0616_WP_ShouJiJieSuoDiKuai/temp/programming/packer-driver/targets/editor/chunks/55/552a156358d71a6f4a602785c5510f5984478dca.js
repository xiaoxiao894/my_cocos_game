System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Component, State, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d5f84a5aXVC4aMuwmWmEqQB", "State", undefined);

      __checkObsolete__(['Component']);

      _export("default", State = class State extends Component {
        constructor(...args) {
          super(...args);
          this.entity = void 0;
        }
        /**进入状态 */

        /**更新逻辑 */

        /**退出状态 */


      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=552a156358d71a6f4a602785c5510f5984478dca.js.map