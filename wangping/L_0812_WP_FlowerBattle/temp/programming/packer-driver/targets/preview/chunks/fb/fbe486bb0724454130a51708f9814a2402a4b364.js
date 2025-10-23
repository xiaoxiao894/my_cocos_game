System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, App, GlobeVariable, MathUtil, GoldMineController, _crd;

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../core/MathUtils", _context.meta, extras);
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
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }, function (_unresolved_4) {
      MathUtil = _unresolved_4.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d8feer6tCdFhJeu00a+gnr3", "GoldMineController", undefined);

      __checkObsolete__(['Mat4', 'Vec3', 'Node']);

      //类型定义 

      /** 金矿管理类 */
      _export("default", GoldMineController = class GoldMineController {
        constructor() {
          this._coinLackPos = [];
          this._coinNum = 0;
          //钱的尺寸
          this._coinWidth = 1.2;
          this._coinHeight = 0.2;
          //钱池个数
          this._coinLengthNum = 3;
          this._coinWidthNum = 4;
          //按顺序排列，最后一个金币的位置
          this._maxCoin = void 0;
          // 正在在播放动画的数量
          this._playingAniNum = 0;
        }

        static get Instance() {
          if (!GoldMineController._instance) {
            GoldMineController._instance = new GoldMineController();
          }

          return GoldMineController._instance;
        }
        /** 增加金币 */


        addCoin(worldPos) {
          var coinItem = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.Coin);
          coinItem.setParent((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.goldMineParent);

          if (worldPos) {
            coinItem.setWorldPosition(worldPos);
          } else {
            var pos = this.getNextPosWithLength();
            coinItem.setPosition(pos);
          }

          if (!this._maxCoin) {
            this._maxCoin = coinItem.getPosition().clone();
          } else {
            if (this.isPositionGreater(coinItem.getWorldPosition(), this._maxCoin)) {
              this._maxCoin = coinItem.getWorldPosition().clone();
            }
          }

          this._coinNum++;
        }

        getGoldMineNum() {
          return this._coinNum;
        }

        playerGetCoin() {
          var worldPos = this.removeCoin();

          if (worldPos == null) {
            return null;
          } else {
            return {
              pos: worldPos,
              coin: (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).entifyName.Coin)
            };
          }
        }

        addPlayingAniNum() {
          this._playingAniNum++;
        }

        reducePlayingAniNum() {
          this._playingAniNum--;
        }

        getPlayingAniNum() {
          return this._playingAniNum;
        }

        isPositionGreater(pos1, pos2) {
          if (pos1.y > pos2.y) return true;
          if (pos1.y < pos2.y) return false; // y 相等时比较 x

          if (pos1.x > pos2.x) return true;
          if (pos1.x < pos2.x) return false; // x 和 y 相等时比较 z

          return pos1.z > pos2.z;
        }

        getNextCoinPos(aniNum) {
          if (this._coinLackPos.length > 0) {
            return this._coinLackPos.shift();
          } else {
            var targetPos = this.getNextPosWithLength(aniNum);
            var worldPos = new Vec3();
            worldPos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
              error: Error()
            }), MathUtil) : MathUtil).localToWorldPos3D(targetPos, (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.goldMineParent);
            return worldPos;
          }
        }

        getNextPosWithLength(addNum) {
          if (addNum === void 0) {
            addNum = 0;
          }

          var count = addNum + this._coinNum;
          var pos = new Vec3(0, 0, 0); //本层数量

          var nowLayerNumber = count % (this._coinLengthNum * this._coinWidthNum);
          pos.y = Math.floor(count / (this._coinLengthNum * this._coinWidthNum)) * this._coinHeight; //钱的高度

          pos.z = nowLayerNumber % this._coinWidthNum * this._coinWidth + this._coinWidth / 2; //钱的宽度

          pos.x = Math.floor(nowLayerNumber / this._coinWidthNum) * this._coinWidth + this._coinWidth / 2; //钱的长度

          return pos;
        }

        removeCoin() {
          if (this._coinNum > 0) {
            var coinNodes = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.goldMineParent.children;
            coinNodes.sort((a, b) => {
              // 1. 优先比较 y，大的在后
              if (a.position.y !== b.position.y) {
                return a.position.y - b.position.y; // 升序（y小的在前）
              } // 2. y 相等时，比较 x，大的在后


              if (a.position.x !== b.position.x) {
                return a.position.x - b.position.x; // 升序（x小的在前）
              } // 3. x 和 y 都相等时，比较 z，大的在后


              return a.position.z - b.position.z; // 升序（z小的在前）
            });
            var coinItem = coinNodes[coinNodes.length - 1];
            this._coinNum--;

            if (coinItem) {
              var pos = coinItem.worldPosition.clone();
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(coinItem, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).entifyName.Coin);
              this.updateCoinLack(pos);
              return pos;
            } else {
              return this.removeCoin();
            }
          } else {
            return null;
          }
        }

        updateCoinLack(pos) {
          //如果当前没有这个坐标再加入
          if (this._coinLackPos.indexOf(pos) !== -1) {
            return;
          }

          this._coinLackPos.push(pos);

          this._coinLackPos.sort((a, b) => {
            // 1. 优先比较 y，大的在后
            if (a.y !== b.y) {
              return a.y - b.y; // 升序（y小的在前）
            } // 2. y 相等时，比较 x，大的在后


            if (a.x !== b.x) {
              return a.x - b.x; // 升序（x小的在前）
            } // 3. x 和 y 都相等时，比较 z，大的在后


            return a.z - b.z; // 升序（z小的在前）
          });

          for (var i = 0; i < this._coinLackPos.length; i++) {
            var item = this._coinLackPos[i];

            if (this.isPositionGreater(item, this._maxCoin)) {
              this._coinLackPos.splice(i, this._coinLackPos.length - i);

              break;
            }
          }
        }

      });

      GoldMineController._instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fbe486bb0724454130a51708f9814a2402a4b364.js.map