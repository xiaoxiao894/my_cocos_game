System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Node, Vec3, tween, find, director, Animation, DataManager, EntityTypeEnum, MinionManager, MinionStateEnum, Actor, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, MinionConManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMinionManager(extras) {
    _reporterNs.report("MinionManager", "./MinionManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMinionStateEnum(extras) {
    _reporterNs.report("MinionStateEnum", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfActor(extras) {
    _reporterNs.report("Actor", "./Actor", _context.meta, extras);
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
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      find = _cc.find;
      director = _cc.director;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }, function (_unresolved_4) {
      MinionManager = _unresolved_4.MinionManager;
    }, function (_unresolved_5) {
      MinionStateEnum = _unresolved_5.MinionStateEnum;
    }, function (_unresolved_6) {
      Actor = _unresolved_6.Actor;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8c9d38nvexG+576Q+JUUGu/", "MinionConManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Vec3', 'tween', 'find', 'director', 'Animation', 'Camera']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MinionConManager", MinionConManager = (_dec = ccclass('MinionConManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class MinionConManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "minionWeaponCon", _descriptor, this);

          _initializerDefineProperty(this, "lookingMonsterMinionCon", _descriptor2, this);

          // 怪容器
          _initializerDefineProperty(this, "monsterParent", _descriptor3, this);

          // 起点
          this.birthPoint = new Vec3(-0.657, 0, 9);
          // 排队
          this.queuePosition = [new Vec3(-0.657, 0, 21), new Vec3(-0.657, 0, 18), new Vec3(-0.657, 0, 15), new Vec3(-0.657, 0, 12)];
          // 出门路径
          this.exitRoute = [new Vec3(-0.657, 0, 25), new Vec3(8.411, 0, 25), new Vec3(8.411, 0, 33)];
          this.moveSpeed = 5;
          this.spawnCooldown = 1.5;
          this._spawnTimer = 0;
          this._targetMonsters = [];
          // 是否出现结算结束截面
          this.isSettlementInterface = false;
          this._isDeliveringMinion = false;
          this._deliverInterval = 1;
          // === 添加到类成员中 ===
          this._activeMovingMinions = new Set();
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.MinionConManager = this;
        }

        update(deltaTime) {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isStartGame) {
            this._spawnTimer += deltaTime;
            this.checkQueueAndRefill(); // 小兵出门

            this.goOutMinion();
          }
        } // 填充队列


        checkQueueAndRefill() {
          if (!this.node) return;
          const children = this.node.children; // 已有小兵自动前进补位

          for (let i = 0; i < children.length; i++) {
            var _tweenTarget;

            const minion = children[i];
            const targetPos = this.queuePosition[i];
            if (!minion) continue;
            const minionManager = minion == null ? void 0 : minion.children[0].getComponent(_crd && MinionManager === void 0 ? (_reportPossibleCrUseOfMinionManager({
              error: Error()
            }), MinionManager) : MinionManager);
            const currentPos = minion.position; // 如果已经在位置上，确保状态为 Idle

            if (Vec3.distance(currentPos, targetPos) < 0.01) {
              minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                error: Error()
              }), MinionStateEnum) : MinionStateEnum).Idle);
              continue;
            }

            if ((_tweenTarget = minion._tweenTarget) != null && _tweenTarget.equals(targetPos)) continue;
            minion._tweenTarget = targetPos.clone(); // 开始移动时切换为 Walk

            minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
              error: Error()
            }), MinionStateEnum) : MinionStateEnum).Walk);
            const duration = Vec3.distance(currentPos, targetPos) / this.moveSpeed;
            tween(minion).stop().to(duration, {
              position: targetPos
            }).call(() => {
              delete minion._tweenTarget; // 移动结束后切换为 Idle

              minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                error: Error()
              }), MinionStateEnum) : MinionStateEnum).Idle);
            }).start();
          } // 如果人数不足，创建新兵补到队尾


          if (children.length < this.queuePosition.length && this._spawnTimer >= this.spawnCooldown) {
            const prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Minion);
            if (!prefab) return;
            const minion = instantiate(prefab);
            minion.setParent(this.node);
            minion.setPosition(this.birthPoint.clone());
            const minionManager = minion.children[0].getComponent(_crd && MinionManager === void 0 ? (_reportPossibleCrUseOfMinionManager({
              error: Error()
            }), MinionManager) : MinionManager);
            minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
              error: Error()
            }), MinionStateEnum) : MinionStateEnum).Walk);
            const targetPos = this.queuePosition[children.length - 1];
            const duration = Vec3.distance(this.birthPoint, targetPos) / this.moveSpeed;
            minion._tweenTarget = targetPos.clone();
            tween(minion).to(duration, {
              position: targetPos
            }).call(() => {
              delete minion._tweenTarget; // 移动完成后切换为 Idle

              minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
                error: Error()
              }), MinionStateEnum) : MinionStateEnum).Idle);
            }).start();
            this._spawnTimer = 0;
          }
        }

        // 追踪正在出门的小兵
        // === 完整 goOutMinion 方法 ===
        goOutMinion() {
          if (this._isDeliveringMinion) return;
          if (this.node.children.length <= 0) return;
          const validWeapons = this.minionWeaponCon.children.filter(w => w["__delivered"] && !w["__used"]);
          if (validWeapons.length <= 0) return;
          this._isDeliveringMinion = true;
          const weapon = validWeapons[validWeapons.length - 1];

          if (!(weapon != null && weapon.isValid)) {
            this._isDeliveringMinion = false;
            return;
          }

          const minion = this.node.children[0];

          if (!(minion != null && minion.isValid)) {
            this._isDeliveringMinion = false;
            return;
          }

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isAllMinionsPassed = false; // 延迟标记为“已使用”，防止出列过早

          weapon["__used"] = true;
          const weaponStart = weapon.getWorldPosition();
          const minionWorld = minion.getWorldPosition();
          const weaponTarget = minionWorld.clone().add(new Vec3(0, 2, 0));
          const controlPoint = new Vec3((weaponStart.x + weaponTarget.x) / 2, Math.max(weaponStart.y, weaponTarget.y) + 5, (weaponStart.z + weaponTarget.z) / 2); // 先放到世界空间中进行动画

          weapon.setParent(this.node.parent);
          weapon.setWorldPosition(weaponStart);
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGameEnd) return;
          const controller = {
            t: 0
          };
          tween(controller).to(0.4, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => {
              if (!(weapon != null && weapon.isValid)) return;
              const t = controller.t;
              const oneMinusT = 1 - t;
              const pos = new Vec3(oneMinusT * oneMinusT * weaponStart.x + 2 * oneMinusT * t * controlPoint.x + t * t * weaponTarget.x, oneMinusT * oneMinusT * weaponStart.y + 2 * oneMinusT * t * controlPoint.y + t * t * weaponTarget.y, oneMinusT * oneMinusT * weaponStart.z + 2 * oneMinusT * t * controlPoint.z + t * t * weaponTarget.z);
              weapon.setWorldPosition(pos);
            }
          }).call(() => {
            var _minion$children$;

            if (weapon) weapon.destroy(); //const worldFinal = weapon.getWorldPosition();
            // weapon.setParent(minion);
            // weapon.setWorldPosition(worldFinal);、
            // 小兵拿到的武器是否是通过传送带传送过来的

            if (weapon && weapon[`__isTransferredWeapons`] && !this.isSettlementInterface) {
              this.isSettlementInterface = true;
              this.scheduleOnce(() => {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.isGameEnd = true;
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.gameEndManager.init();
              }, 1);
            }

            const worldPos = weapon.worldPosition;
            const effectPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).TX_shengjiLZ);
            const skillExplosion = instantiate(effectPrefab);
            director.getScene().addChild(skillExplosion);
            skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y, worldPos.z));
            const anim = skillExplosion == null ? void 0 : skillExplosion.getComponent(Animation);

            if (anim) {
              anim.play(`TX_shengjiLZ`);
              anim.once(Animation.EventType.FINISHED, () => {
                skillExplosion.destroy();
              });
            } else {
              // 没动画时，延迟回收
              this.scheduleOnce(() => {
                skillExplosion.destroy();
              }, 1);
            } // 出列：小兵移动准备


            minion.setParent(this.lookingMonsterMinionCon);
            const minionManager = minion.children[0].getComponent(_crd && MinionManager === void 0 ? (_reportPossibleCrUseOfMinionManager({
              error: Error()
            }), MinionManager) : MinionManager);
            if (minionManager) minionManager.changState((_crd && MinionStateEnum === void 0 ? (_reportPossibleCrUseOfMinionStateEnum({
              error: Error()
            }), MinionStateEnum) : MinionStateEnum).Walk);
            const geometry = minion == null || (_minion$children$ = minion.children[0]) == null ? void 0 : _minion$children$.getChildByName("Geometry");

            if (geometry) {
              geometry.active = true;
            }

            const route = this.exitRoute;
            let moveChain = tween(minion);

            this._activeMovingMinions.add(minion); // ➕ 追踪当前出门小兵


            for (let i = 0; i < route.length; i++) {
              const target = route[i].clone();

              if (i === 2) {
                target.z += Math.random() * 20;
              }

              moveChain = moveChain.call(() => {
                const currentPos = minion.getWorldPosition();
                const dir = new Vec3();
                Vec3.subtract(dir, target, currentPos);
                dir.y = 0;
                dir.normalize();
                const targetAngle = Math.atan2(dir.x, dir.z) * 180 / Math.PI;
                tween(minion).to(0.3, {
                  eulerAngles: new Vec3(0, targetAngle, 0)
                }, {
                  easing: 'sineInOut'
                }).start();

                if (i === 2) {
                  const bSide = find("ThreeDNode/Map/Fences/Scene1/BSide");
                  const bDoor = bSide == null ? void 0 : bSide.getChildByName("B_Door");

                  if (bDoor) {
                    const doorL = bDoor.getChildByName("Door_Left");
                    const doorR = bDoor.getChildByName("Door_Right");
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.player.getComponent(_crd && Actor === void 0 ? (_reportPossibleCrUseOfActor({
                      error: Error()
                    }), Actor) : Actor).openDoorBySide(doorL, doorR, "B");
                  }
                }
              }).to(Vec3.distance(minion.getWorldPosition(), target) / this.moveSpeed, {
                worldPosition: target
              }, {
                easing: 'linear'
              });
            }

            moveChain.call(() => {
              var _this$soldiersChasing;

              // ✅ 出门完成，从追踪集合中移除
              this._activeMovingMinions.delete(minion); // ✅ 所有出门小兵完成，才关门


              if (this._activeMovingMinions.size === 0) {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.isAllMinionsPassed = true;
                const bSide = find("ThreeDNode/Map/Fences/Scene1/BSide");
                const bDoor = bSide == null ? void 0 : bSide.getChildByName("B_Door");

                if (bDoor) {
                  const doorL = bDoor.getChildByName("Door_Left");
                  const doorR = bDoor.getChildByName("Door_Right");
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.player.getComponent(_crd && Actor === void 0 ? (_reportPossibleCrUseOfActor({
                    error: Error()
                  }), Actor) : Actor).closeDoorBySide(doorL, doorR, "B", true);
                }
              }

              (_this$soldiersChasing = this.soldiersChasingMonsters) == null || _this$soldiersChasing.call(this, minion);
            }).start();
            this.scheduleOnce(() => {
              this._isDeliveringMinion = false;
              this.goOutMinion(); // 自动继续下一个
            }, this._deliverInterval);
          }).start();
        } // 兵，追怪


        soldiersChasingMonsters(minion) {
          // console.log(`${minion.name} 开始追击`);
          const minionManager = minion.children[0].getComponent(_crd && MinionManager === void 0 ? (_reportPossibleCrUseOfMinionManager({
            error: Error()
          }), MinionManager) : MinionManager);
          minionManager.isLookingForMonsters = true;
          minionManager.init();
        }

        addMonsterTarget(node) {
          this._targetMonsters.push(node); //console.log(`增加目标 ${node.uuid}`);

        }

        removeMonsterTarget(node) {
          let index = this._targetMonsters.indexOf(node);

          if (index >= 0) {
            this._targetMonsters.splice(index, 1); //console.log(`移除目标 ${node.uuid}`);

          } else {
            if (node) {// console.log(`目标 ${node.uuid} 不存在`);
            } else {// console.log(`目标为空`);
            }
          }
        }

        hasTarget(node) {
          return this._targetMonsters.indexOf(node) !== -1;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "minionWeaponCon", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lookingMonsterMinionCon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "monsterParent", [_dec4], {
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
//# sourceMappingURL=c78859100e50dfdc820a62a1e338b9d9e530f299.js.map