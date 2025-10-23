System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Component, director, find, Mat4, Node, SkeletalAnimation, tween, Vec3, Actor, StateDefine, VirtualInput, DataManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _crd, ccclass, property, requireComponent, PlayerManager;

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
      find = _cc.find;
      Mat4 = _cc.Mat4;
      Node = _cc.Node;
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e9f5a61GMVKeoB82UcFAOgT", "PlayerManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'AnimationClip', 'AnimationState', 'Component', 'director', 'find', 'instantiate', 'Mat4', 'Node', 'Pool', 'Quat', 'SkeletalAnimation', 'SkeletalAnimationComponent', 'tween', 'Vec3']);

      ({
        ccclass,
        property,
        requireComponent
      } = _decorator);

      _export("PlayerManager", PlayerManager = (_dec = ccclass('PlayerManager'), _dec2 = requireComponent(_crd && Actor === void 0 ? (_reportPossibleCrUseOfActor({
        error: Error()
      }), Actor) : Actor), _dec3 = property(Node), _dec(_class = _dec2(_class = (_class2 = class PlayerManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "monster", _descriptor, this);

          this.actor = null;
          this.isInLockedState = false;
          this._attackDuration = 0.8;
          this._attackTimer = 0;
          this._isAttacking = false;
          this._isWalkAttack = false;
          this.monsters = null;
          // 走路攻击特效
          this._isAttackPlaying = false;
          // 获取肉  // 这里还需要
          this._uncollectedMeat = [];
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
          var node = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
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
          this.getIcon(deltaTime);
          if (this.actor.currentState === (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
            error: Error()
          }), StateDefine) : StateDefine).Die) return;
          this.monsters = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchMonsters.getAttackTargets(this.node, 10, 360);
          var hasMonsters = this.monsters && this.monsters.length > 0;
          var len = this.handleInput(); // 攻击时计时控制

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
              this.actor.changState(hasMonsters ? (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                error: Error()
              }), StateDefine) : StateDefine).Walk_attack : (_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                error: Error()
              }), StateDefine) : StateDefine).Walk);
            } else {
              if (hasMonsters) {
                this.actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                  error: Error()
                }), StateDefine) : StateDefine).Attack);
              } else {
                var _skeletalAnim$clips$;

                // === 空闲状态动画处理（骨骼动画冻结一帧） ===
                var jackParent = this.node.getChildByName("JackParent");
                var jackParentAni = jackParent == null ? void 0 : jackParent.getComponent(Animation);

                if (jackParentAni) {
                  var idleState = jackParentAni.getState("idleA");

                  if (idleState && !idleState.isPlaying) {
                    jackParentAni.play("idleA");
                  }
                }

                var jack = jackParent.getChildByName("jack");
                var skeletalAnim = jack.getComponent(SkeletalAnimation);
                if (!skeletalAnim) return;
                var clipName = (_skeletalAnim$clips$ = skeletalAnim.clips[0]) == null ? void 0 : _skeletalAnim$clips$.name;
                if (!clipName) return; // 播放一次动画以初始化动画状态

                skeletalAnim.play(clipName);
                var state = skeletalAnim.getState(clipName);
                if (!state) return;
                state.update(0); // 强制立即应用该时间的骨骼姿势

                state.pause();
              }
            }
          } else {
            if (len > 0.1) {
              this.actor.changState((_crd && StateDefine === void 0 ? (_reportPossibleCrUseOfStateDefine({
                error: Error()
              }), StateDefine) : StateDefine).Walk_attack);
              this._isWalkAttack = true;
            } // 不移动时不切状态，等待攻击动画播放完

          }
        } // 怪受


        monsterHitEffect(monsters) {
          var _this = this;

          var _loop = function _loop() {
            var monster = monsters[i];

            var effect = _this.create();

            if (!effect) return 1; // continue
            // 设置特效位置为怪物当前位置

            var pos = monster.getWorldPosition();
            pos.y = pos.y + 3;
            pos.x = pos.x + 1;
            effect.setWorldPosition(pos); // 播放动画（假设节点下有 Animation 组件）

            var sprite = effect.getChildByName("Sprite");
            var effectAnim = sprite.getComponent(Animation);

            if (effectAnim && effectAnim.defaultClip) {
              effectAnim.play("TX_Attack_hit"); // 动画结束后回收

              effectAnim.once(Animation.EventType.FINISHED, () => {
                _this.onProjectileDead(effect);
              });
            } else {
              // 如果没动画直接延迟销毁
              setTimeout(() => {
                _this.onProjectileDead(effect);
              }, 1000);
            }
          };

          for (var i = 0; i < monsters.length; i++) {
            if (_loop()) continue;
          }
        } // 停顿攻击特效


        pauseAttackEffect() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.PlayerAttackSoundPlay();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.killMonsters(this.monsters, true);
          var jackParent = this.node.getChildByName("JackParent");
          var jack = jackParent.getChildByName("jack");
          var txWalkAttack = jack.getChildByName("TX_attack");
          txWalkAttack.active = true;
          var attackSprite = txWalkAttack.getChildByName("Sprite");

          if (attackSprite) {
            var walkAttackAni = attackSprite.getComponent(Animation);

            if (walkAttackAni) {
              walkAttackAni.once(Animation.EventType.FINISHED, this._onAttackFinished, this);
              walkAttackAni.play("TX_Attack");
            }
          }
        }

        _onAttackFinished(anim, state) {
          if (state.name === "TX_Attack") {
            var jackParent = this.node.getChildByName("JackParent");
            var jack = jackParent.getChildByName("jack");
            var txWalkAttack = jack.getChildByName("TX_attack");
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
          }), DataManager) : DataManager).Instance.soundManager.PlayerAttackSoundPlay();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.killMonsters(this.monsters, true);
          var jackParent = this.node.getChildByName("JackParent");
          var jack = jackParent.getChildByName("jack");
          var txWalkAttack = jack.getChildByName("TX_walk_attack");
          txWalkAttack.active = true;
          var walkAttackSprite = txWalkAttack.getChildByName("Sprite");

          if (walkAttackSprite) {
            var walkAttackAni = walkAttackSprite.getComponent(Animation);

            if (walkAttackAni) {
              walkAttackAni.stop();
              walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this);
              walkAttackAni.play("TX_Attack");
            }
          }
        }

        _onWalkAttackFinished() {
          this._isAttackPlaying = false;
          var jackParent = this.node.getChildByName("JackParent");
          var jack = jackParent.getChildByName("jack");
          var txWalkAttack = jack.getChildByName("TX_walk_attack");
          txWalkAttack.active = false;
        }

        handleInput() {
          var x = (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).horizontal;
          var y = (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).vertical;

          if (x === 0 && y === 0) {
            this.actor.destForward.set(0, 0, 0);
            return 0;
          }

          var camNode = find("Main Camera"); // 获取摄像机的世界旋转（四元数）

          var camRot = camNode.getWorldRotation(); // 从旋转计算 forward（z轴）和 right（x轴）

          var forward = new Vec3(0, 0, -1);
          var right = new Vec3(1, 0, 0);
          Vec3.transformQuat(forward, forward, camRot);
          Vec3.transformQuat(right, right, camRot); // 只保留水平分量

          forward.y = 0;
          right.y = 0;
          forward.normalize();
          right.normalize(); // 将摇杆输入转换为世界方向

          var moveDir = new Vec3();
          Vec3.scaleAndAdd(moveDir, moveDir, right, x); // x轴影响

          Vec3.scaleAndAdd(moveDir, moveDir, forward, y); // y轴影响（注意：-y 表示前）

          moveDir.normalize();
          this.actor.destForward.set(moveDir.x, 0, moveDir.z);
          return moveDir.length();
        } // 获取主角朝向


        getForwardVector(node) {
          var forward = new Vec3(0, 0, -1);
          return Vec3.transformQuat(new Vec3(), forward, node.getRotation()).normalize();
        }

        getIcon(dt) {
          var _this2 = this;

          var newMeats = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.getDrops();
          var player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player;
          if (!player) return;
          var backpack1 = player.node.getChildByName("Backpack1");
          if (!backpack1) return;
          var playerPos = player.node.worldPosition.clone();
          var maxDistanceXZ = 33; // 合并新掉落 + 上次未收集的

          var allMeats = [...newMeats, ...this._uncollectedMeat];
          this._uncollectedMeat = []; // 本轮清空，重新判断收集

          var delayCounter = 0;

          var _loop2 = function _loop2() {
            var meat = allMeats[i];
            if (!meat || !meat.isValid) return 0; // continue

            var meatPos = meat.worldPosition.clone();
            var dx = meatPos.x - playerPos.x;
            var dz = meatPos.z - playerPos.z;
            var distSqrXZ = dx * dx + dz * dz; // 超出范围：暂存等待下一次

            if (distSqrXZ > maxDistanceXZ * maxDistanceXZ) {
              _this2._uncollectedMeat.push(meat);

              return 0; // continue
            } // === 贝塞尔飞行动画 ===


            var start = meatPos;
            var duration = 0.6;
            var controller = {
              t: 0
            };
            meat.setParent(_this2.node.parent);
            meat.setWorldPosition(start);
            tween(controller).delay(delayCounter * 0.05) // 用 delayCounter 替代 i，避免跳过后间隔混乱
            .to(duration, {
              t: 1
            }, {
              easing: 'quadOut',
              onUpdate: () => {
                var t = controller.t;
                var oneMinusT = 1 - t; // 当前背包堆叠高度

                var maxY = 0;

                for (var j = 0; j < backpack1.children.length; j++) {
                  var child = backpack1.children[j];
                  if (!child || !child.isValid) continue;
                  var localPos = child.getPosition();

                  if (localPos.y > maxY) {
                    maxY = localPos.y;
                  }
                }

                var localTarget = new Vec3(0, maxY + 0.5, 0);
                var worldPos = backpack1.getWorldPosition();
                var worldRot = backpack1.getWorldRotation();
                var worldScale = backpack1.getWorldScale();
                var worldMat = new Mat4();
                Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
                var worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);
                var control = new Vec3((start.x + worldTarget.x) / 2, Math.max(start.y, worldTarget.y) + 2, (start.z + worldTarget.z) / 2);
                var pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z);
                meat.setWorldPosition(pos);
              }
            }).call(() => {
              var finalWorldPos = meat.getWorldPosition().clone();
              meat.setParent(backpack1);
              meat.setWorldPosition(finalWorldPos);
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager.playIconSound();
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.UIPropertyManager.collectProperty();
            }).start();
            delayCounter++;
          },
              _ret;

          for (var i = 0; i < allMeats.length; i++) {
            _ret = _loop2();
            if (_ret === 0) continue;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "monster", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=52132d8b12aae053c70f3bad59b64037bc43f841.js.map