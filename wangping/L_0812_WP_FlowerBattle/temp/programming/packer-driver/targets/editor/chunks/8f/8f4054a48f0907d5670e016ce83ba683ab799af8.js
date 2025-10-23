System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Node, Vec3, SkeletalAnimation, Collider, Animation, ProgressBar, Slider, UIOpacity, Entity, App, EnemySpider, SoundManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, PlayerAttackFlower;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemySpider(extras) {
    _reporterNs.report("EnemySpider", "./EnemySpider", _context.meta, extras);
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
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Collider = _cc.Collider;
      Animation = _cc.Animation;
      ProgressBar = _cc.ProgressBar;
      Slider = _cc.Slider;
      UIOpacity = _cc.UIOpacity;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      EnemySpider = _unresolved_4.EnemySpider;
    }, function (_unresolved_5) {
      SoundManager = _unresolved_5.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "32242blRGVLS7nOvMlHj6RF", "PlayerAttackFlower", undefined);

      __checkObsolete__(['_decorator', 'Node', 'Vec3', 'SkeletalAnimation', 'ITriggerEvent', 'Collider', 'Animation', 'ProgressBar', 'Slider', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerAttackFlower", PlayerAttackFlower = (_dec = ccclass('PlayerAttackFlower'), _dec2 = property({
        type: SkeletalAnimation
      }), _dec3 = property({
        type: Collider
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node,
        tooltip: "消化状态进度条"
      }), _dec6 = property({
        type: Node,
        tooltip: "蜘蛛"
      }), _dec7 = property({
        tooltip: "攻击间隔"
      }), _dec8 = property({
        tooltip: "攻击间隔"
      }), _dec(_class = (_class2 = class PlayerAttackFlower extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor(...args) {
          super(...args);
          // @property
          this.attackRange = 60;

          // 攻击范围，可在编辑器中调整
          _initializerDefineProperty(this, "characterAnima", _descriptor, this);

          // 骨骼动画组件
          _initializerDefineProperty(this, "collider", _descriptor2, this);

          // 碰撞组件
          _initializerDefineProperty(this, "followNode", _descriptor3, this);

          // 跟随节点
          _initializerDefineProperty(this, "digestUINode", _descriptor4, this);

          _initializerDefineProperty(this, "spaider", _descriptor5, this);

          this.iseatSpiderMove = false;
          this.spiderInitPos = new Vec3();
          this.spiderInitScale = new Vec3();
          this.isEat = false;
          //是否实在咀嚼状态
          this.state = 0;
          //  1 攻击中 2 咀嚼中 3 吞咽
          this.attackTargetList = [];
          // 攻击目标列表
          this.frameIndex = 0;
          this.isIncreasing = false;
          this.addFrame = 10;
          this.tuanyanAudio = false;
          // 血量属性
          this.hp = 2;
          this.maxHp = 2;
          this.attack = 1;

          // 攻击间隔
          _initializerDefineProperty(this, "attackInterval", _descriptor6, this);

          _initializerDefineProperty(this, "testInterval", _descriptor7, this);
        }

        showDigestUI() {
          this.digestUINode.active = true;
          this.digestUINode.getChildByName("shanguang01").active = false;
          this.digestUINode.getChildByName("xiaohua_shanguang").active = false;
        }

        continueGame() {
          this.digestUINode.active = false;
        }

        digestProgress() {
          let digestProgress = 1 - this.testInterval / this.attackInterval;

          if (this.iseatSpiderMove) {
            let z = this.spaider.position.z;
            let x = this.spaider.position.x;
            this.spaider.setPosition(x -= 0.003, this.spaider.position.y, z += 0.0015);
          }

          if (digestProgress <= 0) {
            // 获取当前缩放
            let currentScale = this.spaider.scale; // 计算新缩放值（向目标缩放靠近）

            let newScaleX = currentScale.x - 0.002;
            let newScaleY = currentScale.y - 0.002;
            let newScaleZ = currentScale.z - 0.002; // 设置新缩放

            this.spaider.setScale(newScaleX, newScaleY, newScaleZ);
            digestProgress = -0.1;
            this.digestUINode.getChildByName("shanguang01").active = true;
            this.digestUINode.getChildByName("xiaohua_shanguang").active = true; // 首先在类中添加一个状态变量，用于标记当前是否在增加透明度
            // this.isIncreasing = false;  // 可以在初始化时设置
            // 修改透明度更新逻辑

            if (this.isIncreasing) {
              // 处于增加状态，逐渐增加到255
              this.frameIndex += this.addFrame; // 当达到255时，切换回减少状态

              if (this.frameIndex >= 255) {
                this.frameIndex = 255;
                this.isIncreasing = false;
              }
            } else {
              // 处于减少状态，逐渐减少到0
              this.frameIndex -= this.addFrame; // 当减到0时，切换到增加状态

              if (this.frameIndex <= 0) {
                this.frameIndex = 0;
                this.isIncreasing = true;
              }
            }

            this.scheduleOnce(() => {
              if (!this.tuanyanAudio) {
                this.tuanyanAudio = true;
                (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                  error: Error()
                }), SoundManager) : SoundManager).Instance.playAudio("tunyan");
              }
            }, 0.3); // 应用透明度

            this.digestUINode.getChildByName("shanguang01").getComponent(UIOpacity).opacity = this.frameIndex;
            this.digestUINode.getChildByName("xiaohua_shanguang").getComponent(UIOpacity).opacity = this.frameIndex;
            if (this.characterAnima.getState("Attack-end").isPlaying) return;
            this.characterAnima.play("Attack-end");
            this.state = 3;
            this.characterAnima.once(Animation.EventType.FINISHED, () => {
              // this.testInterval = 0;
              this.isEat = false;
              this.testInterval = 6;
              this.state = 0; // 重置蜘蛛位置和缩放

              this.spaider.active = false;
              this.spaider.setPosition(this.spiderInitPos);
              this.spaider.setScale(this.spiderInitScale);
              this.iseatSpiderMove = false;
              this.tuanyanAudio = false; // this.digestUINode.getChildByName("shanguang01").active = false;
            });
          } else {
            this.digestUINode.getChildByName("Green").getComponent(ProgressBar).progress = digestProgress;
            this.digestUINode.getChildByName("Slider").getComponent(Slider).progress = digestProgress;
          }
        }

        onLoad() {
          this.digestUINode.active = false;
        }

        start() {
          if (!this.characterAnima.getState("Idle").isPlaying) this.characterAnima.play("Idle");

          if (!this.collider) {
            console.warn('没有找到碰撞矩阵');
            return;
          }

          if (!this.collider) return;
          this.spiderInitPos = this.spaider.position.clone();
          this.spiderInitScale = this.spaider.scale.clone();
          this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
          this.collider.on('onTriggerStay', this.onTriggerStay, this);
          this.collider.on('onTriggerExit', this.onTriggerExit, this);
        }

        onTriggerEnter(event) {
          if (this.state == 2 || this.state == 3) return;
          const selfnode = event.otherCollider.node; //selfnode.getComponent(EnemySpider).node.active = false;

          selfnode.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
            error: Error()
          }), EnemySpider) : EnemySpider).attackFlowerDie(this.followNode);
          console.log("onTriggerExit nodeName == ", selfnode.name);
        }

        onTriggerExit(event) {
          console.log("onTriggerExit");
        }

        onTriggerStay(event) {}

        attackList() {
          // 可攻击的怪物
          // 获取当前节点的世界位置
          const selfPos = this.node.worldPosition; // 存储在120度范围内的敌人

          const enemiesInSector = []; // 遍历攻击目标列表

          for (const enemy of this.attackTargetList) {
            if (!enemy || !enemy.node) continue; // 计算敌人相对于当前节点的方向向量

            const direction = new Vec3();
            Vec3.subtract(direction, enemy.node.worldPosition, selfPos); // 计算方向向量与前方（假设为Z轴正方向）的夹角
            // 注：根据游戏坐标系实际情况可能需要调整参考轴

            const angle = Math.atan2(direction.x, direction.z) * 180 / Math.PI; // 取绝对值，判断是否在120度范围内（-60度到+60度之间）

            if (Math.abs(angle) <= 60) {
              enemiesInSector.push(enemy);
            }
          } // 返回在120度范围内的敌人列表


          return enemiesInSector;
        }

        move() {// 塔防无需移动逻辑
        } // AttackAni() {
        //     // 检查敌人列表（更新范围内敌人）
        //     this.checkEnemy();
        //     let list = this.attackList();
        //     list.forEach((enemy) => {
        //         enemy.getComponent(EnemySpider).node.active = false;
        //         enemy.getComponent(EnemySpider).attackFlowerDie();
        //     })
        // }


        attack1() {
          // 1. 先更新敌人列表
          // this.checkEnemy();
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playAudio("eat");
          this.digestUINode.getChildByName("shanguang01").active = false;
          this.digestUINode.getChildByName("xiaohua_shanguang").active = false;
          this.characterAnima.play("Attack-start2");
          this.state = 1;
          this.scheduleOnce(() => {
            if (this.spaider) {
              this.spaider.active = true;

              if (!this.iseatSpiderMove) {
                this.iseatSpiderMove = true;
              }
            }
          }, 0.5);
          this.characterAnima.once(Animation.EventType.FINISHED, () => {
            this.isEat = true;

            if (!this.digestUINode.active) {
              this.showDigestUI();
            }

            this.characterAnima.play("Attack-loop");
            this.state = 2;
            this.testInterval = 0;
          });
        }

        die(callback) {// 死亡逻辑可在此实现
        }

        update(deltaTime) {
          if (!this.isEat) {
            this.testInterval += deltaTime;

            if (this.testInterval > this.attackInterval) {
              this.testInterval = 0;
              this.checkEnemy();
              let attackList = this.attackList();

              if (attackList.length > 0) {
                this.attack1();
              } else {
                this.testInterval = 6;
                if (!this.characterAnima.getState("Idle").isPlaying) this.characterAnima.play("Idle");
                this.digestUINode.getChildByName("shanguang01").active = true;
                this.digestUINode.getChildByName("xiaohua_shanguang").active = true;

                if (this.isIncreasing) {
                  // 处于增加状态，逐渐增加到255
                  this.frameIndex += this.addFrame; // 当达到255时，切换回减少状态

                  if (this.frameIndex >= 255) {
                    this.frameIndex = 255;
                    this.isIncreasing = false;
                  }
                } else {
                  // 处于减少状态，逐渐减少到0
                  this.frameIndex -= this.addFrame; // 当减到0时，切换到增加状态

                  if (this.frameIndex <= 0) {
                    this.frameIndex = 0;
                    this.isIncreasing = true;
                  }
                } // 应用透明度


                this.digestUINode.getChildByName("shanguang01").getComponent(UIOpacity).opacity = this.frameIndex;
                this.digestUINode.getChildByName("xiaohua_shanguang").getComponent(UIOpacity).opacity = this.frameIndex;
              }
            }
          } else {
            this.testInterval += deltaTime;
            this.digestProgress(); // if (this.testInterval > this.attackInterval) {
            //     this.testInterval = 0;
            //     this.characterAnima.play("Attack-end");
            //     this.characterAnima.once(Animation.EventType.FINISHED, () => {
            //         this.isEat = false;
            //         this.testInterval = 6;
            //     })
            // }
          }
        }
        /** 查找可攻击的敌人（更新攻击目标列表） */


        checkEnemy() {
          this.attackTargetList = []; // 清空列表

          const rvoEnemyList = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.getEnemyRvoList();
          const enemyList = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.getEnemyList(); // 先检查RVO敌人列表

          for (let i = 0; i < rvoEnemyList.length; i++) {
            const enemy = rvoEnemyList[i];
            if (!this.isValidEnemy(enemy)) continue;

            if (this.isInAttackRange(enemy.node)) {
              this.attackTargetList.push(enemy);
            }
          } // RVO列表无目标时检查普通敌人列表
          //    if (this.attackTargetList.length === 0) {


          for (let i = 0; i < enemyList.length; i++) {
            const enemy = enemyList[i];
            if (!this.isValidEnemy(enemy)) continue;

            if (this.isInAttackRange(enemy.node)) {
              this.attackTargetList.push(enemy);
            }
          } //  }

        }
        /** 辅助判断：敌人是否有效（存活） */


        isValidEnemy(enemy) {
          // 增加对isAttack和node.isValid的检查
          return enemy && enemy.node && enemy.node.isValid && enemy.hp > 0 && enemy.recordHp > 0 && enemy.isAttack;
        }
        /** 辅助判断：目标是否在攻击范围内 */


        isInAttackRange(target) {
          if (!target) {
            return false;
          }

          return Vec3.distance(target.worldPosition, this.node.worldPosition) < this.attackRange;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "characterAnima", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "collider", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "followNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "digestUINode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "spaider", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "attackInterval", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "testInterval", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f4054a48f0907d5670e016ce83ba683ab799af8.js.map