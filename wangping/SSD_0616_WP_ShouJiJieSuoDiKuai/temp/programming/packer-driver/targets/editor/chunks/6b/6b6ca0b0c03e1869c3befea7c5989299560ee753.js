System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, CharacterType, State, IdleState, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      CharacterType = _unresolved_2.CharacterType;
    }, function (_unresolved_3) {
      State = _unresolved_3.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f2ed0n2Y1VHd6/2N//pexWn", "IdleState", undefined);

      _export("default", IdleState = class IdleState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor(entity) {
          super();
          this.entity = entity;
        }

        onEnter() {
          if (this.entity.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
              console.error("骨骼动画组件未初始化");
              return;
            }

            this.entity.characterSkeletalAnimation.play("kugongnanidel");
          }
        }

        onUpdate(dt) {// 空闲状态的逻辑
        }

        onExit() {
          console.log("退出空闲状态");
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6b6ca0b0c03e1869c3befea7c5989299560ee753.js.map