System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Collider, Component, instantiate, RigidBody, tween, Vec3, DataManager, EntityTypeEnum, _dec, _class, _crd, ccclass, property, ItemTreeManager;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      RigidBody = _cc.RigidBody;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fdba9zyI6JMG7MAGbRoVZfS", "ItemTreeManager", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'AsyncDelegate', 'Collider', 'Component', 'find', 'instantiate', 'Node', 'RigidBody', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemTreeManager", ItemTreeManager = (_dec = ccclass('ItemTreeManager'), _dec(_class = class ItemTreeManager extends Component {
        constructor() {
          super(...arguments);
          // 最大攻击数
          this.maxAttackNum = 3;
          // 当前攻击数
          this._curAttackNum = 0;
          // 是否被
          this.isBeingCutDown = false;
          this._isAniPlaying = false;
          this._crookedTween = void 0;
          this._index = -1;
        }

        init(index) {
          this._index = index;
        }

        get Index() {
          return this._index;
        } // 受击动画


        affectedAni(isPlayer, role) {
          if (isPlayer === void 0) {
            isPlayer = false;
          }

          if (this.isBeingCutDown) {
            return;
          }

          this._curAttackNum++;
          this.attackTreeAni(this._curAttackNum); //动画

          var amplitude = 10;
          var treePos = this.node.worldPosition.clone();
          var playerPos = role.worldPosition.clone();
          var direction = playerPos.subtract(treePos).normalize(); // Convert direction to euler angles (only using x and z for leaning)

          var leanAngle = new Vec3(direction.x * amplitude, 0, direction.z * amplitude);
          var fanLeanAngle = new Vec3(direction.x * -5, 0, direction.z * -5);
          this._isAniPlaying = true;

          if (this._crookedTween) {
            this._crookedTween.stop();
          }

          tween(this.node).to(0.08, {
            eulerAngles: leanAngle
          }).to(0.12, {
            eulerAngles: fanLeanAngle
          }).to(0.04, {
            eulerAngles: new Vec3(0, 0, 0)
          }).call(() => {
            this._isAniPlaying = false;
          }).start();

          if (this._curAttackNum >= this.maxAttackNum) {
            this.isBeingCutDown = true; // 可以去找其他不在区域内的树

            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.curCutDownTree++;

            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.curCutDownTree >= 56) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.searchTreeManager.searchNumber = 100;
            } // 清理自身的刚体


            var ssdTree = this.node.getChildByName("SSDshu");

            if (ssdTree) {
              var boxCollider = ssdTree.getComponent(Collider);

              if (boxCollider) {
                boxCollider.enabled = false;
              }

              var rigidBody = ssdTree.getComponent(RigidBody);

              if (rigidBody) {
                rigidBody.enabled = false;
              }
            } // const tree = this.node.getChildByPath("angleNode/shu");
            // tree.active = false;


            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.gridSystem.removeNode(this.node);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.woodManager.generateWoods(isPlayer, this.node, role);
            var {
              r,
              c
            } = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.treeManager.findRemoveTree(this.node);
            if (r === -1) return; // 保存当前树的位置和旋转

            var oldTreePos = this.node.getWorldPosition().clone();
            var oldTreeRot = this.node.getRotation().clone();
            var oldParent = this.node.parent;
            var oldIdx = this.node.parent.children.indexOf(this.node);
            var treeNum = this.node["__treeNum"]; // if (this.node && this.node.isValid) {
            //     this.node.destroy();
            // }
            // 延迟10秒重新生成一棵树

            this.scheduleOnce(() => {
              var treePrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
                error: Error()
              }), EntityTypeEnum) : EntityTypeEnum).Tree);

              if (treePrefab && oldParent) {
                var newTree = instantiate(treePrefab);
                newTree.setWorldPosition(oldTreePos);
                newTree.setRotation(oldTreeRot);
                oldParent.addChild(newTree); // newTree[`__treeNum`] = treeNum;
                // oldParent.insertChild(newTree, oldIdx);

                var newTreeAni = newTree.getComponent(Animation);
                newTreeAni.play();
                newTreeAni.once(Animation.EventType.FINISHED, () => {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.gridSystem.updateNode(newTree);
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.treeMatrix[r][c] = newTree;
                });
              }
            }, 20);
          }
        } // 攻击树动画


        attackTreeAni(curAttackNum) {
          var ssdTree = this.node.getChildByName("SSDshu");

          if (ssdTree) {
            var ssdTreeAni = ssdTree.getComponent(Animation);

            if (ssdTreeAni) {
              if (curAttackNum == 1) {
                ssdTreeAni.play("shuKF001");
              } else if (curAttackNum == 2) {
                ssdTreeAni.play("shuKF002");
              } else if (curAttackNum == 3) {
                ssdTreeAni.play("shuKF003");
              }
            }
          }
        }

        playAni(angle) {
          if (this.isBeingCutDown || this._isAniPlaying) {
            return;
          }

          this._crookedTween = tween(this.node).to(0.2, {
            eulerAngles: angle
          }).to(0.2, {
            eulerAngles: new Vec3(0, 0, 0)
          }).start();
        }

        get isBeingCut() {
          return this.isBeingCutDown;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=46e08bc1ae4af88c6199abd14bfdadcf51f8c31a.js.map