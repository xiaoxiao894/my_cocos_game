System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Component, director, instantiate, Node, Pool, Prefab, Quat, tween, Vec3, DataManager, Bullet, ItemAreaManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, PartnerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBullet(extras) {
    _reporterNs.report("Bullet", "./Bullet", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemAreaManager(extras) {
    _reporterNs.report("ItemAreaManager", "../Area/ItemAreaManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      Component = _cc.Component;
      director = _cc.director;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Pool = _cc.Pool;
      Prefab = _cc.Prefab;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      Bullet = _unresolved_3.Bullet;
    }, function (_unresolved_4) {
      ItemAreaManager = _unresolved_4.ItemAreaManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ef19aCSO05Fqbb7w6YWh5ob", "PartnerManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'AudioSource', 'Component', 'director', 'find', 'instantiate', 'Node', 'Pool', 'Prefab', 'Quat', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PartnerManager", PartnerManager = (_dec = ccclass('PartnerManager'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(Prefab), _dec(_class = (_class2 = class PartnerManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "projectile", _descriptor, this);

          // 大技能
          _initializerDefineProperty(this, "bigSkill", _descriptor2, this);

          _initializerDefineProperty(this, "hitPrefab", _descriptor3, this);

          this.prefabPool = null;
          this.bigSkillsPrefabPool = null;
          this.hitPrefabPool = null;
          this.isSkillAllPlaying = false;
          // 攻击动画名字
          this.attackName = null;
          this.direction = "L";
          // 最近的怪
          this.nearestMonster = null;
          // 是否普通攻击
          this.isNormalAttacking = true;
          this.monsterParent = null;
          // 类的属性中增加：
          this.isTargetLocked = false;
          // 用于锁定目标
          this._isIdlePlaying = false;
          this._idleAnimFinishedHandler = null;
        }

        init() {
          // 获取所有怪
          this.monsterParent = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.monsterParent;
          var poolCount = 5;
          var bigSkillsPrefabPoolCount = 100; // 普通攻击

          this.prefabPool = new Pool(() => {
            return instantiate(this.projectile);
          }, poolCount, node => {
            node.removeFromParent();
          }); // 大技能

          this.bigSkillsPrefabPool = new Pool(() => {
            return instantiate(this.bigSkill);
          }, bigSkillsPrefabPoolCount, node => {
            node.removeFromParent();
          }); // 攻击特效

          this.hitPrefabPool = new Pool(() => {
            return instantiate(this.hitPrefab);
          }, poolCount, node => {
            node.removeFromParent();
          });
        }

        onDestroy() {
          this.prefabPool.destroy();
        }

        create(prefabPool) {
          var node = prefabPool.alloc();

          if (node.parent == null) {
            director.getScene().addChild(node);
          }

          node.active = true;
          return node;
        }

        onProjectileDead(prefabPool, node) {
          node.active = false;
          prefabPool.free(node);
        }

        update(dt) {
          if (this.isSkillAllPlaying) return;
          var monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchMonsters.getAttackTargets(this.node, 20, 360);
          var partnerWorldPos = this.node.worldPosition; // 仅在目标没有锁定时，更新目标 

          if (!this.isTargetLocked) {
            this.nearestMonster = this.getNearestMonster(monsters, partnerWorldPos);
          }

          if (this.nearestMonster && this.isNormalAttacking) {
            this.isNormalAttacking = false;
            var aniName = this.node.name.slice(0, -1);
            var isRight = this.isTargetOnRight(this.node, this.nearestMonster);
            var clipName = isRight ? aniName + "L" : aniName + "R";

            if (isRight) {
              this.direction = "L";
            } else {
              this.direction = "R";
            }

            this.playPartnerAnim(clipName); // 攻击中，解除 idle 播放状态

            this.isTargetLocked = true;
            this._isIdlePlaying = false;
            this.scheduleOnce(() => {
              this.isNormalAttacking = true;
              this.isTargetLocked = false;
            }, 3);
          } else {
            var partnerParent = this.node.getChildByName("PartnerParent");

            if (partnerParent) {
              var ani = partnerParent.getComponent(Animation);

              if (ani && !this._isIdlePlaying) {
                ani.play("idleB");
                this._isIdlePlaying = true; // 移除旧的监听器，避免叠加

                if (this._idleAnimFinishedHandler) {
                  ani.off(Animation.EventType.FINISHED, this._idleAnimFinishedHandler);
                } // 注册新的监听器


                this._idleAnimFinishedHandler = () => {
                  this._isIdlePlaying = false;
                };

                ani.on(Animation.EventType.FINISHED, this._idleAnimFinishedHandler);
              }
            }
          }
        }

        fireAtTarget() {
          if (!this.nearestMonster) return;
          var bullet = this.create(this.prefabPool);
          if (!bullet) return;
          var selfPos = this.node.worldPosition;
          var monsterPos = this.nearestMonster.worldPosition;
          if (!monsterPos) return; //  计算角色 → 怪物的方向

          var direction = monsterPos.clone().subtract(selfPos).normalize(); //  中点位置

          var midPoint = selfPos.clone().add(monsterPos).multiplyScalar(0.5); //  偏移位置（从中点向角色方向偏移）

          var maxOffset = Vec3.distance(selfPos, monsterPos) / 2;
          var radius = Math.min(3, maxOffset); // 向角色方向偏移

          var spawnPos = midPoint.clone().subtract(direction.clone().multiplyScalar(radius));
          spawnPos.y += 7; // 稍微抬高一点

          bullet.setWorldPosition(spawnPos); //  使用 lookAt 先设置 bullet 朝向（默认是 Z- 轴指向目标）

          bullet.lookAt(monsterPos, Vec3.UP); //  如果模型的“头朝向”为 X+，则绕 Y 轴加 90° 补偿

          var fixQuat = new Quat();
          Quat.fromAxisAngle(fixQuat, Vec3.UP, 90 * Math.PI / 180);
          var currentQuat = bullet.getRotation();
          var finalQuat = new Quat();
          Quat.multiply(finalQuat, currentQuat, fixQuat); // 原始朝向 * 补偿旋转

          bullet.setRotation(finalQuat); //  设置子弹参数

          var bulletComp = bullet.getComponent(_crd && Bullet === void 0 ? (_reportPossibleCrUseOfBullet({
            error: Error()
          }), Bullet) : Bullet);

          if (bulletComp) {
            bulletComp.explosiveSpecialEffects = this.explosiveSpecialEffects.bind(this);
            bulletComp.target = this.nearestMonster;
            bulletComp.speed = 40;
            bulletComp.PartnerManager = this;
          }
        }

        playPartnerAnim(name) {
          var anim = this.node.getComponent(Animation);
          var state = anim == null ? void 0 : anim.getState(name);

          if (state) {
            state.stop(); // 防止播放失败

            anim.play(name);
          } else {
            console.warn("\u274C \u52A8\u753B " + name + " \u672A\u627E\u5230");
          }
        } // 目标是怪物或世界坐标


        explosiveSpecialEffects(target, name) {
          var _skillExplosion$child;

          var worldPos = target instanceof Node ? target.worldPosition : target; //  生成爆炸特效

          var skillExplosion = this.create(this.hitPrefabPool);
          if (!skillExplosion) return;
          skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y + 2, worldPos.z)); // 

          var anim = skillExplosion == null || (_skillExplosion$child = skillExplosion.children[0]) == null ? void 0 : _skillExplosion$child.getComponent(Animation);

          if (anim) {
            anim.play(name + "_hit");
            anim.once(Animation.EventType.FINISHED, () => {
              this.onProjectileDead(this.hitPrefabPool, skillExplosion);
            });
          } else {
            // 没动画时，延迟回收
            this.scheduleOnce(() => {
              this.onProjectileDead(this.hitPrefabPool, skillExplosion);
            }, 1);
          } // 查找爆炸范围内的怪物（半径 5）


          var radius = 5;
          var monsterParent = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.monsterParent;
          var hitMonsters = [];

          for (var monster of monsterParent.children) {
            var distSqr = Vec3.squaredDistance(monster.worldPosition, worldPos);

            if (distSqr <= radius * radius) {
              hitMonsters.push(monster);
            }
          } // 对命中的怪执行处理


          if (hitMonsters.length > 0) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.monsterManager.killMonsters(hitMonsters);
          }
        } // 获取离伙伴最近的怪物


        getNearestMonster(monsters, partnerPos) {
          var nearest = null;
          var minDistance = Infinity;

          for (var monster of monsters) {
            if (!monster || !monster.isValid) continue;
            var monsterPos = monster.worldPosition;
            var distance = Vec3.distance(monsterPos, partnerPos);

            if (distance < minDistance) {
              minDistance = distance;
              nearest = monster;
            }
          }

          return nearest;
        } // 判断是在人物的左边还是右边


        isTargetOnRight(self, target) {
          var selfPos = self.worldPosition;
          var targetPos = target.worldPosition; // 角色的 forward 方向（Z轴向前）

          var forward = self.forward.clone().normalize(); // 朝目标方向的向量

          var toTarget = targetPos.clone().subtract(selfPos).normalize(); // 角色右方向 = forward × up

          var right = new Vec3();
          Vec3.cross(right, forward, Vec3.UP); // 使用世界Y轴为 up
          // 点积判断左右（> 0 在右侧 < 0 在左侧）

          return Vec3.dot(right, toTarget) > 0;
        } // // 技能生成的随机偏移范围（米）
        // private radiusRandomOffset = 3;
        // // 技能释放的整体朝向角度（绕Y轴，单位：度）
        // private directionAngleDeg = 0;
        // // 技能影响的半径，仅用于检测怪物，XZ平面（单位：米）
        // private skillDetectRadius = 4;
        // const initialRadius = 5;       // 第一圈技能的半径
        // const ringStep = 5;            // 每一圈向外扩展的间隔
        // const ringCount = 5;           // 总共生成多少圈
        // const delayPerRing = 0.3;      // 每一圈的延迟时间
        // const spreadAngle = 130;       // 技能扇形覆盖角度

        /**
         * 主技能释放函数，按照环形和扇形分布在角色前方生成技能节点
         */


        releaseMajorSkills() {
          var _itemAreaManager$dire;

          var itemAreaManager = this.node.parent.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
            error: Error()
          }), ItemAreaManager) : ItemAreaManager);
          var center = this.node.worldPosition.clone(); // 技能中心点为当前角色位置

          var directionAngleDeg = (_itemAreaManager$dire = itemAreaManager.directionAngleDeg) != null ? _itemAreaManager$dire : 0;
          var directionAngleRad = directionAngleDeg * Math.PI / 180; // 朝向向量（forward），单位向量，决定技能释放的主方向（默认Z正方向）

          var forward = new Vec3(Math.sin(directionAngleRad), 0, Math.cos(directionAngleRad)).normalize(); // 外层循环：每一圈技能生成逻辑

          for (var ring = 0; ring < itemAreaManager.ringCount; ring++) {
            var baseRadius = itemAreaManager.initialRadius + ring * itemAreaManager.ringStep;
            var delay = ring * itemAreaManager.delayPerRing;
            var candidateCount = 6 + ring; // 每圈技能候选点数量（越外层越多）

            var selectCount = 2 + ring; // 实际从候选中选出用于释放技能的位置
            // 创建索引数组并进行洗牌（随机打乱顺序）

            var indices = Array.from({
              length: candidateCount
            }, (_, i) => i);

            for (var i = indices.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              [indices[i], indices[j]] = [indices[j], indices[i]];
            } // === 播放该层技能音效 ===


            if (ring < 2) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager.playRingSoundDynamically(this.node.name, delay);
            } // 内层循环：生成实际技能节点


            for (var _i = 0; _i < selectCount && _i < candidateCount; _i++) {
              var idx = indices[_i]; // 当前角度在扇形中的位置

              var angleStep = itemAreaManager.spreadAngle / (candidateCount - 1);
              var angleDeg = -itemAreaManager.spreadAngle / 2 + angleStep * idx;
              var angleRad = angleDeg * Math.PI / 180; // 将角度旋转后的方向向量

              var dir = new Vec3(Math.sin(directionAngleRad + angleRad), 0, Math.cos(directionAngleRad + angleRad)).normalize(); // 生成点的基础位置

              var basePos = center.clone().add(dir.multiplyScalar(baseRadius)); // 加上一个位置扰动偏移（模拟不规则性）

              var randomOffset = new Vec3((Math.random() - 0.5) * 2 * itemAreaManager.radiusRandomOffset, 0, (Math.random() - 0.5) * 2 * itemAreaManager.radiusRandomOffset);
              var spawnPos = basePos.add(randomOffset); // 最终生成位置

              var angleY = directionAngleDeg + angleDeg; // 旋转角度（暂未使用）
              // 延迟执行技能生成

              ((spawnPos, angleY, delay) => {
                setTimeout(() => {
                  var skillNode = this.create(this.bigSkillsPrefabPool);
                  if (!skillNode) return; // 重置技能节点状态

                  this.resetSkillNode(skillNode, spawnPos, angleY); // 检测命中的怪物并清除

                  for (var _i2 = 0; _i2 < 2; _i2++) {
                    var monsters = this.getEnemiesInRange(spawnPos);
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.monsterManager.killMonsters(monsters);
                  } // 延迟回收技能节点（你可以启用缩放动画）


                  tween(skillNode).delay(1.0) // .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: 'quadIn' })
                  .call(() => {
                    this.onProjectileDead(this.bigSkillsPrefabPool, skillNode);
                  }).start();
                }, delay * 1000);
              })(spawnPos, angleY, delay);
            }
          }
        }
        /**
         * 重置技能节点的状态，用于对象池复用
         */


        resetSkillNode(node, position, angleY) {
          node.setWorldPosition(position); // node.setScale(Vec3.ONE); // 如果你开启缩放动画，取消注释

          node.active = true;
          var skill = node.getChildByName("Skill");

          if (skill) {
            // skill.setScale(Vec3.ONE);
            skill.active = true;
            var skillAni = skill.getComponent(Animation);
            var clipName = "TX_Skill_" + this.node.name; // 动画名称格式根据角色名而定

            if (skillAni) {
              skillAni.stop(); // 保证动画重放

              skillAni.play(clipName);
            }
          }
        }
        /**
         * 获取技能范围内的敌人，仅检测XZ平面距离
         */


        getEnemiesInRange(center) {
          var itemAreaManager = this.node.parent.getComponent(_crd && ItemAreaManager === void 0 ? (_reportPossibleCrUseOfItemAreaManager({
            error: Error()
          }), ItemAreaManager) : ItemAreaManager);
          var radius = itemAreaManager.skillDetectRadius;
          var radiusSqr = radius * radius;
          var enemies = [];

          for (var enemy of this.monsterParent.children) {
            var pos = enemy.worldPosition;
            var dx = pos.x - center.x;
            var dz = pos.z - center.z;
            var distSqr = dx * dx + dz * dz;

            if (distSqr <= radiusSqr) {
              enemies.push(enemy);
            }
          }

          return enemies;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "projectile", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bigSkill", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hitPrefab", [_dec4], {
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
//# sourceMappingURL=b7a5415a59a703108126e1aa0f4aef37e834322f.js.map