System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, State, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../Entitys/Entity", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9df27FLP7BJQ4voSxx+U5zk", "State", undefined);

      __checkObsolete__(['Component']);

      _export("default", State = class State {
        constructor(entity) {
          this.entity = void 0;
          this.entity = entity;
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
//# sourceMappingURL=ab1f420a32e25053a74cb2047c73d5a577238026.js.map