System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Node, tween, Vec3, SkeletalAnimation, Quat, Entity, App, GlobeVariable, SoundManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, PlayerPylon;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemySpider(extras) {
    _reporterNs.report("EnemySpider", "./EnemySpider", _context.meta, extras);
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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Quat = _cc.Quat;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      GlobeVariable = _unresolved_4.GlobeVariable;
    }, function (_unresolved_5) {
      SoundManager = _unresolved_5.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e20c0OyQYJKcb03sBZsbLzx", "PlayerPylon", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3', 'SkeletalAnimation', 'Quat', 'BoxCollider']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerPylon", PlayerPylon = (_dec = ccclass('PlayerPylon'), _dec2 = property({
        type: SkeletalAnimation
      }), _dec3 = property({
        type: Node
      }), _dec(_class = (_class2 = class PlayerPylon extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor(...args) {
          super(...args);
          // @property
          this.attackRange = 30;

          // 攻击范围，可在编辑器中调整
          _initializerDefineProperty(this, "characterAnima", _descriptor, this);

          // 骨骼动画组件
          _initializerDefineProperty(this, "fireNode", _descriptor2, this);

          this.enemyList = [];
          // 敌人列表
          this.attackTargetList = [];
          // 攻击目标列表
          this.attackType = 2;
          // 1-随机攻击 2-攻击最近的
          this.bulletSpeed = 150;
          // 血量属性
          this.hp = 2;
          this.maxHp = 2;
          this.attack = 1;
          // 攻击间隔
          this.attackInterval = 0.25;
          this.testInterval = 0.3;
          this._speed = 10;
          // 塔发射子弹的位置
          this.bulletPos = null;
          // 敌人受击位置
          this.enemyHitPos = null;
          // 当前攻击目标
          this.currentTarget = null;
          this.audioPlayNum = 0;
        }

        onLoad() {}

        start() {
          let characterData = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getCharacterById(2); //  

          if (characterData) {
            this.attackRange = characterData.attackRange;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp;
            this.hp = characterData.hp;
            this.attackInterval = characterData.attackInterval;
            this.testInterval = characterData.attackInterval;
            this.fireNode.active = true;
          }

          this.bulletPos = this.node.getChildByName("attackPos");
        }

        move() {// 塔防无需移动逻辑
        }

        restFireEvent() {
          this.fireNode.active = true;
          console.log("restFireEvent");
        }

        AttackAni() {
          this.fireNode.active = false; // 检查敌人列表（更新范围内敌人）

          this.checkEnemy(); // 仅使用attack1中已确定的currentTarget，不重复计算

          if (this.currentTarget) {
            // 二次校验目标有效性（避免攻击准备阶段目标死亡或被重置）
            if (!this.isValidEnemy(this.currentTarget)) {
              this.currentTarget = null;
              return;
            } // 保存当前攻击目标快照，防止回调时目标变化


            const currentAttackTarget = this.currentTarget;

            if (!currentAttackTarget.hitPosNode || !currentAttackTarget.node.isValid) {
              return;
            }

            this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone(); // 旋转到目标方向

            this.rotateTowards(this.enemyHitPos, 40); // 播放攻击音效（限制次数）

            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("gonggongji"); // 创建并发射子弹

            const prefab = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.FireArrow);
            prefab.setWorldPosition(this.bulletPos.worldPosition);
            prefab.setWorldRotation(this.bulletPos.worldRotation);
            prefab.setWorldScale(this.bulletPos.worldScale);
            prefab.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.fireArrow;
            currentAttackTarget.recordHp -= this.attack;
            const distance = Vec3.distance(this.bulletPos.worldPosition, this.enemyHitPos);
            const flightTime = Math.max(0.05, distance / this.bulletSpeed); // 保存初始目标位置，防止目标移动导致子弹跟踪到出生点

            const initialTargetPos = this.enemyHitPos.clone();
            tween(prefab).to(flightTime, {
              worldPosition: initialTargetPos
            }, {
              onUpdate: (target, ratio) => {
                // 检查目标是否有效，无效则立即终止动画并回收子弹
                if (!currentAttackTarget || !currentAttackTarget.node || !currentAttackTarget.node.isValid || !currentAttackTarget.isAttack) {
                  //     prefab.stopAllActions();
                  prefab.removeFromParent();
                  (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                    error: Error()
                  }), App) : App).poolManager.returnNode(prefab);
                  return;
                } // 在每一帧更新时，让箭矢面向目标方向


                const currentPos = target.worldPosition;
                const dir = new Vec3();
                Vec3.subtract(dir, initialTargetPos, currentPos);
                dir.normalize();

                if (dir.lengthSqr() > 0.0001) {
                  const oppositeDir = new Vec3(-dir.x, -dir.y, -dir.z);
                  const targetQuat = new Quat();
                  Quat.fromViewUp(targetQuat, oppositeDir, Vec3.UP);
                  target.worldRotation = targetQuat;
                }
              }
            }).call(() => {
              // 使用快照目标执行攻击，避免currentTarget已被重置
              if (currentAttackTarget && currentAttackTarget.node && currentAttackTarget.node.isValid && currentAttackTarget.hp > 0 && currentAttackTarget.isAttack) {
                currentAttackTarget.baseHit(this.attack, this.bulletPos.worldPosition, 4);
              }

              prefab.removeFromParent();
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(prefab);
            }).start();
          }
        }

        attack1() {
          // 1. 先更新敌人列表
          this.checkEnemy(); // 2. 统一在这里检查并更新目标（攻击前确认）

          this.checkRange(); // 3. 检查是否有有效目标

          if (!this.currentTarget) {
            return;
          } // 5. 执行攻击动画


          this.characterAnima.play("Attack_HuoChaiHe");
        }

        die(callback) {// 死亡逻辑可在此实现
        }

        update(deltaTime) {
          this.testInterval += deltaTime;

          if (this.testInterval > this.attackInterval) {
            this.testInterval -= this.attackInterval;
            this.attack1();
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


          if (this.attackTargetList.length === 0) {
            for (let i = 0; i < enemyList.length; i++) {
              const enemy = enemyList[i];
              if (!this.isValidEnemy(enemy)) continue;

              if (this.isInAttackRange(enemy.node)) {
                this.attackTargetList.push(enemy);
              }
            }
          }
        }
        /** 检查并更新最近的敌人目标 */


        checkRange() {
          // 当前目标有效且在范围内则直接返回
          if (this.currentTarget && this.isValidEnemy(this.currentTarget) && this.isInAttackRange(this.currentTarget.node)) {
            return this.currentTarget;
          } // 查找最近的敌人


          let minDis = Number.MAX_VALUE;
          let minEnemy = null;

          for (let i = 0; i < this.attackTargetList.length; i++) {
            const enemy = this.attackTargetList[i];
            const distance = Vec3.distance(enemy.node.worldPosition, this.node.worldPosition);

            if (distance < minDis) {
              minDis = distance;
              minEnemy = enemy;
            }
          }

          this.currentTarget = minEnemy;
          return minEnemy;
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
        /** 旋转到目标方向 */


        rotateTowards(targetWorldPos, dt) {
          const currentPos = this.node.worldPosition.clone();
          const dir = new Vec3();
          Vec3.subtract(dir, targetWorldPos, currentPos);
          dir.y = 0; // 保持水平旋转

          dir.normalize();
          if (dir.lengthSqr() < 0.0001) return;
          const oppositeDir = new Vec3(-dir.x, -dir.y + 0.1, -dir.z - 0.1);
          const targetQuat = new Quat();
          Quat.fromViewUp(targetQuat, oppositeDir, Vec3.UP);
          const currentQuat = this.node.worldRotation.clone();
          const resultQuat = new Quat();
          Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
          this.node.worldRotation = resultQuat;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "characterAnima", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fireNode", [_dec3], {
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
//# sourceMappingURL=38310d6d53fe51b290dd45b68234c08cd8d79e31.js.map