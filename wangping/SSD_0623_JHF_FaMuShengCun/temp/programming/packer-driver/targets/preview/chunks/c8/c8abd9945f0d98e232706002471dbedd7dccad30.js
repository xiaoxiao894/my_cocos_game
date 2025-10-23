System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, PartnerManager, _dec, _class, _crd, ccclass, property, PartnerJackMananger;

  function _reportPossibleCrUseOfPartnerManager(extras) {
    _reporterNs.report("PartnerManager", "./PartnerManager", _context.meta, extras);
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
      PartnerManager = _unresolved_2.PartnerManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d4923zmH7NKUa2BXFbKp22d", "PartnerJackMananger", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PartnerJackMananger", PartnerJackMananger = (_dec = ccclass('PartnerJackMananger'), _dec(_class = class PartnerJackMananger extends Component {
        start() {}

        fireAtTarget(name) {
          var playerManager = this.node.parent.getComponent(_crd && PartnerManager === void 0 ? (_reportPossibleCrUseOfPartnerManager({
            error: Error()
          }), PartnerManager) : PartnerManager);

          if (name == "walk") {
            playerManager.walkingAttackEffects();
          } else {
            playerManager.pauseAttackEffect();
          }
        }

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c8abd9945f0d98e232706002471dbedd7dccad30.js.map