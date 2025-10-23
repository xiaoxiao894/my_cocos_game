System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, math, Node, Vec3, DataManager, ItemTreeManager, EntityTypeEnum, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, TreeManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemTreeManager(extras) {
    _reporterNs.report("ItemTreeManager", "./ItemTreeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTreeAniData(extras) {
    _reporterNs.report("TreeAniData", "../Enum/Index", _context.meta, extras);
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
      math = _cc.math;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      ItemTreeManager = _unresolved_3.ItemTreeManager;
    }, function (_unresolved_4) {
      EntityTypeEnum = _unresolved_4.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c6255R34PxK/5/Ta/xI5ruN", "TreeManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'math', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TreeManager", TreeManager = (_dec = ccclass('TreeManager'), _dec2 = property(Node), _dec(_class = (_class2 = class TreeManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "scatteredTreePoints", _descriptor, this);

          this._treeCount = 0;
          this._treeStartPoint = new Vec3(-36, 0, -16);
          this._treeRow = 14;
          this._treeCol = 4;
          this._frontToBackSpacing = 5.5;
          this._leftToRightSpacing = 5.5;
        }

        get treeSpacingX() {
          return this._leftToRightSpacing;
        }

        get treeSpacingZ() {
          return this._frontToBackSpacing;
        }

        get treeStartPoint() {
          return this._treeStartPoint.clone();
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager = this;
        }

        initTreeSystem() {
          for (let i = 0; i < this.node.children.length; i++) {
            const tree = this.node.children[i];
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.gridSystem.updateNode(tree);
          }
        } // 受击树   


        affectedTrees(nodes, isPlayer = true, role) {
          for (let node of nodes) {
            let tree = node.getComponent(_crd && ItemTreeManager === void 0 ? (_reportPossibleCrUseOfItemTreeManager({
              error: Error()
            }), ItemTreeManager) : ItemTreeManager);

            if (tree) {
              tree.affectedAni(isPlayer, role);
            }
          }
        }

        initTrees() {
          const {
            _treeRow,
            _treeCol,
            _treeStartPoint,
            _leftToRightSpacing,
            _frontToBackSpacing
          } = this;

          for (let r = 0; r < _treeRow; r++) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.treeMatrix.push([]);

            for (let c = 0; c < _treeCol; c++) {
              const treePrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
                error: Error()
              }), EntityTypeEnum) : EntityTypeEnum).Tree);
              const tree = instantiate(treePrefab);
              tree[`__treeNum`] = this._treeCount;
              tree.setParent(this.node); // 计算每棵树的位置

              const posX = _treeStartPoint.x + c * _leftToRightSpacing;
              const posZ = _treeStartPoint.z + r * _frontToBackSpacing;
              tree.setPosition(new Vec3(posX, _treeStartPoint.y, posZ));
              tree.children[0].eulerAngles = new Vec3(0, Math.floor(math.random() * 360), 0);
              tree.getComponent(_crd && ItemTreeManager === void 0 ? (_reportPossibleCrUseOfItemTreeManager({
                error: Error()
              }), ItemTreeManager) : ItemTreeManager).init(r * _treeRow + c);
              this._treeCount++;
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.treeMatrix[r].push(tree);
            }
          } // 散落在场景中的树


          for (let i = 0; i < this.scatteredTreePoints.children.length; i++) {
            const treePoint = this.scatteredTreePoints.children[i];
            const treePrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Tree);
            const tree = instantiate(treePrefab);
            tree[`__treeNum`] = this._treeCount;
            tree.setParent(this.node);
            tree.setPosition(new Vec3(treePoint.position.x, _treeStartPoint.y, treePoint.position.z));
            tree.children[0].eulerAngles = new Vec3(0, Math.floor(math.random() * 360), 0);
            this._treeCount++;
          }
        }
        /** 播动画 */


        playAni(aniData) {
          let row = this._treeRow;
          let indexList = [];

          for (let i = 0; i < aniData.length; i++) {
            let index = aniData[i].tree.y * row + aniData[i].tree.x;
            indexList.push(index); //console.log("index",index, aniData[i].tree.x, aniData[i].tree.y);
          }

          for (let i = 0; i < this.node.children.length; i++) {
            let tree = this.node.children[i];

            if (tree) {
              let treeItem = tree.getComponent(_crd && ItemTreeManager === void 0 ? (_reportPossibleCrUseOfItemTreeManager({
                error: Error()
              }), ItemTreeManager) : ItemTreeManager);

              if (treeItem) {
                let index = treeItem.Index;

                if (indexList.indexOf(index) !== -1) {
                  treeItem.playAni(aniData[indexList.indexOf(index)].dir);
                }
              }
            }
          }
        } // 查找树


        findRemoveTree(tree) {
          const M = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeMatrix;

          for (let r = 0; r < M.length; r++) {
            for (let c = 0; c < M[r].length; c++) {
              if (M[r][c] === tree) {
                M[r][c] = null;
                return {
                  r,
                  c
                };
              }
            }
          }

          return {
            r: -1,
            c: -1
          }; // 没找到
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scatteredTreePoints", [_dec2], {
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
//# sourceMappingURL=777382aaebe70b00f60847867d38fe37699fecfe.js.map