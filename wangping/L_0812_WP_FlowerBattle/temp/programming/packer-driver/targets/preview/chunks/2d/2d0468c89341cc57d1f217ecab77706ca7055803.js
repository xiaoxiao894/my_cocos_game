System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, State, CharacterType, MoveBase, SoundManager, _dec, _class, _crd, ccclass, property, MoveState;

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../Entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveBase(extras) {
    _reporterNs.report("MoveBase", "./MoveBase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
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
    }, function (_unresolved_4) {
      MoveBase = _unresolved_4.MoveBase;
    }, function (_unresolved_5) {
      SoundManager = _unresolved_5.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ee803rH8nND2alI3Be201Yr", "MoveState", undefined);

      __checkObsolete__(['_decorator']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MoveState", MoveState = (_dec = ccclass('MoveState'), _dec(_class = class MoveState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor() {
          super(...arguments);
          this.moveBase = null;
        }

        onEnter(callback) {
          console.log("进入移动状态");

          if (this.entity.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).Player) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
              console.error("骨骼动画组件未初始化");
              return;
            }

            this.moveBase = new (_crd && MoveBase === void 0 ? (_reportPossibleCrUseOfMoveBase({
              error: Error()
            }), MoveBase) : MoveBase)(); // this.entity.characterSkeletalAnimation.play("Run_Anna_kt")

            this.entity.characterSkeletalAnimation.crossFade("Run_Anna_kt", 0.1);
          }

          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playRunBGM();
        }

        onUpdate(dt) {
          this.moveBase.handleInput(dt, this.entity);
        }

        onExit(callback) {
          console.log("退出移动状态");
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.stopRunBGM();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2d0468c89341cc57d1f217ecab77706ca7055803.js.map