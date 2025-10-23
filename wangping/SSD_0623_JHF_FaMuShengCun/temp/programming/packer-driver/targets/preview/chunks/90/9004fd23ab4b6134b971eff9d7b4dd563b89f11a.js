System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Component, find, Quat, RigidBody, SkeletalAnimation, tween, Vec3, DataManager, PartnerEnum, ItemTreeManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ItemPartnerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPartnerEnum(extras) {
    _reporterNs.report("PartnerEnum", "./StateDefine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStackManager(extras) {
    _reporterNs.report("StackManager", "../StackSlot/StackManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemTreeManager(extras) {
    _reporterNs.report("ItemTreeManager", "../Tree/ItemTreeManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Component = _cc.Component;
      find = _cc.find;
      Quat = _cc.Quat;
      RigidBody = _cc.RigidBody;
      SkeletalAnimation = _cc.SkeletalAnimation;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      PartnerEnum = _unresolved_3.PartnerEnum;
    }, function (_unresolved_4) {
      ItemTreeManager = _unresolved_4.ItemTreeManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e2344v+jV5PiI5xjuGmL0Ti", "ItemPartnerManager", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'Component', 'find', 'Node', 'Quat', 'RigidBody', 'SkeletalAnimation', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemPartnerManager", ItemPartnerManager = (_dec = ccclass('ItemPartnerManager'), _dec2 = property(SkeletalAnimation), _dec(_class = (_class2 = class ItemPartnerManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          this._currentState = null;
          this._attackDistance = 2.2;
          this._moveSpeed = 15;
          this._target = null;
          this._attackCount = 0;
          this._attackCooldown = 2.394;
          this._attackTimer = 0;
          this._deliveryPoint = new Vec3(-10.884, 0, 3.818);
          this._maxCutDownTreeNum = 5;
          this._cutDownTreeNum = 0;
          this._isBusy = false;
          this._startMovePos = null;
          this._deliveryQueue = [];
        }

        update(deltaTime) {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.hasHelperCuttingDownTrees || (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.hasHelperReachDeliveryLocation) return;

          if (this._cutDownTreeNum >= this._maxCutDownTreeNum) {
            this.moveToDeliveryPoint(deltaTime);
            return;
          }

          if (this._target) {
            this.handleTreeApproachAndCut(deltaTime);
          } else if (!this._isBusy) {
            this.updateTargetIfNeeded();

            if (!this._target) {
              this.moveToDeliveryPoint(deltaTime);
            }
          }

          if (this._attackTimer > 0) {
            this._attackTimer -= deltaTime;
          }
        }

        handleTreeApproachAndCut(deltaTime) {
          var selfPos = this.node.worldPosition;
          var targetPos = this._target.worldPosition; // 记录初始移动位置（只记录一次）

          if (!this._startMovePos) {
            this._startMovePos = selfPos.clone();
          }

          var distanceToTarget = Vec3.distance(selfPos, targetPos);

          if (distanceToTarget > this._attackDistance) {
            this.changState((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
              error: Error()
            }), PartnerEnum) : PartnerEnum).Walk);
            this.moveToTarget(targetPos, deltaTime);
          } else {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.hasHelperCuttingDownTrees = true;
            this.changState((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
              error: Error()
            }), PartnerEnum) : PartnerEnum).Attack);

            if (!this._isBusy && this._attackTimer <= 0) {
              this._isBusy = true;
              this._attackTimer = this._attackCooldown;
              this.playAttackAnimation(this._target);
            }
          }
        }

        playAttackAnimation(target) {
          if (!(target != null && target.isValid) || !target.parent || !this.skeletalAnimation) {
            this.removeTarget();
            return;
          }

          var tree = target.getComponent(_crd && ItemTreeManager === void 0 ? (_reportPossibleCrUseOfItemTreeManager({
            error: Error()
          }), ItemTreeManager) : ItemTreeManager);

          if (!tree || tree.isBeingCut) {
            this.removeTarget();
            return;
          } // 第一次攻击动画


          var HIT_DELAY = 0.48; // 1.33 / 2.8;   // 命中点

          var BETWEEN_DELAY = 0.48; // 两次攻击之间的等待
          // 第一次攻击动画

          this.skeletalAnimation.crossFade((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
            error: Error()
          }), PartnerEnum) : PartnerEnum).Attack, 0.1);
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.treeManager.affectedTrees([target], false, this.node);
          }, HIT_DELAY); // 第一次攻击结束 -> 进入第二次

          this.scheduleOnce(() => {
            if (target != null && target.isValid && target.parent) {
              var _tree = target.getComponent(_crd && ItemTreeManager === void 0 ? (_reportPossibleCrUseOfItemTreeManager({
                error: Error()
              }), ItemTreeManager) : ItemTreeManager);

              if (!_tree || _tree.isBeingCut) {
                this.removeTarget();
                return;
              }

              this._attackCount = 1; // 第二次攻击动画

              this.skeletalAnimation.crossFade((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
                error: Error()
              }), PartnerEnum) : PartnerEnum).Attack, 0.1);
              this.scheduleOnce(() => {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.treeManager.affectedTrees([target], false, this.node);
              }, HIT_DELAY); // 第二次命中

              this.scheduleOnce(() => {
                if (target != null && target.isValid && target.parent) {
                  // console.log("===========================> 开始进攻了2");
                  this._attackCount = 2; // —— 第三次攻击开始 —— //

                  this.skeletalAnimation.crossFade((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
                    error: Error()
                  }), PartnerEnum) : PartnerEnum).Attack, 0.1);
                  this.scheduleOnce(() => {
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.treeManager.affectedTrees([target], false, this.node);
                  }, HIT_DELAY);
                  this.scheduleOnce(() => {
                    if (target != null && target.isValid && target.parent) {
                      // console.log("===========================> 开始进攻了3");
                      this._attackCount = 3; // 收尾

                      this._cutDownTreeNum++;
                      this._target = null;
                      this._startMovePos = null;
                      this._isBusy = false;
                      this._attackTimer = 0;
                      (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                        error: Error()
                      }), DataManager) : DataManager).Instance.hasHelperCuttingDownTrees = false; // console.log("砍树完成，总数:", this._cutDownTreeNum);
                    } else {
                      this.removeTarget();
                    }
                  }, BETWEEN_DELAY); // 第三次攻击延迟
                  // —— 第三次攻击结束 —— //
                } else {
                  this.removeTarget();
                }
              }, BETWEEN_DELAY); // 第二次攻击命中延迟（保持你原来的 0.74）
            } else {
              this.removeTarget();
            }
          }, BETWEEN_DELAY); // 第一次攻击结束到第二次攻击开始的延迟
        }

        removeTarget() {
          this._isBusy = false;
          this._target = null;
          this._startMovePos = null;
          this._attackTimer = 0;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.hasHelperCuttingDownTrees = false;
        }

        updateTargetIfNeeded() {
          var trees = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchTreeManager.getAttackTargets(this.node, 100, 360);
          if (!trees || trees.length === 0) return;
          var selfPos = this.node.worldPosition;
          var minDist = Number.MAX_VALUE;
          var selected = null;

          for (var tree of trees) {
            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.claimedTargets.has(tree)) continue;
            var dist = Vec3.distance(tree.worldPosition, selfPos);

            if (dist < minDist && tree.name === "Tree") {
              minDist = dist;
              selected = tree;
            }
          }

          if (selected) {
            this._target = selected;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.claimedTargets.add(selected);
          }
        }

        moveToTarget(targetPos, deltaTime) {
          var selfPos = this.node.worldPosition;
          var dir = new Vec3();
          Vec3.subtract(dir, targetPos, selfPos).normalize();
          var moveDelta = dir.multiplyScalar(this._moveSpeed * deltaTime);
          var newPos = selfPos.clone().add(moveDelta);
          this.node.setWorldPosition(newPos);
          this.lookAtTarget(targetPos);
        }

        changState(state) {
          var _this$skeletalAnimati;

          if (state === this._currentState) return;
          this._currentState = state;
          (_this$skeletalAnimati = this.skeletalAnimation) == null || _this$skeletalAnimati.crossFade(state, 0.1);
        }

        lookAtTarget(targetPos) {
          var partner = this.node;
          if (!partner) return;
          var partnerPos = partner.worldPosition;
          var forward = new Vec3();
          Vec3.subtract(forward, targetPos, partnerPos);
          forward.y = 0;
          forward.normalize(); // 朝向目标方向的旋转

          var rotation = new Quat();
          Quat.fromViewUp(rotation, forward, Vec3.UP); // ✅ 强制设置子节点的世界旋转

          partner.setWorldRotation(rotation);
        }

        moveToDeliveryPoint(deltaTime) {
          var selfPos = this.node.worldPosition;
          var distance = Vec3.distance(selfPos, this._deliveryPoint);

          if (distance > 0.2) {
            var dir = new Vec3();
            Vec3.subtract(dir, this._deliveryPoint, selfPos).normalize();
            this.changState((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
              error: Error()
            }), PartnerEnum) : PartnerEnum).Walk);
            this.node.setWorldPosition(selfPos.clone().add(dir.multiplyScalar(this._moveSpeed * deltaTime)));
            this.lookAtTarget(this._deliveryPoint);
          } else {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.hasHelperReachDeliveryLocation = true;
            this.changState((_crd && PartnerEnum === void 0 ? (_reportPossibleCrUseOfPartnerEnum({
              error: Error()
            }), PartnerEnum) : PartnerEnum).Idle);
            this._cutDownTreeNum = 0;
            this._isBusy = false; // console.log("📦 已到达交付点，清空砍树计数。");
            //  像交付地点交付

            this.startSequentialDelivery();
          }
        }

        startSequentialDelivery() {
          var backpack = this.node.getChildByName("Backpack1");
          if (!backpack) return;
          var children = backpack.children;
          if (children.length === 0) return;
          var to = find("THREE3DNODE/PlacingCon/WoodAccumulationCon");
          if (!to) return;
          var stackManager = to["__stackManager"]; // 从最后一个有效的准备 item 开始

          this._deliveryQueue = [];

          for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];

            if (child != null && child.isValid && child['__isReady']) {
              this._deliveryQueue.push(child);
            }
          }

          if (this._deliveryQueue.length > 0) {
            this._deliverNextItem(to, stackManager);
          }
        }

        _deliverNextItem(to, stackManager) {
          if (this._deliveryQueue.length === 0) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.hasHelperReachDeliveryLocation = false;
            this.updateTargetIfNeeded();
            return;
          }

          var item = this._deliveryQueue.shift();

          if (!item || !item.isValid) {
            this._deliverNextItem(to, stackManager); // 跳过无效


            return;
          }

          var startPos = item.getWorldPosition();
          item.parent = this.node;
          item.setWorldPosition(startPos);
          var slot = stackManager.assignSlot(item);
          if (!slot) return;
          var endPos = stackManager.getSlotWorldPos(slot, to);
          var controlPoint = new Vec3((startPos.x + endPos.x) / 2, Math.max(startPos.y, endPos.y) + 15, (startPos.z + endPos.z) / 2);
          var tParam = {
            t: 0
          };
          tween(tParam).to(0.1, {
            t: 1
          }, {
            onUpdate: () => {
              var t = tParam.t;
              var oneMinusT = 1 - t;
              var current = new Vec3(oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x, oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y, oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z);
              item.setWorldPosition(current);
            },
            onComplete: () => {
              item.eulerAngles = new Vec3(-90, 0, 0);
              var rigidBody = item.getComponent(RigidBody);
              if (rigidBody) rigidBody.enabled = false;
              var collider = item.getComponent(Collider);
              if (collider) collider.enabled = false;
              tween(item).to(0.15, {
                scale: new Vec3(1.2, 1.2, 1.2)
              }, {
                easing: 'quadOut'
              }).to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).start(); // 放入目标父节点并转为局部坐标

              var finalWorldPos = endPos;
              item.setWorldPosition(finalWorldPos);
              item.setParent(to);
              var localPos = new Vec3();
              to.inverseTransformPoint(localPos, finalWorldPos);
              item.setPosition(localPos); // ✅ 延迟 0.3 秒后交付下一个

              this.scheduleOnce(() => {
                this._deliverNextItem(to, stackManager);
              }, 0.03);
            }
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnimation", [_dec2], {
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
//# sourceMappingURL=9004fd23ab4b6134b971eff9d7b4dd563b89f11a.js.map