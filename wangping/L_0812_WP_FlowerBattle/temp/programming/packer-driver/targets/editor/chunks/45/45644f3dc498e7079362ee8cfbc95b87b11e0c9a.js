System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, tween, Vec3, App, GlobeVariable, PlayerBeetle, BeetleController, _crd;

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerBeetle(extras) {
    _reporterNs.report("PlayerBeetle", "./PlayerBeetle", _context.meta, extras);
  }

  _export("BeetleController", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }, function (_unresolved_4) {
      PlayerBeetle = _unresolved_4.PlayerBeetle;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3f18eUzfTJKiY+eHNpHtyvZ", "BeetleController", undefined);

      __checkObsolete__(['_decorator', 'Node', 'tween', 'Vec3']);

      _export("BeetleController", BeetleController = class BeetleController {
        constructor() {
          this.beetleList = [];
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new BeetleController();
          }

          return this._instance;
        }

        init() {} //n级敌人随机出现的位置


        creatBeetleByLevel() {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleCurNum >= (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleNumLimit) {
            return;
          }

          this.realCreatBeetle((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.beetleBirthPos.worldPosition.clone());
        }

        getBeetleList() {
          return this.beetleList;
        }

        removeBeetle(beetle) {
          const index = this.beetleList.indexOf(beetle);

          if (index !== -1) {
            this.beetleList.splice(index, 1); // 从列表中移除
          }

          if (this.beetleList.length <= 0) {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).beetleIsMoveEnemy = false;
          }

          console.log(`remove enemy ,num ${this.beetleList.length}`);
        }
        /** 真正创建怪 */


        realCreatBeetle(pos) {
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleCurNum++;
          let prefab = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.Beetle);
          prefab.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.beetleParent;
          prefab.setWorldPosition(pos); //init里用到了位置，放init前边

          prefab.active = true;
          let beetle = prefab.getComponent(_crd && PlayerBeetle === void 0 ? (_reportPossibleCrUseOfPlayerBeetle({
            error: Error()
          }), PlayerBeetle) : PlayerBeetle);
          this.beetleList.push(beetle);
          console.log(`push beetle ,num ${this.beetleList.length}`); //出现动画

          tween(prefab).to(0.15, {
            scale: new Vec3(1, 1.2, 1)
          }, {
            easing: 'quadOut'
          }).to(0.05, {
            scale: new Vec3(1.44, 1.44, 1.44)
          }, {
            easing: 'quadOut'
          }).start();
        }

        update(dt) {
          for (let index = 0; index < this.beetleList.length; index++) {
            var _enemy$getComponent;

            const enemy = this.beetleList[index];
            enemy == null || (_enemy$getComponent = enemy.getComponent(_crd && PlayerBeetle === void 0 ? (_reportPossibleCrUseOfPlayerBeetle({
              error: Error()
            }), PlayerBeetle) : PlayerBeetle)) == null || _enemy$getComponent.update(dt);
          }
        }

      });

      //冲锋甲虫列表
      BeetleController._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=45644f3dc498e7079362ee8cfbc95b87b11e0c9a.js.map