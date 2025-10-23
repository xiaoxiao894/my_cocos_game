System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Quat, tween, Vec3, StackManager, DataManager, _dec, _class, _crd, ccclass, property, SceneCoinConManager;

  function _reportPossibleCrUseOfStackManager(extras) {
    _reporterNs.report("StackManager", "../StackSlot/StackManager", _context.meta, extras);
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
      Component = _cc.Component;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      StackManager = _unresolved_2.StackManager;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "75827E35ntIkrerOhZcozMB", "SceneCoinConManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'find', 'Node', 'Quat', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SceneCoinConManager", SceneCoinConManager = (_dec = ccclass('SceneCoinConManager'), _dec(_class = class SceneCoinConManager extends Component {
        constructor() {
          super(...arguments);
          this._row = 2;
          this._col = 3;
          this._gapX = 1.2;
          this._gapY = 1.5;
          this._gapZ = 0.4;
          this._maxLayer = 20000;
        }

        start() {
          if (this.node && !this.node["__stackManager"]) {
            this.node["__stackManager"] = new (_crd && StackManager === void 0 ? (_reportPossibleCrUseOfStackManager({
              error: Error()
            }), StackManager) : StackManager)(this._row, this._col, this._gapX, this._gapY, this._gapZ, this._maxLayer);
          }
        }

        update(deltaTime) {
          var _this = this;

          var iconList = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.monsterManager.getDrops();
          if (!iconList || iconList.length <= 0) return;
          var stackManager = this.node["__stackManager"];
          if (!stackManager) return;

          var _loop = function _loop() {
            var item = iconList[i];
            if (!item || !item.isValid) return 0; // continue

            var startPos = item.getWorldPosition();
            item.setParent(_this.node); // 保留你的原始逻辑
            // 仍然使用原来的 assignSlot（不引入预留/占用新语义）

            var slot = stackManager.assignSlot(item);
            if (!slot) return 0; // continue
            // 当前占用的槽位与索引（飞行途中可能被“降档”到更前的空槽）

            var curSlot = slot;
            var curIndex = stackManager.indexOfSlot(curSlot);
            var startRot = item.rotation.clone();
            var tmpQ = new Quat();
            var totalSpinDeg = 720;
            var tParam = {
              t: 0
            };
            tween(tParam).to(1, {
              t: 1
            }, {
              onUpdate: () => {
                var t = tParam.t;
                var oneMinusT = 1 - t; // 尝试“降档补洞”：若前方出现更靠前的空槽，更新占用关系

                var betterIndex = stackManager.findLowestVacantBefore(curIndex);

                if (betterIndex >= 0) {
                  var moved = stackManager.moveAssignment(item, curIndex, betterIndex);

                  if (moved) {
                    curIndex = betterIndex;
                    var s = stackManager.getSlotByIndex(curIndex);
                    if (s) curSlot = s;
                  }
                } //  每帧以“当前槽位”的世界坐标为终点（父节点/布局变化也能跟上）


                var endPosNow = stackManager.getSlotWorldPos(curSlot, _this.node); // 每帧重算控制点

                var ctrlX = (startPos.x + endPosNow.x) * 0.5;
                var ctrlY = (startPos.y + endPosNow.y) * 0.5 + 20;
                var ctrlZ = (startPos.z + endPosNow.z) * 0.5; // 二次贝塞尔插值

                var pos = new Vec3(oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * ctrlX + t * t * endPosNow.x, oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * ctrlY + t * t * endPosNow.y, oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * ctrlZ + t * t * endPosNow.z);
                item.setWorldPosition(pos); // 自旋

                var angle = totalSpinDeg * t;
                Quat.fromEuler(tmpQ, angle, 0, 0);
                var curQ = new Quat();
                Quat.multiply(curQ, startRot, tmpQ);
                item.setRotation(curQ); // 局部旋转
              },
              onComplete: () => {
                // 落地时再次读取“当前槽位”的世界坐标，避免中途变化导致错位
                var endPosNow = stackManager.getSlotWorldPos(curSlot, _this.node);
                var meatScaleNode = item.getChildByName("Meat");
                if (meatScaleNode) meatScaleNode.setScale(3, 3, 3); // 终点对齐与入栈（保持你的原逻辑）

                item.setWorldPosition(endPosNow);
                item.setParent(_this.node);
                item['__fallingTarget'] = true;
                item.eulerAngles = new Vec3(0, 0, 0);
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.monsterManager.stopSelfRotate(item);
                var localPos = new Vec3();

                _this.node.inverseTransformPoint(localPos, endPosNow);

                item.setPosition(localPos);
                tween(item).to(0.15, {
                  scale: new Vec3(1.2, 1.2, 1.2)
                }, {
                  easing: 'quadOut'
                }).to(0.05, {
                  scale: new Vec3(1, 1, 1)
                }, {
                  easing: 'quadOut'
                }).start(); // // 如果需要复位为起始旋转，解注即可：
                // item.setRotation(startRot);
              }
            }).start();
          },
              _ret;

          for (var i = 0; i < iconList.length; i++) {
            _ret = _loop();
            if (_ret === 0) continue;
          }
        } // update(deltaTime: number) {
        //     const iconList = DataManager.Instance.monsterManager.getDrops();
        //     if (iconList && iconList.length <= 0) return;
        //     const stackManager = this.node["__stackManager"];
        //     if (!stackManager) {
        //         // console.warn("meatCon 没有 stackManager");
        //         return;
        //     }
        //     for (let i = 0; i < iconList.length; i++) {
        //         const item = iconList[i];
        //         if (!item || !item.isValid) continue;
        //         const startPos = item.getWorldPosition();
        //         item.setParent(this.node);
        //         const slot = stackManager.assignSlot(item);
        //         if (!slot) {
        //             // console.warn("没有可用槽位");
        //             continue;
        //         }
        //         const endPos = stackManager.getSlotWorldPos(slot, this.node);
        //         const controlPoint = startPos.clone().lerp(endPos, 0.5).add3f(0, 15, 0);
        //         const tParam = { t: 0 };
        //         tween(tParam)
        //             .to(0.3, { t: 1 }, {
        //                 onUpdate: () => {
        //                     const t = tParam.t;
        //                     const oneMinusT = 1 - t;
        //                     const pos = new Vec3(
        //                         oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x,
        //                         oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y,
        //                         oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z
        //                     );
        //                     item.setWorldPosition(pos);
        //                 },
        //                 onComplete: () => {
        //                     const meatScaleNode = item.getChildByName("Meat");
        //                     if (meatScaleNode) {
        //                         meatScaleNode.setScale(3, 3, 3);
        //                     }
        //                     item.setWorldPosition(endPos);
        //                     item.setParent(this.node);
        //                     item[`__fallingTarget`] = true;
        //                     const localPos = new Vec3();
        //                     this.node.inverseTransformPoint(localPos, endPos);
        //                     item.setPosition(localPos);
        //                 }
        //             })
        //             .start();
        //     }
        // }


      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1189175e7e8200931c0de47f1c6867663092e492.js.map