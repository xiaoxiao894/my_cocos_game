System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, App, _dec, _class, _class2, _crd, ccclass, PalingAttack;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "./App", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "469d2Eu/49Iw7WFlo26Ql/y", "PalingAttack", undefined);

      __checkObsolete__(['_decorator', 'Node', 'Vec3']);

      ({
        ccclass
      } = _decorator);
      /** 围栏数据接口定义 */

      /** 围栏边界 */

      _export("PalingAttack", PalingAttack = (_dec = ccclass('PalingAttack'), _dec(_class = (_class2 = class PalingAttack {
        constructor() {
          /** 围栏攻击数据映射表，key为节点uuid */
          this.attackPaling = {};

          /** 围栏边界 3个等级的节点对应的边界 */
          this._palingBoundings = [];

          /** 围栏2状态  0 中间一块 1中间一块+右边一块 2中间一块+左边一块 3全部 */
          this._paling2State = 0;
        }

        /** 获取单例实例 */
        static get Instance() {
          if (!this._instance) {
            this._instance = new PalingAttack();
          }

          return this._instance;
        }

        /**
         * 设置可被攻击的围栏
         * 从场景节点中获取围栏并初始化其攻击数据
         */
        setPaling(level) {
          if (level === void 0) {
            level = 1;
          }

          // 空值检查，避免访问undefined的属性
          if (!(_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App) || !(_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode) {
            console.warn('App或sceneNode未初始化');
            return;
          }

          this.attackPaling = {}; // 重置数据

          if (level == 1) {
            var attackPalingLevel_1 = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.attackPalingLevel_1 || [];
            attackPalingLevel_1.forEach(node => {
              this.addOneAttack(node);
            });
          } else if (level == 2) {
            var attackPalingLevel_2 = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.attackPalingLevel_2 || [];
            attackPalingLevel_2.forEach(node => {
              this.addOneAttack(node);
            });
          } else if (level == 3) {
            var attackPalingLevel_3 = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.attackPalingLevel_3 || [];
            attackPalingLevel_3.forEach(node => {
              this.addOneAttack(node);
            });
          } else if (level == 4) {
            [...((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.attackPalingLevel_3 || []), ...((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.attackPalingLevel_4 || [])].forEach(node => this.addOneAttack(node));
          } // // 初始化围栏数据
          // if(App.sceneNode.palingLevels[0].active){
          //     const attackPalingLevel_1 = App.sceneNode.attackPalingLevel_1 || [];
          //     attackPalingLevel_1.forEach((node) => {
          //         this.addOneAttack(node);
          //     });
          // }
          // if(App.sceneNode.palingLevels[1].active){
          //     const attackPalingLevel_2 = App.sceneNode.attackPalingLevel_2 || [];
          //     attackPalingLevel_2.forEach((node) => {
          //         let showNode:boolean = false;
          //         if(node.active &&node.parent.active){
          //             if(!App.sceneNode.palingLevels[5].active){
          //                 showNode = true;
          //             // }else if(node.name ==="erjichengmen"||node.name ==="erjichengqiang01"||node.name ==="erjichengqiang02"){
          //             //     showNode = false;
          //             // }else{
          //              //   showNode = true;
          //             }
          //         }
          //         if(showNode){
          //             this.addOneAttack(node);
          //         }
          //     });
          // }
          // if(App.sceneNode.palingLevels[2].active){
          //     const attackPalingLevel_3 = App.sceneNode.attackPalingLevel_3 || [];
          //     attackPalingLevel_3.forEach((node) => {
          //         this.addOneAttack(node);
          //     });
          // }


          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.resetEnemyAttackPaling();
        }

        addOneAttack(node) {
          var nodeId = node.uuid;
          this.attackPaling[nodeId] = {
            node,
            curNum: 0,
            maxNum: 2,
            distance: 2
          };
        }
        /**
         * 返回最近的围栏
         * @returns 符合条件的围栏数据或null
         */


        getNearstPaling(pos) {
          var nearestGuardrail = null; //最近围栏

          var minDistSqr = Infinity; //最近距离

          for (var key in this.attackPaling) {
            if (this.attackPaling.hasOwnProperty(key)) {
              var paling = this.attackPaling[key];

              if (paling.curNum < paling.maxNum) {
                var disSqr = Vec3.squaredDistance(paling.node.getWorldPosition(), pos);

                if (disSqr < minDistSqr) {
                  minDistSqr = disSqr;
                  nearestGuardrail = paling;
                }
              }
            }
          } // 如果没有符合条件的围栏，返回null


          if (!nearestGuardrail) {
            return null;
          } // 返回最近的围栏


          return nearestGuardrail;
        }
        /**
         * 获取所有围栏的数据
         */


        getAllPaling() {
          var result = {};

          for (var key in this.attackPaling) {
            if (this.attackPaling.hasOwnProperty(key)) {
              result[key] = _extends({}, this.attackPaling[key]);
            }
          }

          return result;
        }
        /**
         * 根据节点UUID获取特定围栏数据
         * @param uuid 节点UUID
         * @returns 围栏数据或undefined
         */


        getPalingByUuid(uuid) {
          return this.attackPaling[uuid];
        }
        /**
         * 更新围栏的当前数值
         * @param uuid 节点UUID
         * @param newCurNum 新的当前数值
         * @returns 是否更新成功
         */


        updatePalingCurNum(uuid, newCurNum) {
          var paling = this.attackPaling[uuid];

          if (paling) {
            paling.curNum = newCurNum;
            return true;
          }

          return false;
        }
        /** 判断是否在栅栏边界内 */


        inPalingsByLevel(level, pos) {
          if (this._palingBoundings.length === 0) {
            this.updateBounding();
          } else if (this._paling2State !== 3) {
            this.updatePaling2Bounding();
          }

          var bounding = this._palingBoundings[level - 1];

          if (bounding) {
            return pos.x >= bounding.minX && pos.x <= bounding.maxX && pos.z >= bounding.minZ && pos.z <= bounding.maxZ;
          }

          console.error("\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u6805\u680F\u7684\u8FB9\u754C " + level);
          return false;
        }
        /** 更新栅栏边界 */


        updateBounding() {
          var palings = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.palingLevels;

          for (var paling of palings) {
            var minX = Infinity,
                maxX = -Infinity;
            var minZ = Infinity,
                maxZ = -Infinity;

            for (var palingNode of paling.children) {
              var palingPos = palingNode.worldPosition;
              minX = Math.min(minX, palingPos.x);
              maxX = Math.max(maxX, palingPos.x);
              minZ = Math.min(minZ, palingPos.z);
              maxZ = Math.max(maxZ, palingPos.z);
            }

            this._palingBoundings.push({
              minX,
              maxX,
              minZ,
              maxZ
            });
          }
        }
        /** 单独更新2级围栏边界 */


        updatePaling2Bounding() {
          var newState = 0;
          var palings = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.palingLevels;

          if (palings[3].active && palings[4].active && palings[5].active) {
            newState = 1;

            if (palings[6].active) {
              newState = 3;
            }
          } else if (palings[6].active) {
            newState = 2;
          }

          if (newState !== this._paling2State) {
            var {
              minX,
              maxX,
              minZ,
              maxZ
            } = this._palingBoundings[1];

            if ((newState === 1 || newState === 3) && this._paling2State !== 1) {
              for (var i = 3; i < 6; i++) {
                minX = Math.min(minX, this._palingBoundings[i].minX);
                maxX = Math.max(maxX, this._palingBoundings[i].maxX);
                minZ = Math.min(minZ, this._palingBoundings[i].minZ);
                maxZ = Math.max(maxZ, this._palingBoundings[i].maxZ);
              }
            }

            if ((newState === 2 || newState === 3) && this._paling2State !== 2) {
              minX = Math.min(minX, this._palingBoundings[6].minX);
              maxX = Math.max(maxX, this._palingBoundings[6].maxX);
              minZ = Math.min(minZ, this._palingBoundings[6].minZ);
              maxZ = Math.max(maxZ, this._palingBoundings[6].maxZ);
            }

            this._palingBoundings[1] = {
              minX,
              maxX,
              minZ,
              maxZ
            };
            this._paling2State = newState;
          }
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=36fed900bb603683840424648f29e83baf805f08.js.map