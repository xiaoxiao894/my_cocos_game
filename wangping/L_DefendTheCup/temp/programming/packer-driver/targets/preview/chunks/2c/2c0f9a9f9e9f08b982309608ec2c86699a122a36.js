System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Vec3, tween, SkeletalAnimation, Prefab, Pool, director, Animation, Vec2, Quat, DataManager, EntityTypeEnum, EventNames, MinionStateEnum, Simulator, EventManager, Util, MonsterItem, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, MinionManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventNames(extras) {
    _reporterNs.report("EventNames", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMinionStateEnum(extras) {
    _reporterNs.report("MinionStateEnum", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUtil(extras) {
    _reporterNs.report("Util", "../Common/Util", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterItem(extras) {
    _reporterNs.report("MonsterItem", "../Monster/MonsterItem", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Prefab = _cc.Prefab;
      Pool = _cc.Pool;
      director = _cc.director;
      Animation = _cc.Animation;
      Vec2 = _cc.Vec2;
      Quat = _cc.Quat;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
      EventNames = _unresolved_3.EventNames;
    }, function (_unresolved_4) {
      MinionStateEnum = _unresolved_4.MinionStateEnum;
    }, function (_unresolved_5) {
      Simulator = _unresolved_5.Simulator;
    }, function (_unresolved_6) {
      EventManager = _unresolved_6.EventManager;
    }, function (_unresolved_7) {
      Util = _unresolved_7.default;
    }, function (_unresolved_8) {
      MonsterItem = _unresolved_8.MonsterItem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2637d51qRRI0IwmMJPxmvVe", "MinionManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Vec3', 'tween', 'SkeletalAnimation', 'find', 'Prefab', 'Pool', 'director', 'Animation', 'SkeletalAnimationState', 'Vec2', 'Quat', 'Mat4']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MinionManager", MinionManager = (_dec = ccclass('MinionManager'), _dec2 = property(SkeletalAnimation), _dec3 = property(Prefab), _dec(_class = (_class2 = class MinionManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          _initializerDefineProperty(this, "hitExplosionProfab", _descriptor2, this);

          this._currentState = null;
          this._attackRadius = 15;
          this._moveSpeed = 3;
          this._targetMonster = null;
          this._attackCooldown = 3;
          this._attackTimer = 0;
          this.prefabPool = null;
          //移动小兵
          this._seachTime = 0;
          this._seachInterval = 10;
          //不移动的小兵
          this._noMoveSeachTime = 0;
          this._noMoveSearchInterval = 1;
          // 是否是可移动兵人         // 默认是可移动的兵人
          this.isLookingForMonsters = false;
          // 是否是可移动的兵人
          this.isMoveMinion = true;
          //rov相关
          this._agentHandleId = -1;
        }

        start() {}

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventNames === void 0 ? (_reportPossibleCrUseOfEventNames({
            error: Error()
          }), EventNames) : EventNames).ArmyMoveByRVO, this.moveByRvo, this);
        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventNames === void 0 ? (_reportPossibleCrUseOfEventNames({
            error: Error()
          }), EventNames) : EventNames).ArmyMoveByRVO, this.moveByRvo, this);
        }

        init() {
          var poolCount = 5;
          this.prefabPool = new Pool(() => {
            var prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).MinionWeapons);
            return instantiate(prefab);
          }, poolCount, node => {
            node.removeFromParent();
          }); // 设置 RVO

          var mass = 1;
          var agentId = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.addAgent((_crd && Util === void 0 ? (_reportPossibleCrUseOfUtil({
            error: Error()
          }), Util) : Util).v3t2(this.node.worldPosition.clone()), 1, 3, null, mass);
          var agentObj = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentByAid(agentId);
          agentObj.neighborDist = 1;
          this._agentHandleId = agentId;
        }

        onDestroy() {
          this.prefabPool.destroy();
        }

        create() {
          if (!this.prefabPool) return null;
          var node = this.prefabPool.alloc();

          if (node.parent == null) {
            director.getScene().addChild(node);
          }

          node.active = true;
          return node;
        }

        onProjectileDead(node) {
          node.active = false;
          this.prefabPool.free(node);
        }

        changState(state) {
          if (state == this._currentState) return;
          var ani = this.node.parent.getComponent(Animation);

          if (state == (_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
            error: Error()
          }), MinionStateEnum) : MinionStateEnum).Idle) {
            var idleClip = this.skeletalAnimation.clips.find(clip => clip.name === (_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
              error: Error()
            }), MinionStateEnum) : MinionStateEnum).Walk); // 替换为实际动画名

            if (idleClip) {
              this.skeletalAnimation.defaultClip = idleClip;

              var _state = this.skeletalAnimation.getState(idleClip.name);

              if (_state) {
                _state.time = 0.23; // 设置时间为第0秒

                _state.sample(); // 强制应用当前帧的姿势


                _state.pause(); // 停止播放

              }
            }

            if (ani) {
              ani.play("MinionidleA-001");
            }
          } else {
            var _this$skeletalAnimati;

            if (ani) {
              ani.stop();
            }

            (_this$skeletalAnimati = this.skeletalAnimation) == null || _this$skeletalAnimati.crossFade(state, 0.1);
          }

          this._currentState = state;
        }

        update(deltaTime) {
          if (this.isLookingForMonsters) {
            this._attackTimer -= deltaTime;
            this.chaseTarget(deltaTime);
          }
        } // 生成武器的 0.6


        chaseTarget(dt) {
          this._seachTime += dt;
          this._noMoveSeachTime += dt;
          var monsterParent = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.monsterParent;
          if (!monsterParent || monsterParent.children.length === 0) return;
          this._attackTimer -= dt; //  关键：递减攻击冷却

          var selfPos = this.node.worldPosition.clone();

          if (!this.isMoveMinion && this._noMoveSeachTime > this._noMoveSearchInterval || !this._targetMonster || !this._targetMonster.isValid || this._seachTime >= this._seachInterval) {
            this._noMoveSeachTime = 0;
            this._seachTime = 0; // 实时寻找最近怪

            var nearest = null;
            var minDistSqr = Infinity;

            for (var monster of monsterParent.children) {
              if (!monster || !monster.isValid) continue;
              var monsterItem = monster.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
                error: Error()
              }), MonsterItem) : MonsterItem);

              if (!monsterItem || monsterItem.isDead) {
                continue;
              }

              var monsterPos = monster.getWorldPosition();
              var distSqr = Vec3.squaredDistance(selfPos, monsterPos);

              if (distSqr < minDistSqr && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.MinionConManager.hasTarget(monster)) {
                minDistSqr = distSqr;
                nearest = monster;
              }
            }

            if (this._targetMonster !== nearest) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.MinionConManager.removeMonsterTarget(this._targetMonster);
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.MinionConManager.addMonsterTarget(nearest);
            }

            this._targetMonster = nearest;
          }

          if (!this._targetMonster || !this._targetMonster.isValid) return;

          var targetPos = this._targetMonster.getWorldPosition();

          var direction = targetPos.clone().subtract(selfPos);
          direction.y = 0;
          var distance = direction.length();
          var agentAid = this.agentHandleId;

          if (distance < this._attackRadius) {
            if (this._attackTimer <= 0) {
              this.attackTarget(); // 停止攻击的动画

              this.scheduleOnce(() => {
                var _this$skeletalAnimati2;

                (_this$skeletalAnimati2 = this.skeletalAnimation) == null || _this$skeletalAnimati2.stop();
                this.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                  error: Error()
                }), MinionStateEnum) : MinionStateEnum).Idle);
              }, .5);
              this._attackTimer = this._attackCooldown;
            }

            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
          } else {
            if (this.isMoveMinion) {
              (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
                error: Error()
              }), Simulator) : Simulator).instance.setAgentPrefVelocity(agentAid, new Vec2(direction.x, direction.z));
              this.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                error: Error()
              }), MinionStateEnum) : MinionStateEnum).Walk);
            } else {
              this.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                error: Error()
              }), MinionStateEnum) : MinionStateEnum).Idle);
            } //转向


            this.smoothLookAt(targetPos, dt);
          }
        } // 自动转向


        smoothLookAt(targetPos, dt, rotateSpeed) {
          if (rotateSpeed === void 0) {
            rotateSpeed = 10;
          }

          var selfPos = this.node.worldPosition;
          var dir = new Vec3();
          Vec3.subtract(dir, targetPos, selfPos);
          dir.y = 0;
          if (dir.lengthSqr() < 0.001) return;
          dir.normalize();
          var angleRad = Math.atan2(dir.x, dir.z);
          var targetY = angleRad * 180 / Math.PI;
          var currentY = this.node.eulerAngles.y; // 归一化差值到 [-180, 180]

          var deltaY = targetY - currentY;
          deltaY = ((deltaY + 180) % 360 + 360) % 360 - 180; // 使用平滑插值（slerp-like），dt 越小越平滑

          var smoothFactor = 1 - Math.exp(-rotateSpeed * dt);
          var lerpedY = currentY + deltaY * smoothFactor;
          this.node.setRotationFromEuler(0, lerpedY, 0);
        } // 攻击目标
        // 攻击目标


        attackTarget() {
          if (!this._targetMonster || !this._targetMonster.isValid) return;

          var monsterItem = this._targetMonster.getComponent(_crd && MonsterItem === void 0 ? (_reportPossibleCrUseOfMonsterItem({
            error: Error()
          }), MonsterItem) : MonsterItem);

          if (!monsterItem || monsterItem.isDead) return;
          var target = this._targetMonster;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.MinionConManager.removeMonsterTarget(this._targetMonster);
          this._targetMonster = null;
          this.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
            error: Error()
          }), MinionStateEnum) : MinionStateEnum).Attack); // 面朝目标

          this.smoothLookAt(target.getWorldPosition(), 1);
          var bullet;

          try {
            bullet = this.create();
            if (!bullet) return; // ✅ 获取发射起点（角色向后偏移 2 米 + 上抬 1.5 米）

            var startPos = this.node.worldPosition.clone();
            var forward = this.node.forward.clone().normalize();
            var bulletStart = startPos.add(forward.multiplyScalar(-2)).add(new Vec3(0, 1.5, 0));
            bullet.setWorldPosition(bulletStart);
            var targetPos = target.getWorldPosition(); // 使用 lookAt 让子弹 -Z 轴 朝向目标

            bullet.lookAt(targetPos, Vec3.UP);
            var fixQuat = new Quat();
            Quat.fromAxisAngle(fixQuat, Vec3.UP, 90 * Math.PI / 180); // 将 X+ 转成 Z+

            var currentQuat = bullet.getRotation();
            var finalQuat = new Quat();
            Quat.multiply(finalQuat, currentQuat, fixQuat); // 原始朝向 * 补偿旋转

            bullet.setRotation(finalQuat); // 发射动画（从起点飞向目标）

            tween(bullet).to(0.3, {
              worldPosition: targetPos
            }, {
              easing: 'quadInOut'
            }).call(() => {
              try {
                this.onProjectileDead(bullet);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.monsterManager.killMonsters([target]);
                var skillExplosion = instantiate(this.hitExplosionProfab);
                director.getScene().addChild(skillExplosion);
                skillExplosion.setWorldPosition(new Vec3(targetPos.x, targetPos.y + 1, targetPos.z));

                try {
                  var _skillExplosion$child;

                  var anim = skillExplosion == null || (_skillExplosion$child = skillExplosion.children[0]) == null ? void 0 : _skillExplosion$child.getComponent(Animation);

                  if (anim) {
                    anim.play("TX_zidanA_hit");
                    anim.once(Animation.EventType.FINISHED, () => {
                      try {
                        skillExplosion.destroy();
                      } catch (e) {
                        console.warn("Skill explosion destroy failed:", e);
                      }
                    });
                  } else {
                    this.scheduleOnce(() => {
                      try {
                        skillExplosion.destroy();
                      } catch (e) {
                        console.warn("Skill explosion delayed destroy failed:", e);
                      }
                    }, 1);
                  }
                } catch (e) {
                  console.error("Animation error:", e);
                  this.scheduleOnce(() => {
                    try {
                      skillExplosion.destroy();
                    } catch (e) {
                      console.warn("Fallback explosion destroy failed:", e);
                    }
                  }, 1);
                }
              } catch (e) {
                console.error("Bullet hit logic error:", e);
              }
            }).start();
          } catch (e) {
            console.error("AttackTarget failed:", e);
          }
        }

        //RVOid
        get agentHandleId() {
          return this._agentHandleId;
        }

        set agentHandleId(value) {
          this._agentHandleId = value;
        }
        /**
         * 在此之前 请确保Simulator run执行完毕
         */


        moveByRvo(dt) {
          if (!this.isLookingForMonsters || !this.isMoveMinion) {
            return;
          }

          var p = (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.getAgentPosition(this.agentHandleId);
          var targetPos = new Vec3(p.x, 0, p.y);
          var currentPos = this.node.worldPosition.clone();
          var dist = Vec3.distance(currentPos, targetPos);

          if (dist > 0.01) {
            var smoothFactor = 10;
            Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
            this.node.setWorldPosition(currentPos);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnimation", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hitExplosionProfab", [_dec3], {
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
//# sourceMappingURL=2c0f9a9f9e9f08b982309608ec2c86699a122a36.js.map