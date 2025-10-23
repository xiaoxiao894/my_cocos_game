System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Entity, CharacterType, _dec, _class, _crd, ccclass, EnemyTree;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "./Entity", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
      CharacterType = _unresolved_2.CharacterType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8a1c9DsfcNAnazRBI0o6TLw", "EnemyTree", undefined);

      __checkObsolete__(['_decorator', 'Animation']);

      ({
        ccclass
      } = _decorator);

      _export("EnemyTree", EnemyTree = (_dec = ccclass('EnemyTree'), _dec(_class = class EnemyTree extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor(...args) {
          super(...args);
          //是否是可以被寻找的状态
          this.isFind = false;
          this.dropNum = 3;
          this.type = (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).ENEMY_TREE;
          this.hp = 3;
          this.animationNum = null;
          //当前的砍伐次数
          this.curCutNum = 1;
          this.curCollectNum = 0;
        }

        playAnimtion(name) {
          this.node.getComponent(Animation).play(name);
        }

        showArrowTarger() {
          this.node.getChildByName("UI_famuzhiyin").active = true;
        }

        hideArrowTarger() {
          this.node.getChildByName("UI_famuzhiyin").active = false;
        }

        setFindState(isFind) {
          this.isFind = isFind;
        }

        getFindState() {
          return this.isFind;
        }

        die() {
          this.scheduleOnce(() => {
            this.node.active = false;
          }, 1);
        }

        getDropNum() {
          return this.dropNum;
        } // onLoad() {
        // }
        // start() {
        // }


      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9508f726d7561e6eb77514a03ec331ff5ba44137.js.map