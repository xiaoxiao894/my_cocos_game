System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, State, CharacterType, _dec, _class, _crd, ccclass, property, IdleState;

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../Entitys/Entity", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      State = _unresolved_2.default;
    }, function (_unresolved_3) {
      CharacterType = _unresolved_3.CharacterType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fedf5W59ONAjJXHed8c8UDR", "IdleState", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("IdleState", IdleState = (_dec = ccclass('IdleState'), _dec(_class = class IdleState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        onEnter(callback) {
          console.log("进入待机状态");

          if (this.entity.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).Player) {
            this.entity.characterSkeletalAnimation.stop(); // 检查骨骼动画组件是否存在

            if (!this.entity.characterSkeletalAnimation) {
              console.error("骨骼动画组件未初始化");
              return;
            }

            this.entity.characterSkeletalAnimation.crossFade("Idle_Anna_kt", 0.3);
          }
        }

        onUpdate(dt) {//  throw new Error('Method not implemented.');
        }

        onExit(callback) {
          console.log("退出待机状态");
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1622afc0bbcf7f7577e815ff6e9321c7d2e992be.js.map