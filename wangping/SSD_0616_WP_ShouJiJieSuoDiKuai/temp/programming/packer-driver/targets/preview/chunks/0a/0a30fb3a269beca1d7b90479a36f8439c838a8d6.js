System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, SkeletalAnimation, StateMachine, AttackState, DieState, HurtState, IdleState, MoveState, CutTreeState, HandOver, CutCornState, CornHandOver, _dec, _dec2, _class, _class2, _descriptor, _crd, CharacterType, ccclass, property, Entity;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStateMachine(extras) {
    _reporterNs.report("StateMachine", "../core/SateMachine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackState(extras) {
    _reporterNs.report("AttackState", "../states/AttackState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDieState(extras) {
    _reporterNs.report("DieState", "../states/DieState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHurtState(extras) {
    _reporterNs.report("HurtState", "../states/HurtState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIdleState(extras) {
    _reporterNs.report("IdleState", "../states/IdleState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveState(extras) {
    _reporterNs.report("MoveState", "../states/MoveState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCutTreeState(extras) {
    _reporterNs.report("CutTreeState", "../states/CutTreeState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHandOver(extras) {
    _reporterNs.report("HandOver", "../states/HandOver", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCutCornState(extras) {
    _reporterNs.report("CutCornState", "../states/CutCornState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCornHandOver(extras) {
    _reporterNs.report("CornHandOver", "../states/CornHandOver", _context.meta, extras);
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
      SkeletalAnimation = _cc.SkeletalAnimation;
    }, function (_unresolved_2) {
      StateMachine = _unresolved_2.default;
    }, function (_unresolved_3) {
      AttackState = _unresolved_3.default;
    }, function (_unresolved_4) {
      DieState = _unresolved_4.default;
    }, function (_unresolved_5) {
      HurtState = _unresolved_5.default;
    }, function (_unresolved_6) {
      IdleState = _unresolved_6.default;
    }, function (_unresolved_7) {
      MoveState = _unresolved_7.MoveState;
    }, function (_unresolved_8) {
      CutTreeState = _unresolved_8.CutTreeState;
    }, function (_unresolved_9) {
      HandOver = _unresolved_9.HandOver;
    }, function (_unresolved_10) {
      CutCornState = _unresolved_10.CutCornState;
    }, function (_unresolved_11) {
      CornHandOver = _unresolved_11.CornHandOver;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0f493LyxX9NEKaiBUSjWgCT", "Entity", undefined);

      __checkObsolete__(['_decorator', 'Component', 'SkeletalAnimation', 'Vec3']);

      /**
       * 角色类型枚举
       */
      _export("CharacterType", CharacterType = /*#__PURE__*/function (CharacterType) {
        CharacterType["CHARACTER"] = "character";
        CharacterType["ENEMY_TREE"] = "enemyTree";
        CharacterType["ENEMY"] = "enemy";
        CharacterType["ENEMY_ELITE"] = "enemy1";
        return CharacterType;
      }({}));

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", Entity = (_dec = ccclass('Entity'), _dec2 = property(SkeletalAnimation), _dec(_class = (_class2 = class Entity extends Component {
        constructor() {
          super(...arguments);
          this.id = void 0;
          this.entityName = void 0;
          this.hp = 0;
          this.maxHp = 0;
          this.attack = 0;
          this.defense = 0;
          this.type = CharacterType.CHARACTER;
          // character  enemeyTree  enmey enemy1
          this.moveSpeed = 0;
          this.stateMachine = new (_crd && StateMachine === void 0 ? (_reportPossibleCrUseOfStateMachine({
            error: Error()
          }), StateMachine) : StateMachine)();
          this.target = null;
          this.moveTargetWorldPos = null;
          //移动到的目标位置
          this.moveCallBack = null;

          //不同的怪有不同的动画方式
          _initializerDefineProperty(this, "characterSkeletalAnimation", _descriptor, this);
        }

        onLoad() {
          // 初始化状态机
          this.stateMachine.addState("idle", new (_crd && IdleState === void 0 ? (_reportPossibleCrUseOfIdleState({
            error: Error()
          }), IdleState) : IdleState)(this));
          this.stateMachine.addState("attack", new (_crd && AttackState === void 0 ? (_reportPossibleCrUseOfAttackState({
            error: Error()
          }), AttackState) : AttackState)(this));
          this.stateMachine.addState("hurt", new (_crd && HurtState === void 0 ? (_reportPossibleCrUseOfHurtState({
            error: Error()
          }), HurtState) : HurtState)(this));
          this.stateMachine.addState("die", new (_crd && DieState === void 0 ? (_reportPossibleCrUseOfDieState({
            error: Error()
          }), DieState) : DieState)(this));
          this.stateMachine.addState("move", new (_crd && MoveState === void 0 ? (_reportPossibleCrUseOfMoveState({
            error: Error()
          }), MoveState) : MoveState)(this));
          this.stateMachine.addState("cutTree", new (_crd && CutTreeState === void 0 ? (_reportPossibleCrUseOfCutTreeState({
            error: Error()
          }), CutTreeState) : CutTreeState)(this));
          this.stateMachine.addState("handOver", new (_crd && HandOver === void 0 ? (_reportPossibleCrUseOfHandOver({
            error: Error()
          }), HandOver) : HandOver)(this));
          this.stateMachine.addState("cutCorn", new (_crd && CutCornState === void 0 ? (_reportPossibleCrUseOfCutCornState({
            error: Error()
          }), CutCornState) : CutCornState)(this));
          this.stateMachine.addState("cornHandOver", new (_crd && CornHandOver === void 0 ? (_reportPossibleCrUseOfCornHandOver({
            error: Error()
          }), CornHandOver) : CornHandOver)(this)); // 监听事件

          this.setupEventListeners();
        }

        getMachineName() {
          return this.stateMachine.getStateName();
        }

        start() {//this.idle(this);
        } //设置移动速度


        setMoveSpeed(speed) {
          this.moveSpeed = speed;
        } //获取移动速度


        getMoveSpeed() {
          return this.moveSpeed;
        } //没有配置表手动默认


        setData(id, name, hp, attack, type) {
          this.id = id;
          this.entityName = name;
          this.hp = hp;
          this.maxHp = hp;
          this.attack = attack;
          this.type = type;
        } //获取ID


        getId() {
          return this.id;
        }

        getEntityName() {
          return this.entityName;
        }
        /**获取类型 */


        getType() {
          return this.type;
        }

        entitySetPosition(pos) {
          this.node.setPosition(pos);
        }

        entityGetPosition() {
          return this.node.position;
        }

        setupEventListeners() {}

        takeDamage(damage, callback) {
          var finalDamage = Math.max(damage - this.defense, 0);
          console.log("damage damage " + damage);
          console.log("this.defense this.defense " + this.defense);
          this.hp -= finalDamage; //eventMgr.emit(EventType.ENTITY_TAKE_DAMAGE, this, finalDamage);

          if (this.hp <= 0) {
            this.die(callback);
          } else {
            this.stateMachine.setState("hurt");
          }

          if (callback) {
            callback(this.hp <= 0);
          }
        }

        heal(amount) {
          this.hp = Math.min(this.hp + amount, this.maxHp);
        }

        die(callback) {
          this.stateMachine.setState("die", callback);
        }

        move(callback) {
          this.stateMachine.setState("move", callback);
        }

        idle() {
          this.stateMachine.setState("idle");
        }

        update(dt) {
          this.stateMachine.update(dt);
        }

        useSkill(callback) {
          this.stateMachine.setState("attack", callback);
        }

        cutTree(callback) {
          this.stateMachine.setState("cutTree", callback);
        }

        handOver(callback) {
          this.stateMachine.setState("handOver", callback);
        }

        cornHandOver(callback) {
          this.stateMachine.setState("cornHandOver", callback);
        }

        cutCorn(callback) {
          this.stateMachine.setState("cutCorn", callback);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "characterSkeletalAnimation", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0a30fb3a269beca1d7b90479a36f8439c838a8d6.js.map