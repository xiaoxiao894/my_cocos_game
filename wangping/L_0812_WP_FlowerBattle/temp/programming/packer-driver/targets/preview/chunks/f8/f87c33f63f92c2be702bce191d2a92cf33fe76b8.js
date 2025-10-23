System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, SkeletalAnimation, v3, StateMachine, IdleState, MoveState, _dec, _dec2, _class, _class2, _descriptor, _crd, CharacterType, CharacterStateType, ccclass, property, Entity;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStateMachine(extras) {
    _reporterNs.report("StateMachine", "../core/SateMachine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIdleState(extras) {
    _reporterNs.report("IdleState", "../State/IdleState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveState(extras) {
    _reporterNs.report("MoveState", "../State/MoveState", _context.meta, extras);
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
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      StateMachine = _unresolved_2.default;
    }, function (_unresolved_3) {
      IdleState = _unresolved_3.IdleState;
    }, function (_unresolved_4) {
      MoveState = _unresolved_4.MoveState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d29f2wk9bVATb3G9I9aOTlq", "Entity", undefined);

      __checkObsolete__(['_decorator', 'Component', 'SkeletalAnimation', 'v3', 'Vec3', 'Node']);

      /**
       * 角色类型枚举
       */
      _export("CharacterType", CharacterType = /*#__PURE__*/function (CharacterType) {
        CharacterType["Player"] = "Player";
        CharacterType["StaticPlayer"] = "StaticPlayer";
        CharacterType["AIPlayer"] = "AIPlayer";
        CharacterType["Enemy"] = "Enemy";
        CharacterType["Parter"] = "Parter";
        return CharacterType;
      }({}));
      /**
       *   角色状态机名字
       */


      _export("CharacterStateType", CharacterStateType = /*#__PURE__*/function (CharacterStateType) {
        CharacterStateType["Idle"] = "idle";
        CharacterStateType["Move"] = "move";
        CharacterStateType["MoveAttack"] = "moveAttack";
        CharacterStateType["Attack"] = "attack";
        return CharacterStateType;
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
          this.type = CharacterType.Player;
          this.moveSpeed = 0;
          this.stateMachine = new (_crd && StateMachine === void 0 ? (_reportPossibleCrUseOfStateMachine({
            error: Error()
          }), StateMachine) : StateMachine)();
          this.destForward = v3();
          this.target = null;
          this.moveTargetWorldPos = null;

          //移动到的目标位置
          //不同的怪有不同的动画方式
          _initializerDefineProperty(this, "characterSkeletalAnimation", _descriptor, this);
        }

        onLoad() {
          // 初始化状态机
          this.stateMachine.addState(CharacterStateType.Idle, new (_crd && IdleState === void 0 ? (_reportPossibleCrUseOfIdleState({
            error: Error()
          }), IdleState) : IdleState)(this));
          this.stateMachine.addState(CharacterStateType.Move, new (_crd && MoveState === void 0 ? (_reportPossibleCrUseOfMoveState({
            error: Error()
          }), MoveState) : MoveState)(this)); // 监听事件

          this.setupEventListeners();
        }

        getMachineName() {
          return this.stateMachine.getStateName();
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
          this.hp -= finalDamage;

          if (this.hp <= 0) {
            this.hp = 0;
          } //eventMgr.emit(EventType.ENTITY_TAKE_DAMAGE, this, finalDamage);


          if (this.hp <= 0) {
            this.die(callback);
          } else {// this.stateMachine.setState("hurt");
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

        moveAttack(callback) {
          this.stateMachine.setState("moveAttack", callback);
        }

        idle() {
          this.stateMachine.setState("idle");
        }

        update(dt) {
          this.stateMachine.update(dt);
        }

        useSkill(callback) {
          this.stateMachine.setState("attack", callback);
        } // /** 当前节点是否在城内 */
        // public isInDoor(): boolean {
        //     return this.posIsInDoor(this.node.worldPosition.clone());
        // }
        // /** 坐标是否在栅栏内 */
        // public posIsInDoor(pos:Vec3):boolean{
        //     let palings:Node[]=App.sceneNode.palingLevels;
        //     if(palings[0].active === true){
        //         //1级
        //         return App.palingAttack.inPalingsByLevel(1,pos);
        //     }else if(palings[1].active === true){
        //         //2级
        //         if(!App.palingAttack.inPalingsByLevel(2,pos)){
        //             //3级
        //             if(palings[2].active === true){
        //                 return App.palingAttack.inPalingsByLevel(3,pos);
        //             }else{
        //                 return false;
        //             }
        //         }else{
        //             return true;
        //         }
        //     }
        //     return false;
        // }


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
//# sourceMappingURL=f87c33f63f92c2be702bce191d2a92cf33fe76b8.js.map