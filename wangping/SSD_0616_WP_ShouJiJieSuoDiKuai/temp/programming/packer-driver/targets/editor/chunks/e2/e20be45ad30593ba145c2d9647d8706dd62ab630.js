System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, EnemyTree, _dec, _class, _class2, _crd, ccclass, property, TreeController, treeController;

  function _reportPossibleCrUseOfEnemyTree(extras) {
    _reporterNs.report("EnemyTree", "../entitys/EnemyTree", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      EnemyTree = _unresolved_2.EnemyTree;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "18c865w64VFGpuWR2PQlCQj", "TreeController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TreeController", TreeController = (_dec = ccclass('TreeController'), _dec(_class = (_class2 = class TreeController {
        constructor() {
          this.enemyTreeList = [];
          //初始第一进入地块 解锁4 个砍伐一个在解锁一个
          //private squenceTree: number = 4;
          this.curCutTreeIndex = 0;
          //第一解锁多少
          this.unLockTreeNum = 4;
          this.parentNode = null;
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new TreeController();
          }

          return this._instance;
        }

        initAllTree(parentNode) {
          this.parentNode = parentNode;

          for (let i = 0; i < this.parentNode.children.length; i++) {
            //this.parentNode.children.length
            let enemyTree = this.parentNode.children[i];
            let enemyTreeComp = enemyTree.getComponent(_crd && EnemyTree === void 0 ? (_reportPossibleCrUseOfEnemyTree({
              error: Error()
            }), EnemyTree) : EnemyTree);

            if (i < this.unLockTreeNum) {
              enemyTreeComp.setFindState(true);
              enemyTreeComp.showArrowTarger();
              this.curCutTreeIndex += 1;
            }

            this.enemyTreeList.push(enemyTreeComp);
          }
        }

        onLoad() {}

        netxTree() {
          if (this.curCutTreeIndex >= this.enemyTreeList.length) {
            //this.curCutTreeIndex = 0;
            return;
          }

          let enemyTreeComp = this.enemyTreeList[this.curCutTreeIndex];
          enemyTreeComp.setFindState(true);
          enemyTreeComp.showArrowTarger();
          this.curCutTreeIndex += 1;
        }

        update(deltaTime) {}

      }, _class2._instance = null, _class2)) || _class)); // 导出全局单例


      _export("treeController", treeController = TreeController.Instance);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e20be45ad30593ba145c2d9647d8706dd62ab630.js.map