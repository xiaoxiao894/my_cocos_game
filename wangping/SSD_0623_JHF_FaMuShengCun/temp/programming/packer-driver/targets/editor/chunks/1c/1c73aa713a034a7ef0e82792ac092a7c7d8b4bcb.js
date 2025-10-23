System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Collider, Component, director, find, Mat4, Node, RigidBody, SkeletalAnimation, tween, Vec3, Actor, StateDefine, VirtualInput, DataManager, SoundManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, requireComponent, PlayerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfActor(extras) {
    _reporterNs.report("Actor", "./Actor", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStateDefine(extras) {
    _reporterNs.report("StateDefine", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVirtualInput(extras) {
    _reporterNs.report("VirtualInput", "../Input/VirtuallInput", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../Common/SoundManager", _context.meta, extras);
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
      Collider = _cc.Collider;
      Component = _cc.Component;
      director = _cc.director;
      find = _cc.find;
      Mat4 = _cc.Mat4;
      Node = _cc.Node;
      RigidBody = _cc.RigidBody;
      SkeletalAnimation = _cc.SkeletalAnimation;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Actor = _unresolved_2.Actor;
    }, function (_unresolved_3) {
      StateDefine = _unresolved_3.StateDefine;
    }, function (_unresolved_4) {
      VirtualInput = _unresolved_4.VirtualInput;
    }, function (_unresolved_5) {
      DataManager = _unresolved_5.DataManager;
    }, function (_unresolved_6) {
      SoundManager = _unresolved_6.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e9f5a61GMVKeoB82UcFAOgT", "PlayerManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'AnimationClip', 'AnimationState', 'Collider', 'Component', 'director', 'find', 'instantiate', 'Mat4', 'Node', 'Pool', 'Quat', 'RigidBody', 'SkeletalAnimation', 'SkeletalAnimationComponent', 'tween', 'Vec3']);

      ({
        ccclass,
        property,
        requireComponent
      } = _decorator);

      _export("PlayerManager", PlayerManager = (_dec = ccclass('PlayerManager'), _dec2 = requireComponent(_crd && Actor === void 0 ? (_reportPossibleCrUseOfActor({
        error: Error()
      }), Actor) : Actor), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = _dec2(_class = (_class2 = class PlayerManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "monster", _descriptor, this);

          _initializerDefineProperty(this, "coinTransitionCon", _descriptor2, this);

          this.actor = null;
          this._attackDuration = 0.48;
          this._attackTimer = 0;
          this._isAttacking = false;
          this._isWalkAttack = false;
          this._uncollectedWood = [];
          // 背包是否有金币
          this._hasGoldCoin = false;
          this.trees = null;
          // 走路攻击特效
          this._isAttackPlaying = false;
          this._uncollectedIcon = [];
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player = this;
          this.actor = this.node.getComponent(_crd && Actor === void 0 ? (_reportPossibleCrUseOfActor({
            error: Error()
          }), Actor) : Actor);
        }

        onDestroy() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager.hitEffectPrefabPool.destroy();
        }

        create() {
          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager.hitEffectPrefabPool) return;
          let node = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager.hitEffectPrefabPool.alloc();

          if (node.parent == null) {
            director.getScene().addChild(node);
          }

          node.active = true;
          return node;
        }

        onProjectileDead(node) {
          node.active = false;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager.hitEffectPrefabPool.free(node);
        }

        update(deltaTime) {
          var _this$node;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGetCoins) {// this.getCoin(deltaTime);
          } // 获取木材


          this.getWoods(deltaTime);
          if (this.actor.currentState === (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Die) return;
          this.trees = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchTreeManager.getAttackTargets(this.node, 4, 360, true);
          const jackParent = (_this$node = this.node) == null ? void 0 : _this$node.getChildByName("JackParent");
          const playerJack = jackParent == null ? void 0 : jackParent.getChildByName("Player_Jack");
          const shanxing = playerJack.getChildByName("shanxing");

          if (shanxing && this.trees && this.trees.length > 0) {
            shanxing.active = true;
          } else {
            shanxing.active = false;
          } // 3.1   71


          this.trees = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchTreeManager.getAttackTargets(this.node, 3.5, 110, true);
          const hasMonsters = this.trees && this.trees.length > 0;
          const len = this.handleInput(); // 攻击时计时控制

          if (this._isAttacking) {
            this._attackTimer += deltaTime;

            if (this._attackTimer >= this._attackDuration) {
              this._isAttacking = false;
              this._attackTimer = 0;
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.isNormalAttacking = true;
            }
          } // 攻击逻辑（触发一次）


          if (!this._isAttacking && hasMonsters && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isNormalAttacking && len < 0.1) {
            this._isAttacking = true;
            this._attackTimer = 0;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.isNormalAttacking = false;
            this.actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
              error: Error()
            }), StateDefine) : StateDefine).Attack); // this.pauseAttackEffect(); // 可选：播放攻击特效
          } // === 动画状态管理 ===


          if (!this._isAttacking) {
            if (len > 0.1) {
              this.actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                error: Error()
              }), StateDefine) : StateDefine).Walk);
              (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                error: Error()
              }), SoundManager) : SoundManager).inst.playRunBGM();
            } else {
              (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                error: Error()
              }), SoundManager) : SoundManager).inst.stopRunBGM();

              if (hasMonsters) {
                this.actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                  error: Error()
                }), StateDefine) : StateDefine).Attack);
              } else {
                var _skeletalAnim$clips$;

                // === 空闲状态动画处理（骨骼动画冻结一帧） ===
                const jackParent = this.node.getChildByName("JackParent");
                const jackParentAni = jackParent == null ? void 0 : jackParent.getComponent(Animation);

                if (jackParentAni) {
                  const idleState = jackParentAni.getState("idleA");

                  if (idleState && !idleState.isPlaying) {
                    jackParentAni.play("idleA");
                  }
                }

                const jack = jackParent.getChildByName("Player_Jack");
                const skeletalAnim = jack.getComponent(SkeletalAnimation);
                if (!skeletalAnim) return;
                const clipName = (_skeletalAnim$clips$ = skeletalAnim.clips[0]) == null ? void 0 : _skeletalAnim$clips$.name;
                if (!clipName) return; // 播放一次动画以初始化动画状态

                skeletalAnim.play(clipName);
                const state = skeletalAnim.getState(clipName);
                if (!state) return;
                state.update(0); // 强制立即应用该时间的骨骼姿势

                state.pause();
              }
            }
          } else {
            if (len > 0.1 && !hasMonsters) {
              this.actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                error: Error()
              }), StateDefine) : StateDefine).Walk);
              this._isAttacking = false;
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.isNormalAttacking = true;
            }
          }
        } // 停顿攻击特效


        pauseAttackEffect() {
          // DataManager.Instance.soundManager.PlayerAttackSoundPlay();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.affectedTrees(this.trees, true, this.node);
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).inst.playAudio("Sounds_famutou_rensheng");
        }

        _onAttackFinished(anim, state) {
          if (state.name === "TX_Attack") {
            const jackParent = this.node.getChildByName("JackParent");
            const jack = jackParent.getChildByName("Player_Jack");
            const txWalkAttack = jack.getChildByName("TX_attack");
            txWalkAttack.active = false;

            if (this._isWalkAttack) {
              this._isWalkAttack = false; // this.walkingAttackEffects();
            }
          }
        }

        walkingAttackEffects() {
          if (this._isAttackPlaying) return;
          this._isAttackPlaying = true;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.affectedTrees(this.trees, true, this.node);
        }

        _onWalkAttackFinished() {
          this._isAttackPlaying = false;
          const jackParent = this.node.getChildByName("JackParent");
          const jack = jackParent.getChildByName("jack");
          const txWalkAttack = jack.getChildByName("TX_walk_attack");
          txWalkAttack.active = false;
        }

        handleInput() {
          const x = (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).horizontal;
          const y = (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).vertical;

          if (x === 0 && y === 0) {
            this.actor.destForward.set(0, 0, 0);
            return 0;
          }

          const camNode = find("Main Camera"); // 获取摄像机的世界旋转（四元数）

          const camRot = camNode.getWorldRotation(); // 从旋转计算 forward（z轴）和 right（x轴）

          const forward = new Vec3(0, 0, -1);
          const right = new Vec3(1, 0, 0);
          Vec3.transformQuat(forward, forward, camRot);
          Vec3.transformQuat(right, right, camRot); // 只保留水平分量

          forward.y = 0;
          right.y = 0;
          forward.normalize();
          right.normalize(); // 将摇杆输入转换为世界方向

          const moveDir = new Vec3();
          Vec3.scaleAndAdd(moveDir, moveDir, right, x); // x轴影响

          Vec3.scaleAndAdd(moveDir, moveDir, forward, y); // y轴影响（注意：-y 表示前）

          moveDir.normalize();
          this.actor.destForward.set(moveDir.x, 0, moveDir.z);
          return moveDir.length();
        } // 获取木桩


        getWoods(dt) {
          const woodList = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.woodManager.getWood();
          const player = this.node;
          const backpack1 = player.getChildByName("Backpack1");
          const backpack2 = player.getChildByName("Backpack2");
          const backpack3 = player.getChildByName("Backpack3");
          const backpacks = [backpack1, backpack2, backpack3];

          const findTargetBackpack = wood => {
            let matched = null;
            let empty = null;

            for (const backpack of backpacks) {
              if (!backpack) continue;
              const children = backpack.children;

              if (children.length === 0 && !empty) {
                empty = backpack;
              } else {
                for (const child of children) {
                  if (child.name === wood.name) {
                    matched = backpack;
                    break;
                  }
                }
              }

              if (matched) break;
            }

            return matched || empty || backpacks[0];
          };

          const playerPos = player.worldPosition.clone();
          const maxDistanceXZ = 33;
          const allwoods = [...woodList, ...this._uncollectedWood];
          this._uncollectedWood = [];
          let delayCounter = 0;

          for (let i = 0; i < allwoods.length; i++) {
            const wood = allwoods[i];
            if (!wood || !wood.isValid) continue;
            const woodPos = wood.worldPosition.clone();
            const dx = woodPos.x - playerPos.x;
            const dz = woodPos.z - playerPos.z;
            const distSqrXZ = dx * dx + dz * dz;

            if (distSqrXZ > maxDistanceXZ * maxDistanceXZ) {
              this._uncollectedWood.push(wood);

              continue;
            }

            const targetBackpack = findTargetBackpack(wood);
            if (!targetBackpack) continue;
            const start = woodPos;
            const duration = 0.6;
            const controller = {
              t: 0
            };
            wood.setParent(this.node.parent);
            wood.setWorldPosition(start);
            const woodCollider = wood.getComponent(Collider);

            if (woodCollider) {
              woodCollider.enabled = false;
            }

            const woodRigidBody = wood.getComponent(RigidBody);

            if (woodRigidBody) {
              woodRigidBody.enabled = false;
            }

            const startRot = wood.eulerAngles.clone(); // 初始角度

            const endRot = new Vec3(0, 0, 90); // 最终角度

            tween(controller).delay(delayCounter * 0.05).to(duration, {
              t: 1
            }, {
              easing: 'quadOut',
              onUpdate: () => {
                const t = controller.t;
                const oneMinusT = 1 - t; // 计算当前目标背包的堆叠高度

                let maxY = 0;

                for (const child of targetBackpack.children) {
                  if (!child || !child.isValid) continue;
                  const localPos = child.getPosition();

                  if (localPos.y > maxY) {
                    maxY = localPos.y;
                  }
                }

                const localTarget = new Vec3(0, maxY + 0.5, 0); // 背包的世界变换矩阵

                const worldPos = targetBackpack.getWorldPosition();
                const worldRot = targetBackpack.getWorldRotation();
                const worldScale = targetBackpack.getWorldScale();
                const worldMat = new Mat4();
                Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
                const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat); // 控制点

                const control = new Vec3((start.x + worldTarget.x) / 2, Math.max(start.y, worldTarget.y) + 2, (start.z + worldTarget.z) / 2); // 贝塞尔插值

                const pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z);
                wood.setWorldPosition(pos); // === 插值角度 ===

                const lerpedEuler = new Vec3(startRot.x * oneMinusT + endRot.x * t, startRot.y * oneMinusT + endRot.y * t, startRot.z * oneMinusT + endRot.z * t);
                wood.eulerAngles = lerpedEuler;
              }
            }).call(() => {
              const finalWorldPos = wood.getWorldPosition().clone();
              wood.setParent(targetBackpack);
              wood.setWorldPosition(finalWorldPos);
              tween(wood).to(0.15, {
                scale: new Vec3(1.2, 1.2, 1.2)
              }, {
                easing: 'quadOut'
              }).to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).start(); // 数目的数量;

              (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
                error: Error()
              }), SoundManager) : SoundManager).inst.playAudio("Sounds_mutou_shiqu");
            }).start();
            delayCounter++;
          }
        }

        // getCoin(dt) {
        //     const iconList = DataManager.Instance.monsterManager.getDrops();
        //     const player = DataManager.Instance.player;
        //     if (!player) return;
        //     const backpacks = [
        //         player.node.getChildByName("Backpack1"),
        //         player.node.getChildByName("Backpack2"),
        //         player.node.getChildByName("Backpack3"),
        //     ];
        //     // 辅助函数：根据图标找到合适的背包
        //     const findTargetBackpack = (icon: Node): Node | null => {
        //         let matched: Node | null = null;
        //         let empty: Node | null = null;
        //         for (const backpack of backpacks) {
        //             if (!backpack) continue;
        //             const children = backpack.children;
        //             if (children.length === 0 && !empty) {
        //                 empty = backpack;
        //             } else {
        //                 for (const child of children) {
        //                     if (child.name === icon.name) {
        //                         matched = backpack;
        //                         break;
        //                     }
        //                 }
        //             }
        //             if (matched) break;
        //         }
        //         return matched || empty || backpacks[0];
        //     };
        //     const playerPos = player.node.worldPosition.clone();
        //     const maxDistanceXZ = 100;
        //     const allIcons: Node[] = [...iconList, ...this._uncollectedIcon];
        //     this._uncollectedIcon = [];
        //     let delayCounter = 0;
        //     for (let i = 0; i < allIcons.length; i++) {
        //         const icon = allIcons[i];
        //         if (!icon || !icon.isValid) continue;
        //         const iconPos = icon.worldPosition.clone();
        //         const dx = iconPos.x - playerPos.x;
        //         const dz = iconPos.z - playerPos.z;
        //         const distSqrXZ = dx * dx + dz * dz;
        //         if (distSqrXZ > maxDistanceXZ * maxDistanceXZ) {
        //             this._uncollectedIcon.push(icon);
        //             continue;
        //         }
        //         const targetBackpack = findTargetBackpack(icon);
        //         if (!targetBackpack) continue;
        //         const start = iconPos;
        //         const duration = 0.6;
        //         const controller = { t: 0 };
        //         icon.setParent(this.coinTransitionCon);
        //         icon.setWorldPosition(start);
        //         SoundManager.inst.playAudio("YX_jinbi_shiqu");
        //         tween(controller)
        //             .delay(delayCounter * 0.05)
        //             .to(duration, { t: 1 }, {
        //                 easing: 'quadOut',
        //                 onUpdate: () => {
        //                     const t = controller.t;
        //                     const oneMinusT = 1 - t;
        //                     // 计算当前目标背包的堆叠高度
        //                     let maxY = 0;
        //                     for (const child of targetBackpack.children) {
        //                         if (!child || !child.isValid) continue;
        //                         const localPos = child.getPosition();
        //                         if (localPos.y > maxY) {
        //                             maxY = localPos.y;
        //                         }
        //                     }
        //                     const localTarget = new Vec3(0, maxY + 0.25, 0);
        //                     // 背包的世界变换矩阵
        //                     const worldPos = targetBackpack.getWorldPosition();
        //                     const worldRot = targetBackpack.getWorldRotation();
        //                     const worldScale = targetBackpack.getWorldScale();
        //                     const worldMat = new Mat4();
        //                     Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
        //                     const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);
        //                     // 控制点
        //                     const control = new Vec3(
        //                         (start.x + worldTarget.x) / 2,
        //                         Math.max(start.y, worldTarget.y) + 2,
        //                         (start.z + worldTarget.z) / 2
        //                     );
        //                     // 贝塞尔插值
        //                     const pos = new Vec3(
        //                         oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x,
        //                         oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y,
        //                         oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z
        //                     );
        //                     icon.setWorldPosition(pos);
        //                 }
        //             })
        //             .call(() => {
        //                 const finalWorldPos = icon.getWorldPosition().clone();
        //                 icon.setParent(targetBackpack);
        //                 icon.setWorldPosition(finalWorldPos);
        //                 tween(icon)
        //                     .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
        //                     .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
        //                     .start();
        //                 if (!this._hasGoldCoin && targetBackpack.children.length > 0) {
        //                     this._hasGoldCoin = true;
        //                     // this.unlockPlot8();
        //                 }
        //                 if (DataManager.Instance.UIPropertyManager) {
        //                     DataManager.Instance.UIPropertyManager.collectProperty();
        //                 }
        //             })
        //             .start();
        //         delayCounter++;
        //     }
        // }
        // 解锁Plot8 
        unlockPlot8() {
          const plot8 = find("THREE3DNODE/Unlock/Plot8");
          plot8.active = true;
          plot8.setScale(0, 0, 0);
          tween(plot8).to(0.15, {
            scale: new Vec3(1.2, 1.2, 1.2)
          }, {
            easing: 'quadOut'
          }).to(0.05, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadOut'
          }).call(() => {
            const data = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
              return item.plot == plot8.name;
            });

            if (data) {
              data.isDisplay = true;
            }
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "monster", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinTransitionCon", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1c73aa713a034a7ef0e82792ac092a7c7d8b4bcb.js.map