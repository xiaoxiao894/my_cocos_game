System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, PlayerManager, _dec, _class, _crd, ccclass, property, JackManager;

  function _reportPossibleCrUseOfPlayerManager(extras) {
    _reporterNs.report("PlayerManager", "./PlayerManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      PlayerManager = _unresolved_2.PlayerManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c9215J3bElBx7/sbasYJlFA", "JackManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("JackManager", JackManager = (_dec = ccclass('JackManager'), _dec(_class = class JackManager extends Component {
        fireAtTarget(name) {
          if (!this.node.parent || !this.node.parent.parent) return;
          const playerManager = this.node.parent.parent.getComponent(_crd && PlayerManager === void 0 ? (_reportPossibleCrUseOfPlayerManager({
            error: Error()
          }), PlayerManager) : PlayerManager);

          if (name == "walk") {
            playerManager.walkingAttackEffects();
          } else {
            playerManager.pauseAttackEffect();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b4c2e23b044d1f3dea93b4c88aafaaadc29a9490.js.map