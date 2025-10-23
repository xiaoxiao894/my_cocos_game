System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Quat, Vec3, Animation, tween, Material, MeshRenderer, Entity, CharacterType, goodsDrop, DissolveEffect, Global, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, enemyCharacter;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacter(extras) {
    _reporterNs.report("Character", "./Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgoodsDrop(extras) {
    _reporterNs.report("goodsDrop", "../goodsDrop", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDissolveEffect(extras) {
    _reporterNs.report("DissolveEffect", "../../Res/TX/DissolveEffect/scripts/DissolveEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
      tween = _cc.tween;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
      CharacterType = _unresolved_2.CharacterType;
    }, function (_unresolved_3) {
      goodsDrop = _unresolved_3.goodsDrop;
    }, function (_unresolved_4) {
      DissolveEffect = _unresolved_4.DissolveEffect;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2655bVKX3JNDop01KCSWu4X", "enemyCharacter", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Quat', 'Vec3', 'Animation', 'v3', 'tween', 'find', 'Material', 'MeshRenderer']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("enemyCharacter", enemyCharacter = (_dec = ccclass('enemyCharacter'), _dec2 = property(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
        error: Error()
      }), DissolveEffect) : DissolveEffect), _dec3 = property(Vec3), _dec4 = property(Number), _dec5 = property(Material), _dec6 = property(Material), _dec(_class = (_class2 = class enemyCharacter extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor() {
          super(...arguments);
          this.type = (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).ENEMY;
          this.hp = 4;
          this.isFindCharacter = false;
          this.attackNum = 10000;

          _initializerDefineProperty(this, "dissolve", _descriptor, this);

          this.isFindWay = true;

          _initializerDefineProperty(this, "findWay", _descriptor2, this);

          _initializerDefineProperty(this, "speedTime", _descriptor3, this);

          this._bloodOffset = new Vec3(0, 4.5, 0);
          // 当前路径点索引
          this.currentWaypointIndex = 0;
          // 是否在移动到路径点的过程中
          this.isMovingToWaypoint = false;
          this.speed = 7;
          this.targetPos = new Vec3();
          // private isUpate: boolean = false;
          this.stopDistance = 2;
          // 默认值调整为更合理的值
          this.callback = null;
          // 临时变量，减少GC压力
          this.tempDir = new Vec3();
          this.tempMoveVec = new Vec3();
          this.tempNextPos = new Vec3();
          this.tempForward = new Vec3();
          this.tempRotation = new Quat();
          this.tempParentRotation = new Quat();
          this.tempParentRotationInv = new Quat();
          this.shoudleAnimation = void 0;

          _initializerDefineProperty(this, "baseMaterial", _descriptor4, this);

          _initializerDefineProperty(this, "redMaterial", _descriptor5, this);

          this.isDie = false;
          this.num = 0;
          this.isdie = false;
          // 在类中添加一个标志位，确保只执行一次
          this.hasInitGoods = false;
        }

        onLoad() {// 初始化状态机
          //this.stateMachine.addState("enemyMove", new IdleState(this));
        }

        start() {
          this.init();
        }

        update(deltaTime) {
          this.onUpdate(deltaTime);
        }

        init() {
          // this.isUpate = true;
          if (!this.characterSkeletalAnimation) {
            console.error("骨骼动画组件未初始化");
            return;
          } else {// this.characterSkeletalAnimation.play("run");
          }

          this.stopDistance = 2; // this.speed = this.getMoveSpeed();

          this.toMove();
        }

        attackEventCallBack() {
          if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isAttackWarn) {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).warnUI.playWarnFadeAnimation();
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).isAttackWarn = true;
          }

          console.log("攻击帧事件回调");
          var ani = this.target.node.getChildByName("TX_sangshigongji");
          ani.active = true;
          ani.getComponent(Animation).play();
        }

        attacHitkEventCallBack() {
          var skeletalAnim = this.target.characterSkeletalAnimation;

          if (!this.target.isAttack) {
            skeletalAnim.stop();
            skeletalAnim.play("shouji");
          }

          this.target.shakeRed();
          skeletalAnim.once(Animation.EventType.FINISHED, () => {
            skeletalAnim.play("kugongnanidel");
          }, this);
        }

        hit() {
          if (this.hp <= 0) {
            return;
          }

          var houseMaterial = this.node.getChildByName("sangshi").getChildByName("fbx_zombie_runnerL").getComponent(MeshRenderer);
          tween(houseMaterial.node) // 定义要重复的动作序列：切换材质→等待→切回材质→等待
          .sequence( // 切换到目标材质
          tween().call(() => {
            this.num++;

            if (this.num >= 3) {
              //this.characterSkeletalAnimation.stop();
              this.die();
            }

            console.log("切换到目标材质");
            houseMaterial.material = this.redMaterial;
          }), // 等待 0.2 秒
          tween().delay(0.2), // 切回原材质
          tween().call(() => {
            houseMaterial.material = this.baseMaterial;
          }), // 等待 0.2 秒（与切换时间对称）
          tween().delay(0.2)) // 重复整个序列 3 次
          .repeat(1) // 启动 tween
          .start();
        }

        toMove() {
          this.scheduleOnce(() => {
            this.characterSkeletalAnimation.play("run");
          }, 0.3);

          if (this.findWay && this.findWay.length > 0) {
            var tweenObj = tween(this.node).to(this.speedTime, {
              position: this.findWay[0]
            }); // 循环处理剩余路径点

            for (var i = 1; i < this.findWay.length; i++) {
              tweenObj.to(this.speedTime, {
                position: this.findWay[i]
              });
            }

            tweenObj.call(() => {
              this.isFindWay = false;
            }).start();
          }
        }

        die() {
          if (this.isDie == false) {
            this.isDie = true;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).soundManager.playEnemySound();

            if (this.shoudleAnimation) {
              this.unschedule(this.shoudleAnimation);
              this.shoudleAnimation = null;
            }

            this.attackNum = -1; // this.node.getChildByName("sangshi").getChildByName("fbx_zombie_runnerL")

            this.characterSkeletalAnimation.play("death");
            this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
              if (this.dissolve) {
                this.dissolve.play(0.8);
              }

              this.scheduleOnce(() => {
                this.node.active = false;
                this.node.destroy();
              }, 0.8);
            });
          }
        }
        /**移动逻辑处理 */


        onUpdate(dt) {
          if (!this.isFindCharacter) return;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playEnemySound();

          if (this.isFindWay) {} else {
            // 更新目标位置
            this.moveTargetWorldPos = this.target.node.worldPosition.clone();
            Vec3.copy(this.targetPos, this.moveTargetWorldPos); // 移动到目标

            if (this.moveToTarget(dt, this.targetPos)) {
              this.isFindCharacter = false;
            }
          }
        }

        attackCharactr() {
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playEnemySound();

          if (this.num < 3) {
            if (this.attackNum > 0) {
              this.characterSkeletalAnimation.play("attack");
              this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
                // 2. 先判断组件是否存在，避免空指针
                var skeletalAnim = this.target.characterSkeletalAnimation;

                if (!skeletalAnim) {
                  console.error("骨骼动画组件不存在！");
                  return;
                }

                if (this.hp <= 0) {
                  return;
                } // 3. 停止当前动画
                // skeletalAnim.stop();
                // skeletalAnim.play("shouji");
                // skeletalAnim.once(Animation.EventType.FINISHED, () => {
                //     //(this.target as Character)
                //     //(this.target as Character).idle();
                // }, this);


                this.attackNum--;

                if (this.hp <= 0) {
                  return;
                } //if(this.attackNum === 9){


                if (!this.hasInitGoods) {
                  var _this$node$getChildBy;

                  var chNode = this.node.getChildByName("UI_gongji");

                  if (((_this$node$getChildBy = this.node.getChildByName("UI_ZYXS")) == null ? void 0 : _this$node$getChildBy.active) == false) {
                    this.node.getChildByName("UI_ZYXS").active = true;
                  }

                  this.target.getComponent(_crd && goodsDrop === void 0 ? (_reportPossibleCrUseOfgoodsDrop({
                    error: Error()
                  }), goodsDrop) : goodsDrop).initGoods();
                  console.log("(this.node.name == ", this.node.name);
                  var match = this.node.name.match(/SangshiPrefab_(\d+)/);

                  if (match) {
                    var index = match[1]; // 动态获取对应的攻击UI元素

                    var gongji = this.node.getParent().getChildByName("UI_gongji_" + index);

                    if (gongji) {
                      var currentPos = this.node.worldPosition.clone();
                      var bloodPos = new Vec3();
                      Vec3.add(bloodPos, currentPos, this._bloodOffset); // 设置位置

                      gongji.setWorldPosition(bloodPos);
                      gongji.active = true;
                    }
                  } //  this.node.getParent().getChildByName("UI_gongji").active = true;
                  // this.node.getChildByName("UI_gongji").active = true;
                  // this.shoudleAnimation = this.schedule(() => {
                  //     this.node.getChildByName("UI_gongji").getComponent(Animation).play();
                  //     //this.node.getChildByName("UI_gongji").getComponent(Animation).play();
                  // }, 1)


                  this.hasInitGoods = true;
                } // (this.target as Character).getComponent(goodsDrop).cornRandomPos(1);


                this.target.getComponent(_crd && goodsDrop === void 0 ? (_reportPossibleCrUseOfgoodsDrop({
                  error: Error()
                }), goodsDrop) : goodsDrop).randomizeItemsInBackpack(0, 1);
                this.target.getComponent(_crd && goodsDrop === void 0 ? (_reportPossibleCrUseOfgoodsDrop({
                  error: Error()
                }), goodsDrop) : goodsDrop).randomizeItemsInBackpack(1, 1); // }

                this.attackCharactr();
              });
            } else {
              return;
            }
          }
        }
        /**.getParent
         * 旋转角色朝向目标位置
         * @param targetPos 目标位置
         */


        lookAtTarget(targetPos) {
          var _this$node$parent;

          // 计算朝向向量 (目标位置 - 当前位置)
          Vec3.subtract(this.tempForward, targetPos, this.node.worldPosition);
          this.tempForward.y = 0; // 保持水平方向

          this.tempForward.normalize(); // 如果有父节点旋转，需要转换到局部空间

          var parent = (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.parent;

          if (parent) {
            // 获取父节点旋转
            parent.getRotation(this.tempParentRotation); // 计算逆旋转

            Quat.invert(this.tempParentRotationInv, this.tempParentRotation); // 将世界方向转换到父节点局部空间

            Vec3.transformQuat(this.tempForward, this.tempForward, this.tempParentRotationInv);
          } // 计算旋转四元数


          Quat.fromViewUp(this.tempRotation, this.tempForward, Vec3.UP);
          this.node.setRotation(this.tempRotation);
        }
        /**
         * 移动角色到目标位置
         * @param deltaTime 帧间隔时间
         * @param targetPos 目标位置
         * @returns 是否到达目标
         */


        moveToTarget(deltaTime, targetPos) {
          // 计算方向向量
          Vec3.subtract(this.tempDir, targetPos, this.node.worldPosition);
          this.tempDir.y = 0; // 保持水平移动

          var distance = this.tempDir.length(); // console.log("=================>", distance, "====================>", this.stopDistance)

          if (distance < this.stopDistance) {
            // 距离足够近，认为已到达目标
            this.attackCharactr();
            return true;
          } // 归一化方向向量


          this.tempDir.normalize(); // 计算本次移动距离

          var moveDistance = this.speed * deltaTime;

          if (moveDistance >= distance) {
            // 本次移动距离超过剩余距离，直接设置到目标位置
            this.node.worldPosition = targetPos.clone();
            this.lookAtTarget(targetPos);
            this.attackCharactr();
            return true;
          } else {
            // 计算移动向量
            Vec3.multiplyScalar(this.tempMoveVec, this.tempDir, moveDistance); // 计算下一个位置

            Vec3.add(this.tempNextPos, this.node.worldPosition, this.tempMoveVec); // 设置新位置

            this.node.worldPosition = this.tempNextPos; // 转向目标

            this.lookAtTarget(targetPos);
            return false;
          }
        }
        /**退出移动状态 */


        onExit() {
          this.moveTargetWorldPos = null; // this.target = null;

          this.speed = 0;
          this.targetPos.set(0, 0, 0);
          this.stopDistance = 2;
          this.isFindCharacter = false;
          this.callback = null;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dissolve", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "findWay", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "speedTime", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "baseMaterial", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "redMaterial", [_dec6], {
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
//# sourceMappingURL=9b53181240f79512257041cef37f7e499385f58d.js.map