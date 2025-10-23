System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Node, Quat, Vec3, DataManager, EntityTypeEnum, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, ArrowManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      Component = _cc.Component;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4412ddMw4VA8oeb0clrunSA", "ArrowManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'math', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ArrowManager", ArrowManager = (_dec = ccclass('ArrowManager'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class ArrowManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "arrowNode", _descriptor, this);

          _initializerDefineProperty(this, "target", _descriptor2, this);

          _initializerDefineProperty(this, "spacing", _descriptor3, this);

          this.arrowNodes = [];
        }

        start() {
          // 临时
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrowTargetNode = this.target;
        }

        update(deltaTime) {
          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrowTargetNode && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player && !(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetList) return;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetIndex == -1) {
            const nearestMonster = this.getNearMonster((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.player.node);

            if (nearestMonster) {
              this.createArrowPathTo(nearestMonster.worldPosition);
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, nearestMonster.worldPosition);
              this.conditionalJudgment();
            } else {
              this.setArrowCount(0); // 没有怪，清空箭头

              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.arrow3DManager.node.active = false;
            }

            return;
          } else {
            // 不在找怪
            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.length > 0) {
              const targetData = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guideTargetList.find(item => {
                return item.isDisplay && item.isFind;
              });

              if (targetData) {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(targetData.node.worldPosition);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.playFloatingEffect(deltaTime, targetData.node.worldPosition);
              } else {
                this.setArrowCount(0); // 没有怪，清空箭头

                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.arrow3DManager.node.active = false;
              }
            }
          } // const end = DataManager.Instance.guideTargetList[DataManager.Instance.guideTargetIndex].worldPosition;
          // const dir = new Vec3();
          // Vec3.subtract(dir, end, start);
          // const totalLength = dir.length();
          // if (totalLength < 0.01) {
          //     this.setArrowCount(0);
          //     return;
          // }
          // const count = Math.floor(totalLength / this.spacing);
          // this.setArrowCount(count);
          // dir.normalize();
          // if (this.arrowNodes.length <= 0) return;
          // for (let i = 0; i < count; i++) {
          //     const arrow = this.arrowNodes[i];
          //     const pos = new Vec3();
          //     Vec3.scaleAndAdd(pos, start, dir, this.spacing * i);
          //     arrow.setWorldPosition(pos);
          //     const rot = new Quat();
          //     Quat.fromViewUp(rot, dir, Vec3.UP);
          //     arrow.setWorldRotation(rot);
          // }

        } // 条件判断


        conditionalJudgment() {
          const player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.guideTargetIndex == -1) {
            const backpack1 = player.getChildByName("Backpack1");

            if (backpack1 && backpack1.children.length >= 5) {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.guideTargetIndex++;
            }
          }
        }

        createArrowPathTo(targetPos) {
          var _Instance$player;

          const player = (_Instance$player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player) == null ? void 0 : _Instance$player.node;
          if (!player) return;
          const start = player.worldPosition;
          const dir = new Vec3();
          Vec3.subtract(dir, targetPos, start);
          const totalLength = dir.length();

          if (totalLength < 0.01) {
            this.setArrowCount(0);
            return;
          }

          const count = Math.floor(totalLength / this.spacing);
          this.setArrowCount(count);
          dir.normalize();

          for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            let pos = new Vec3();
            Vec3.scaleAndAdd(pos, start, dir, this.spacing * (i + 1)); // 避免从脚下起始

            pos.y = 1;
            arrow.setWorldPosition(pos);
            const rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
          }
        }

        setArrowCount(targetCount) {
          const prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).PathArrow);
          if (!prefab) return;

          while (this.arrowNodes.length < targetCount) {
            const arrow = instantiate(prefab);
            arrow.setParent(this.node);
            this.arrowNodes.push(arrow);
          }

          while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop();
            arrow.destroy();
          }
        } //  动态获取离主角最近的怪


        getNearMonster(player) {
          const monsterParent = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.monsterParent;
          if (!monsterParent || monsterParent.children.length === 0) return null;
          let nearestMonster = null;
          let minDistSqr = Infinity;
          const playerPos = player.worldPosition;

          for (let i = 0; i < monsterParent.children.length; i++) {
            const monster = monsterParent.children[i];
            if (!monster || !monster.isValid) continue;
            const monsterPos = monster.worldPosition;
            const dx = monsterPos.x - playerPos.x;
            const dz = monsterPos.z - playerPos.z;
            const distSqr = dx * dx + dz * dz;

            if (distSqr < minDistSqr) {
              minDistSqr = distSqr;
              nearestMonster = monster;
            }
          }

          return nearestMonster;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "arrowNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=08a70a073d3add643c39f4e0bf019f03df9c1a0f.js.map