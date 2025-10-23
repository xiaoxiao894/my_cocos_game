System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, MonsterItem, _dec, _class, _crd, ccclass, property, AttackEventManager;

  function _reportPossibleCrUseOfMonsterItem(extras) {
    _reporterNs.report("MonsterItem", "./MonsterItem", _context.meta, extras);
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
      MonsterItem = _unresolved_2.MonsterItem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a1ac4Fq7oNAM5JqyByTZjyP", "AttackEventManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AttackEventManager", AttackEventManager = (_dec = ccclass('AttackEventManager'), _dec(_class = class AttackEventManager extends Component {
        start() {}

        attack() {
          var monsterItem = this.node.parent.parent.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
            error: Error()
          }), MonsterItem) : MonsterItem);

          if (!monsterItem) {
            monsterItem = this.node.parent.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
              error: Error()
            }), MonsterItem) : MonsterItem);
          }

          if (!monsterItem) return;
          monsterItem.attack();
        }

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=24721e6f7e0c6ae0a58967477b3c041ba7887bb1.js.map