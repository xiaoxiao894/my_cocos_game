System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, tween, Vec3, BoxCollider, RigidBody, App, GlobeVariable, DropController, _crd;

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      BoxCollider = _cc.BoxCollider;
      RigidBody = _cc.RigidBody;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "89549TxJV9O6qRARJNPnfaH", "DropController", undefined);

      __checkObsolete__(['tween', 'Vec3', 'Node', 'BoxCollider', 'RigidBody']);

      /**
       * @class DropController 掉落物管理类
       */
      _export("default", DropController = class DropController {
        constructor() {
          /** 可拾取掉落物列表 */
          this._dropList = [];
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new DropController();
          }

          return this._instance;
        }

        getDropList() {
          return this._dropList;
        }

        continueGame() {
          this._dropList.forEach(item => {
            item.removeFromParent();
            item.destroy();
          });

          this._dropList = [];
        } // 金币掉落


        dropItem(pos) {
          var node = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.Coin);
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.coinParent.addChild(node);
          node.setWorldPosition(pos); // 原始位置

          var startY = pos.y;
          var peakY = startY + 7; // 第一次跃起高度

          var bounceY = startY + 1; // 回落后的弹跳高度

          node.getComponent(BoxCollider).enabled = true;
          node.getComponent(RigidBody).enabled = true;
          tween(node).to(0.15, {
            position: new Vec3(pos.x, peakY, pos.z)
          }, {
            easing: 'quadOut'
          }) // 向上弹起
          .to(0.1, {
            position: new Vec3(pos.x, bounceY, pos.z)
          }, {
            easing: 'quadIn'
          }) // 回落
          .to(0.05, {
            position: new Vec3(pos.x, bounceY + 2, pos.z)
          }, {
            easing: 'quadOut'
          }) // 二次弹起
          .to(0.05, {
            position: new Vec3(pos.x, bounceY, pos.z)
          }, {
            easing: 'quadIn'
          }) // 回到地面
          //     // .to(0.05, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
          //     // .to(0.05, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
          .call(() => {
            //  node.getComponent(BoxCollider).enabled = false;
            // node.getComponent(RigidBody).enabled = false;
            this._dropList.push(node);
          }).start();
        }

        getAroundDrop(pos) {
          for (var i = this._dropList.length - 1; i >= 0; i--) {
            var drop = this._dropList[i];
            var dropPos = drop.worldPosition.clone();
            var dx = dropPos.x - pos.x;
            var dz = dropPos.z - pos.z;
            var distSqrXZ = dx * dx + dz * dz; // 范围内

            if (distSqrXZ <= (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).maxSquareDis) {
              this._dropList.splice(i, 1); //范围外掉落物放到最前边


              var drops = this._dropList.splice(i, this._dropList.length - i);

              this._dropList.unshift(...drops);

              return drop;
            }
          }

          return null;
        }

      });

      DropController._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=98d9ec038df1cc2e75b1c9f106ba24adaeeb1bf7.js.map