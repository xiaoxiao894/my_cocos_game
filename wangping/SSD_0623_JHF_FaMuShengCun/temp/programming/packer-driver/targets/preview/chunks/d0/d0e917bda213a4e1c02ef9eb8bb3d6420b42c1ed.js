System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, DataManager, GridPathController, _crd;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTreeAniData(extras) {
    _reporterNs.report("TreeAniData", "../Enum/Index", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2fc00oaT6hKRr1G+UnrOA8T", "GridPathController", undefined);

      __checkObsolete__(['Vec2', 'Vec3', 'Node']);

      _export("default", GridPathController = class GridPathController {
        static get instance() {
          if (!GridPathController._instance) {
            GridPathController._instance = new GridPathController();
          }

          return GridPathController._instance;
        }
        /** 玩家路径点 */


        constructor() {
          this.path = [];
          this.gridSizeX = 0;
          // 网格大小（单位：米）
          this.gridSizeZ = 0;
          // 网格大小（单位：米）

          /** 初始坐标位置 */
          this.originOffset = void 0;
          this.gridSizeX = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.treeSpacingX;
          this.gridSizeZ = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.treeSpacingZ;
          this.originOffset = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.treeManager.treeStartPoint;
        }
        /**
         * 更新路径（每帧调用）
         * @param worldPosition 人物的世界坐标
         */


        updatePath(worldPosition) {
          var gridPos = this.worldToGrid(worldPosition); // 如果路径为空或当前位置不等于最后一个点，则处理

          if (this.path.length === 0 || !this.isSameGrid(gridPos, this.path[this.path.length - 1])) {
            this.path.push(gridPos); // 添加新点

            this.treePlayAni(this.path[this.path.length - 1], this.path[this.path.length - 2]);

            if (this.path.length > 2) {
              this.path.shift();
            }
          }
        }
        /**
         * 世界坐标转网格坐标（考虑初始偏移）
         */


        worldToGrid(worldPos) {
          return {
            x: Math.floor((worldPos.x - this.originOffset.x) / this.gridSizeX),
            y: Math.floor((worldPos.z - this.originOffset.z) / this.gridSizeZ) // 假设z轴为2D平面y轴

          };
        }
        /**
         * 将网格坐标转换为网格中心的世界坐标
         * @param gridX 网格X坐标
         * @param gridY 网格Y坐标
         * @returns 世界坐标（Vec3）
         */


        gridToWorldCenter(gridX, gridY) {
          return new Vec3(gridX * this.gridSizeX + this.originOffset.x + this.gridSizeX / 2, 0, gridY * this.gridSizeZ + this.originOffset.z + this.gridSizeZ / 2);
        }
        /**
         * 判断两个网格坐标是否相同
         */


        isSameGrid(a, b) {
          return a.x === b.x && a.y === b.y;
        }
        /** 人过树动  */


        treePlayAni(pos, lastPos) {
          if (pos && lastPos) {
            var angle = 10; //获取周围4棵树  右上 左上 右下 左下

            var trees = [pos, {
              x: pos.x,
              y: pos.y + 1
            }, {
              x: pos.x + 1,
              y: pos.y
            }, {
              x: pos.x + 1,
              y: pos.y + 1
            }]; //确定哪两棵树播放动画，以及动画方向

            var treeAnis = [];

            if (pos.x > lastPos.x) {
              treeAnis.push({
                dir: new Vec3(-angle, 0, 0),
                tree: trees[0]
              });
              treeAnis.push({
                dir: new Vec3(angle, 0, 0),
                tree: trees[1]
              });
            } else if (pos.x < lastPos.x) {
              treeAnis.push({
                dir: new Vec3(-angle, 0, 0),
                tree: trees[2]
              });
              treeAnis.push({
                dir: new Vec3(angle, 0, 0),
                tree: trees[3]
              });
            } else if (pos.y > lastPos.y) {
              treeAnis.push({
                dir: new Vec3(0, 0, angle),
                tree: trees[0]
              });
              treeAnis.push({
                dir: new Vec3(0, 0, -angle),
                tree: trees[2]
              });
            } else if (pos.y < lastPos.y) {
              treeAnis.push({
                dir: new Vec3(0, 0, angle),
                tree: trees[1]
              });
              treeAnis.push({
                dir: new Vec3(0, 0, -angle),
                tree: trees[3]
              });
            }

            if (treeAnis.length > 0) {
              //播放动画
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.treeManager.playAni(treeAnis);
            }
          }
        }

      });

      GridPathController._instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d0e917bda213a4e1c02ef9eb8bb3d6420b42c1ed.js.map