System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SkeletalAnimation, Vec3, Animation, Collider, eventMgr, EventType, TopShakeEffect, DissolveEffect, DataManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, EnemyBase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTopShakeEffect(extras) {
    _reporterNs.report("TopShakeEffect", "./TopShakeEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDissolveEffect(extras) {
    _reporterNs.report("DissolveEffect", "db://assets/Res/DissolveEffect/scripts/DissolveEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../../Global/DataManager", _context.meta, extras);
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
      Node = _cc.Node;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
      Collider = _cc.Collider;
    }, function (_unresolved_2) {
      eventMgr = _unresolved_2.eventMgr;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      TopShakeEffect = _unresolved_4.TopShakeEffect;
    }, function (_unresolved_5) {
      DissolveEffect = _unresolved_5.DissolveEffect;
    }, function (_unresolved_6) {
      DataManager = _unresolved_6.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "87e6dwcxshDtJ/j1UDpieE5", "EnemyBase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SkeletalAnimation', 'Vec3', 'Animation', 'AnimationState', 'Collider', 'BoxCollider', 'ITriggerEvent']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EnemyBase", EnemyBase = (_dec = ccclass('EnemyBase'), _dec2 = property(SkeletalAnimation), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class EnemyBase extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeletalAnim", _descriptor, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor2, this);

          // 移动速度
          _initializerDefineProperty(this, "health", _descriptor3, this);

          // 生命值
          _initializerDefineProperty(this, "electricParticle", _descriptor4, this);

          this.isAlive = true;
          this.moveCollider = false;
          this.attackEnder = false;
          this.isParticle = true;
          this.targetPosition = null;
          // 移动目标位置
          this.initPos = null;
          //目标初始位置
          this.enmeyDie = false;
          //通电后怪物攻击一次后 几秒死亡 
          this.enemyTimeDie = 2;
          this.collidPaling = void 0;
          this.attackEffect = false;

          _initializerDefineProperty(this, "dissovleNode", _descriptor5, this);
        }

        setDie() {
          this.enmeyDie = true;
          this.attackEffect = true;
        }

        start() {
          this.init();
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).once((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeast_start, this.beastStartCallBack, this); //  this.onInitEvent();
        }

        beastStartCallBack() {
          this.scheduleOnce(() => {
            this.attackEffect = true;
          }, 1);
        }

        init() {
          // 初始化骨骼动画
          if (!this.skeletalAnim) {
            this.skeletalAnim = this.node.getComponent(SkeletalAnimation);
          } // if (this.skeletalAnim) {
          //     this.playAnimation('walk', true); // 默认播放待机动画
          // }


          this.setupCollisionCallbacks();
          this.movePost();
        }

        attackEvent() {
          this.collidPaling.getComponent(_crd && TopShakeEffect === void 0 ? (_reportPossibleCrUseOfTopShakeEffect({
            error: Error()
          }), TopShakeEffect) : TopShakeEffect).shake(2);
        }

        setupCollisionCallbacks() {
          const collider = this.node.getComponent(Collider);

          if (!collider) {
            console.warn('没有找到碰撞矩阵');
            return;
          }

          if (!collider) return;
          collider.isTrigger = true; // 
          // 注册触发器回调

          collider.on('onTriggerEnter', this.onTriggerEnter, this);
          collider.on('onTriggerStay', this.onTriggerStay, this); // collider.on('onTriggerExit', this.onTriggerExit, this);
        }

        onTriggerEnter(other, self) {
          console.log("onTriggerEnter");
        }

        onTriggerStay(event) {
          // console.log("onTriggerStay")
          const otherCollider = event.otherCollider; //console.log(otherCollider)

          this.moveCollider = false;

          if (!this.attackEnder) {
            this.attack(otherCollider.node);
            this.collidPaling = otherCollider.node;
            this.attackEnder = true;
          }
        }

        onTriggerExit(other, self) {
          console.log("onTriggerExit");
        } // 通用移动方法


        moveTo(position) {
          if (!this.isAlive) return;
          this.targetPosition = position.clone();
          this.playAnimation('walk', true);
        } // 通用移动方法


        movePost() {
          if (!this.isAlive) return;
          this.moveCollider = true;
          this.playAnimation('walk', true);
        }

        update(deltaTime) {
          if (!this.isAlive || !this.moveCollider) return;
          let posz = this.node.position.z - deltaTime * 2;
          this.node.setPosition(new Vec3(this.node.position.x, this.node.position.y, posz)); // // 计算移动方向
          // const currentPos = this.node.worldPosition;
          // const direction = new Vec3();
          // Vec3.subtract(direction, this.targetPosition, currentPos);
          // // 判断是否到达目标
          // if (direction.lengthSqr() < 0.1) {
          //     this.targetPosition = null;
          //     this.playAnimation('Idle', true);
          //     return;
          // }
          // // 标准化方向向量并移动
          // direction.normalize();
          // direction.multiplyScalar(this.moveSpeed * deltaTime);
          // Vec3.add(currentPos, currentPos, direction);
          // this.node.worldPosition = currentPos;
          // // 面向移动方向
          // this.faceDirection(direction);
        } // // 转向移动方向
        // protected faceDirection(direction: Vec3) {
        //     direction.y = 0; // 保持水平旋转
        //     if (direction.lengthSqr() > 0) {
        //         this.node.lookAt(Vec3.add(new Vec3(), this.node.worldPosition, direction));
        //     }
        // }
        // 通用受伤方法


        takeDamage(damage) {
          if (!this.isAlive) return;
          this.health -= damage;

          if (this.health <= 0) {
            this.die();
          }
        } // 死亡处理


        die() {
          this.electricParticle.active = false;
          if (!this.isAlive) return;
          this.isAlive = false;

          if (this.node.name == "ElephantPrefab" || this.node.name == "ElephantPrefab-001") {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playElephantSound();
          } else if (this.node.name == "DogPrefab" || this.node.name == "DogPrefab-001") {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playDogSound();
          } else if (this.node.name == "BearPrefab" || this.node.name == "BearPrefab-001") {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playBearSound();
          }

          this.scheduleOnce(() => {
            if (this.dissovleNode.getComponent(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
              error: Error()
            }), DissolveEffect) : DissolveEffect)) this.dissovleNode.getComponent(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
              error: Error()
            }), DissolveEffect) : DissolveEffect).play(0.8);
          }, 0.5);
          this.playAnimation('die', false, () => {
            if (this.dissovleNode) {
              let dis = this.dissovleNode;
              this.scheduleOnce(() => {
                this.electricParticle.active = true;
                this.node.removeFromParent();
                this.node.destroy(); // 动画结束后销毁
              }, 1);
            } else {
              // if (this.node.name == "ElephantPrefab" || this.node.name == "ElephantPrefab-001") {
              //     DataManager.Instance.soundManager.playElephantSound()
              // } else if (this.node.name == "DogPrefab" || this.node.name == "DogPrefab-001") {
              //     DataManager.Instance.soundManager.playDogSound()
              // } else if (this.node.name == "BearPrefab" || this.node.name == "BearPrefab-001") {
              //     DataManager.Instance.soundManager.playBearSound()
              // }
              this.scheduleOnce(() => {
                this.isParticle = true;
                this.node.removeFromParent();
                this.node.destroy(); // 动画结束后销毁
              }, 1);
            }
          });
        } // 骨骼动画控制方法


        playAnimation(name, loop = false, onFinished) {
          if (!this.skeletalAnim) return; // 停止当前动画

          this.skeletalAnim.stop(); // 播放新动画

          const state = this.skeletalAnim.getState(name);

          if (state) {
            //console.log(`state===== ${state}`)
            //state.wrapMode = loop ? AnimationState.WrapMode.Loop : AnimationState.WrapMode.Normal;
            state.speed = 1.0;
            this.skeletalAnim.play(name); // 设置单次动画结束回调

            if (!loop && onFinished) {
              this.skeletalAnim.once(Animation.EventType.FINISHED, onFinished);
            }
          } else {
            console.warn(`Animation clip ${name} not found!`);
          }
        } // 攻击方法 (需子类实现具体逻辑)


        attack(target) {
          var _this$electricParticl;

          if (!this.isAlive) return; // this.scheduleOnce(() => {
          //     target.getComponent(TopShakeEffect).shake(2);
          // }, 0.5);

          if (((_this$electricParticl = this.electricParticle) == null ? void 0 : _this$electricParticl.active) == false) {
            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isMapBesastSatr) this.electricParticle.active = true;
          }

          this.playAnimation('attack', false, () => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playAttackPalingSound();

            if (this.attackEffect) {
              if (this.electricParticle) {// if (this.isParticle) {
                //   this.isParticle = false;
                //if (this.electricParticle.active == false) {
                //this.electricParticle.active = true;
                //  }
                //  }
              }
            }

            if (target) this.scheduleOnce(() => {
              this.attackEnder = false;
            }, 0.2);

            if (this.enmeyDie) {
              this.scheduleOnce(() => {
                this.die();
              }, this.enemyTimeDie);
            } // this.playAnimation('Idle', true);
            // 子类可在此添加攻击逻辑

          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnim", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "electricParticle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "dissovleNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e964264aa62926b7c5fdd59fbc2a3daad165a3ba.js.map