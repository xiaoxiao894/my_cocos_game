System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, tween, Vec3, Quat, Animation, ParticleSystem, Entity, App, GlobeVariable, SoundManager, MathUtil, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, PlayerTurret;

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

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../core/MathUtils", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
      Animation = _cc.Animation;
      ParticleSystem = _cc.ParticleSystem;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      GlobeVariable = _unresolved_4.GlobeVariable;
    }, function (_unresolved_5) {
      SoundManager = _unresolved_5.SoundManager;
    }, function (_unresolved_6) {
      MathUtil = _unresolved_6.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9c5a2mYVLVN1p1LC3oq2Qa4", "PlayerTurret", undefined);

      __checkObsolete__(['_decorator', 'Node', 'tween', 'Vec3', 'Quat', 'Animation', 'ParticleSystem', 'BoxCollider']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerTurret", PlayerTurret = (_dec = ccclass('PlayerTurret'), _dec2 = property({
        type: Animation
      }), _dec(_class = (_class2 = class PlayerTurret extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor() {
          super(...arguments);
          // @property
          this.attackRange = 30;

          // 攻击范围，可在编辑器中调整
          _initializerDefineProperty(this, "characterAnima", _descriptor, this);

          // 骨骼动画组件
          this.attackTargetList = [];
          // 攻击目标列表
          this.bulletSpeed = 90;
          this.explosionRangeSquared = 120;
          // 爆炸范围的平方（用于优化距离判断）
          // 血量属性
          this.hp = 2;
          this.maxHp = 2;
          this.attack = 1;
          // 攻击间隔
          this.attackInterval = 1.75;
          this.testInterval = 1.75;
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
          var characterData = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getCharacterById(3);

          if (characterData) {
            this.attackRange = characterData.attackRange;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp;
            this.hp = characterData.hp;
            this.attackInterval = characterData.attackInterval;
            this.testInterval = characterData.attackInterval;
          }

          this.bulletPos = this.node.getChildByName("attackPos");
        }

        move() {// 塔防无需移动逻辑
        }

        AttackAni() {
          // 检查敌人列表（更新范围内敌人）
          this.checkEnemy();
          var flowerTx = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.TurretTx);
          flowerTx.parent = this.bulletPos.parent;
          flowerTx.setPosition(this.bulletPos.position);
          flowerTx.active = true;
          var particle = flowerTx.getChildByName("blank").getComponent(ParticleSystem);
          particle.play();
          this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop(); // 3. 可选：手动清除所有粒子（根据引擎特性）

            particle.clear();
            flowerTx.active = false;
            flowerTx.removeFromParent();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(flowerTx, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.FlowerTx);
          }, 1.5); // 仅使用attack1中已确定的currentTarget，不重复计算
          // if (this.currentTarget) {
          //     // 二次校验目标有效性（避免攻击准备阶段目标死亡）
          //     if (this.currentTarget.hp <= 0 || this.currentTarget.recordHp <= 0) {
          //         return;
          //     }
          // }
          // 保存当前攻击目标快照，防止回调时目标变化

          var currentAttackTarget = this.currentTarget;

          if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
            return;
          }

          this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone(); // 旋转到目标方向

          if (!this.isInAttackRange(currentAttackTarget.node)) {
            this.checkEnemy();
            this.checkRange();
            var _currentAttackTarget = this.currentTarget;

            if (!_currentAttackTarget || !_currentAttackTarget.hitPosNode) {
              return;
            }

            this.enemyHitPos = _currentAttackTarget.hitPosNode.worldPosition.clone(); // return;
          }

          this.rotateTowards(this.enemyHitPos, 1); // 播放攻击音效（限制次数）
          //if (++this.audioPlayNum < 4) {

          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playAudio("paotafashe"); //  }
          // 创建并发射子弹

          var prefab = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.TurretBullet);
          prefab.setWorldPosition(this.bulletPos.worldPosition); // prefab.setWorldRotation(this.bulletPos.worldRotation);
          // prefab.setWorldScale(this.bulletPos.worldScale);
          // prefab.parent = App.sceneNode.fireArrow;
          // 核心修改：修正炮弹旋转方向（根据模型实际朝向调整偏移角度）

          var baseRot = this.bulletPos.worldRotation.clone(); // 获取发射点的基础旋转

          var offsetRot = Quat.fromEuler(new Quat(), 0, 0, 0); // 旋转偏移（示例：绕Y轴转90度，需根据模型调整）

          Quat.multiply(baseRot, baseRot, offsetRot); // 合并基础旋转和偏移旋转

          prefab.setWorldRotation(baseRot);
          prefab.setWorldScale(this.bulletPos.worldScale);
          prefab.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.fireArrow;
          currentAttackTarget.recordHp -= this.attack;
          var distance = Vec3.distance(this.bulletPos.worldPosition, this.enemyHitPos);
          var flightTime = Math.max(0.1, distance / this.bulletSpeed); // // 子弹飞行动画
          // tween(prefab)
          //     .to(flightTime, { worldPosition: this.enemyHitPos })
          //     .call(() => {
          //         // 使用快照目标执行攻击，避免currentTarget已被重置
          //         if (currentAttackTarget && currentAttackTarget.hp > 0) {
          //             currentAttackTarget.turretHit(this.attack);
          //         }
          //         this.explodeAtPosition(this.enemyHitPos);
          //         prefab.removeFromParent();
          //         App.poolManager.returnNode(prefab);
          //     })
          //     .start();
          // 原代码：tween(prefab).to(flightTime, { worldPosition: this.enemyHitPos })...
          // 计算贝塞尔曲线控制点（基于子弹起点、目标点和提升高度）

          var startPos = this.bulletPos.worldPosition.clone();
          var endPos = this.enemyHitPos.clone();
          var LIFT_HEIGHT = 25; // 炮弹飞行轨迹高度（可调整）
          // 控制点：起点和终点的中间上方

          var controlPoint = new Vec3((startPos.x + endPos.x) / 2, Math.max(startPos.y, endPos.y) + LIFT_HEIGHT, // 取较高点上方
          (startPos.z + endPos.z) / 2); // // 使用贝塞尔曲线动画替代线性运动
          // tween(prefab)
          //     .to(flightTime, {}, {
          //         easing: 'cubicInOut',
          //         onUpdate: (target: Node, ratio: number) => {
          //             // 调用MathUtil的贝塞尔曲线计算方法
          //             const position = MathUtil.bezierCurve(
          //                 startPos,
          //                 controlPoint,
          //                 endPos,
          //                 ratio
          //             );
          //             target.worldPosition = position;
          //         }
          //     })
          //     .call(() => {
          //         // 子弹命中逻辑（保持不变）
          //         if (currentAttackTarget && currentAttackTarget.hp > 0) {
          //             currentAttackTarget.turretHit(this.attack);
          //         }
          //         this.explodeAtPosition(this.enemyHitPos);
          //         prefab.removeFromParent();
          //         App.poolManager.returnNode(prefab, GlobeVariable.entifyName.TurretBullet);
          //     })
          //     .start();
          // }
          // 记录初始旋转（假设初始X轴旋转为0）

          var startRotation = prefab.eulerAngles.clone();
          var targetRotationX = 270; // 目标X轴旋转角度
          // 使用贝塞尔曲线动画，同时添加X轴旋转

          tween(prefab).to(flightTime, {}, {
            easing: 'cubicInOut',
            onUpdate: (target, ratio) => {
              // 1. 计算贝塞尔曲线位置
              var position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(startPos, controlPoint, endPos, ratio);
              target.worldPosition = position; // 2. 计算X轴旋转（从0度过渡到180度）

              var currentRotationX = startRotation.x + ratio * targetRotationX;
              target.eulerAngles = new Vec3(currentRotationX, startRotation.y, // 保持Y轴旋转不变
              startRotation.z // 保持Z轴旋转不变
              );
            }
          }).call(() => {
            // 子弹命中逻辑（保持不变）
            if (currentAttackTarget && currentAttackTarget.hp > 0) {
              if (!this.isInAttackRange(currentAttackTarget.node)) {
                this.explodeAtPosition(this.enemyHitPos);
                prefab.removeFromParent();
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).poolManager.returnNode(prefab, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                  error: Error()
                }), GlobeVariable) : GlobeVariable).entifyName.TurretBullet);
                return;
              }

              currentAttackTarget.turretHit(this.attack, this.bulletPos.worldPosition);
            }

            this.explodeAtPosition(this.enemyHitPos);
            prefab.removeFromParent();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(prefab, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.TurretBullet);
          }).start();
        }
        /** 子弹到达位置后爆炸，对范围内敌人造成伤害 */


        explodeAtPosition(position) {
          // 播放爆炸音效
          // SoundManager.inst.playAudio("YX_baozha"); // 假设存在爆炸音效
          // 获取所有敌人列表
          var allEnemies = [...(_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.getEnemyRvoList(), ...(_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.getEnemyList()]; // 查找爆炸范围内的所有有效敌人（使用平方距离优化）

          var affectedEnemies = allEnemies.filter(enemy => this.isValidEnemy(enemy) && this.getDistanceSquared(enemy.node.worldPosition, position) <= this.explosionRangeSquared); // 对所有受影响的敌人造成伤害

          affectedEnemies.forEach(enemy => {
            enemy.recordHp -= this.attack;
            enemy.turretHit(this.attack, this.bulletPos.worldPosition);
          }); // 可以在这里添加爆炸特效

          this.createExplosionEffect(position);
        }

        createExplosionEffect(position) {
          var flowerTx = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.TurretBombTx);
          flowerTx.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.bombEffectParent;
          flowerTx.setPosition(position);
          flowerTx.active = true;
          var particle = flowerTx.getChildByName("jizhong").getComponent(ParticleSystem);
          particle.play();
          this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop(); // 3. 可选：手动清除所有粒子（根据引擎特性）

            particle.clear();
            flowerTx.active = false;
            flowerTx.removeFromParent();
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(flowerTx, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.TurretBombTx);
          }, 1.5);
        }
        /** 辅助方法：计算两点之间的平方距离（避免开方运算，提高性能） */

        /** 辅助方法：计算两点之间的平方距离（避免开方运算，提高性能） */


        getDistanceSquared(pos1, pos2) {
          var dx = pos1.x - pos2.x;
          var dy = pos1.y - pos2.y;
          var dz = pos1.z - pos2.z;
          return dx * dx + dy * dy + dz * dz;
        }

        attack1() {
          // 1. 先更新敌人列表
          this.checkEnemy(); // 2. 统一在这里检查并更新目标（攻击前确认）

          this.checkRange(); // 3. 检查是否有有效目标

          if (!this.currentTarget) {
            return;
          } // 5. 执行攻击动画


          this.characterAnima.play("attack_paota");
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

          var rvoEnemyList = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.getEnemyRvoList();
          var enemyList = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.getEnemyList(); // 先检查RVO敌人列表

          for (var i = 0; i < rvoEnemyList.length; i++) {
            var enemy = rvoEnemyList[i];
            if (!this.isValidEnemy(enemy)) continue;

            if (this.isInAttackRange(enemy.node)) {
              this.attackTargetList.push(enemy);
            }
          } // RVO列表无目标时检查普通敌人列表


          if (this.attackTargetList.length === 0) {
            for (var _i = 0; _i < enemyList.length; _i++) {
              var _enemy = enemyList[_i];
              if (!this.isValidEnemy(_enemy)) continue;

              if (this.isInAttackRange(_enemy.node)) {
                this.attackTargetList.push(_enemy);
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


          var minDis = Number.MAX_VALUE;
          var minEnemy = null;

          for (var i = 0; i < this.attackTargetList.length; i++) {
            var enemy = this.attackTargetList[i];
            var distance = Vec3.distance(enemy.node.worldPosition, this.node.worldPosition);

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
          return enemy && enemy.hp > 0 && enemy.recordHp > 0;
        }
        /** 辅助判断：目标是否在攻击范围内 */


        isInAttackRange(target) {
          if (target && target.worldPosition) {
            return Vec3.distance(target.worldPosition, this.node.worldPosition) < this.attackRange;
          }

          return false;
        }
        /** 旋转到目标方向 */


        rotateTowards(targetWorldPos, dt) {
          var currentPos = this.node.worldPosition.clone();
          var dir = new Vec3();
          Vec3.subtract(dir, targetWorldPos, currentPos); // 计算从当前位置到目标位置的方向

          dir.y = 0; // 保持水平旋转

          dir.normalize();
          if (dir.lengthSqr() < 0.0001) return; // 距离过近时不旋转
          // 直接使用指向目标的方向作为视图方向，无需取反

          var targetQuat = new Quat();
          Quat.fromViewUp(targetQuat, dir, Vec3.UP); // 使用dir而非反方向

          var currentQuat = this.node.worldRotation.clone();
          var resultQuat = new Quat(); // 平滑插值旋转

          Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
          this.node.worldRotation = resultQuat;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "characterAnima", [_dec2], {
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
//# sourceMappingURL=8d55dab9d854c7c9c2700efc6516b94637eafc49.js.map