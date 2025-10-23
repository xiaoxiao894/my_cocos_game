System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Collider, Vec2, Vec3, Singleton, DataManager, FlowCell, FlowField, _crd;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  _export("FlowField", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Collider = _cc.Collider;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "894f7nRBhdK96lsU8yJpumF", "FlowField", undefined);

      __checkObsolete__(['_decorator', 'BoxCollider', 'Collider', 'Color', 'Component', 'debug', 'director', 'geometry', 'Node', 'SphereCollider', 'Vec2', 'Vec3']);

      FlowCell = class FlowCell {
        constructor() {
          this.cost = 0;
          // 到达玩家的代价
          this.direction = new Vec2(0, 0);
        } // 移动方向


      };
      /**
       * 流场避障算法
       */

      _export("FlowField", FlowField = class FlowField extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor() {
          super(...arguments);
          this._gridSize = 1;
          // 每个格子的大小（世界单位）
          this._gridWidth = 50;
          // 网格宽度（格子数）
          this._gridHeight = 50;
          // 网格高度（格子数）
          this._grid = [];
          this._obstacles = [];
        }

        // 静态障碍物位置
        static get Instance() {
          return super.GetInstance();
        }

        init(obstacles) {
          var _Instance$player;

          // 初始化网格
          this._grid = new Array(this._gridWidth);

          for (var x = 0; x < this._gridWidth; x++) {
            this._grid[x] = new Array(this._gridHeight);

            for (var y = 0; y < this._gridHeight; y++) {
              this._grid[x][y] = new FlowCell();
            }
          } // 初始化障碍物（新增代码）


          this._obstacles = [];
          this.registerObstacles(obstacles);
          this.updateFlowField((_Instance$player = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player) == null || (_Instance$player = _Instance$player.node) == null || (_Instance$player = _Instance$player.getWorldPosition()) == null ? void 0 : _Instance$player.clone());
        }
        /**
         * 注册所有静态障碍物
         */


        registerObstacles(obstacles) {
          //方式1：通过节点
          for (var node of obstacles) {
            var width = 1;
            var height = 1;
            var collider = node.getComponent(Collider);

            if (collider) {
              if ('radius' in collider) {
                // 类型推断为 SphereCollider
                width = collider.radius * 2;
                height = width;
              } else if ('size' in collider) {
                // 类型推断为 BoxCollider
                var size = collider.size;
                width = size.x;
                height = size.z;
              } //this.addLargeObstacle(node.worldPosition,width,height);


              this.addObstacle(node.worldPosition);
            }
          }
        }
        /**
         * 添加单个障碍物
         * @param worldPos 世界坐标
         */


        addObstacle(worldPos) {
          var gridPos = this.worldToGrid(worldPos);

          if (this.isValidGrid(gridPos)) {
            this._obstacles.push(worldPos.clone()); // console.log(`障碍物添加在网格: [${gridPos.x},${gridPos.y}]`);

          }
        }

        addLargeObstacle(centerPos, width, height) {
          // console.log(`大障碍物: [${width},${height}]`);
          for (var dx = -width / 2; dx <= width / 2; dx++) {
            for (var dy = -height / 2; dy <= height / 2; dy++) {
              this.addObstacle(centerPos.add(new Vec3(dx, 0, dy)));
            }
          }
        } // 更新流场（玩家位置变化时调用）


        updateFlowField(playerWorldPos) {
          if (!playerWorldPos || this._grid.length <= 0) {
            return;
          } // 1. 转换玩家位置到网格坐标


          var playerGridPos = this.worldToGrid(playerWorldPos); // 2. 重置所有格子代价

          for (var x = 0; x < this._gridWidth; x++) {
            for (var y = 0; y < this._gridHeight; y++) {
              if (this._grid.length > 0) {
                this._grid[x][y].cost = Infinity;
              }
            }
          } // 3. 从玩家位置开始广度优先搜索（BFS）


          var queue = [playerGridPos];
          this._grid[playerGridPos.x][playerGridPos.y].cost = 0;

          while (queue.length > 0) {
            var current = queue.shift();
            var currentCost = this._grid[current.x][current.y].cost; // 检查4个相邻格子（上、下、左、右）

            var neighbors = [new Vec2(current.x, current.y + 1), new Vec2(current.x, current.y - 1), new Vec2(current.x + 1, current.y), new Vec2(current.x - 1, current.y)];

            for (var neighbor of neighbors) {
              if (this.isValidGrid(neighbor)) {
                // 计算新代价 = 当前代价 + 移动成本（障碍物则成本极高）
                var moveCost = this.isObstacle(neighbor) ? 1000 : 1;
                var newCost = currentCost + moveCost;

                if (newCost < this._grid[neighbor.x][neighbor.y].cost) {
                  this._grid[neighbor.x][neighbor.y].cost = newCost;
                  queue.push(neighbor); // 记录移动方向（指向更低代价的邻居）

                  var dir = new Vec2(current.x - neighbor.x, current.y - neighbor.y).normalize();
                  this._grid[neighbor.x][neighbor.y].direction = dir;
                }
              }
            }
          }
        } // 辅助方法：世界坐标转网格坐标


        worldToGrid(worldPos) {
          return new Vec2(Math.floor(worldPos.x / this._gridSize + this._gridWidth / 2), Math.floor(worldPos.z / this._gridSize + this._gridHeight / 2) // 3D游戏用z轴
          );
        } // 检查是否为障碍物


        isObstacle(gridPos) {
          return this._obstacles.some(obs => {
            var obsGridPos = this.worldToGrid(obs);
            return obsGridPos.equals(gridPos);
          });
        }
        /**
         * 检查网格坐标是否在有效范围内
         */


        isValidGrid(gridPos) {
          // 使用Number.isInteger更严格地检查整数索引
          return Number.isInteger(gridPos.x) && Number.isInteger(gridPos.y) && gridPos.x >= 0 && gridPos.x < this._gridWidth && gridPos.y >= 0 && gridPos.y < this._gridHeight;
        }
        /**
         * 将网格坐标转换为世界坐标
         * @param gridPos 网格坐标 (x,y 表示网格行列索引)
         * @param yHeight 世界Y轴高度（默认0）
         */


        gridToWorld(gridPos, yHeight) {
          if (yHeight === void 0) {
            yHeight = 0;
          }

          // 计算世界坐标（假设网格原点在场景中心）
          return new Vec3((gridPos.x - this._gridWidth / 2) * this._gridSize, yHeight, // Y轴高度
          (gridPos.y - this._gridHeight / 2) * this._gridSize // 3D用Z轴
          );
        }
        /**
         * 获取指定网格的移动方向
         * @param gridPos 网格坐标
         * @returns 归一化的方向向量 (Vec2)
         */


        getDirection(gridPos) {
          if (!this.isValidGrid(gridPos)) {
            return Vec2.ZERO;
          } // 返回预计算的方向（流场生成时已归一化）


          return this._grid[gridPos.x][gridPos.y].direction.clone();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2e7c33ed295904d41f26bc389d9768e1eb62ab2a.js.map