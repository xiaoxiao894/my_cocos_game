System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Player, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _crd, ccclass, property, SceneNode;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "./Entitys/Player", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      Player = _unresolved_2.Player;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f27e56AJApO/Z/X092IgnwP", "SceneNode", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SceneNode", SceneNode = (_dec = ccclass('SceneNode'), _dec2 = property({
        type: _crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
          error: Error()
        }), Player) : Player,
        tooltip: "主角玩家"
      }), _dec3 = property({
        type: Node,
        tooltip: "敌人的父节点"
      }), _dec4 = property({
        type: Node,
        tooltip: "血条的父节点"
      }), _dec5 = property({
        type: Node,
        tooltip: "金币父节点"
      }), _dec6 = property({
        type: Node,
        tooltip: "临时效果父节点"
      }), _dec7 = property({
        type: Node,
        tooltip: "临时爆炸父节点"
      }), _dec8 = property({
        type: Node,
        tooltip: "敌人出现的位置"
      }), _dec9 = property({
        type: Node,
        tooltip: "敌人出现的位置"
      }), _dec10 = property({
        type: Node,
        tooltip: "敌人移动的路径第一段"
      }), _dec11 = property({
        type: Node,
        tooltip: "敌人移动的路径第二段"
      }), _dec12 = property({
        type: Node,
        tooltip: "攻击拒马敌人移动的路径第二段"
      }), _dec13 = property({
        type: Node,
        tooltip: "障碍物父节点"
      }), _dec14 = property({
        type: Node,
        tooltip: "追击的拦截点位置"
      }), _dec15 = property({
        type: Node,
        tooltip: "结束的拦截点位置"
      }), _dec16 = property({
        type: Node,
        tooltip: "拒马的节点"
      }), _dec17 = property({
        type: Node,
        tooltip: "所有的位置父节点"
      }), _dec18 = property({
        type: Node,
        tooltip: "火柴箭头的父节点"
      }), _dec19 = property({
        type: Node,
        tooltip: " Beetle移动的路径"
      }), _dec20 = property({
        type: Node,
        tooltip: " Beetle出现的位置"
      }), _dec21 = property({
        type: Node,
        tooltip: " Beetle的父节点"
      }), _dec22 = property({
        type: Node,
        tooltip: " 花朵"
      }), _dec23 = property({
        type: Node,
        tooltip: " 游戏结束界面"
      }), _dec24 = property({
        type: Node,
        tooltip: " 引导箭头的父节点"
      }), _dec25 = property({
        type: Node,
        tooltip: " 引导箭头的父节点"
      }), _dec26 = property({
        type: Node,
        tooltip: " 拒马"
      }), _dec27 = property({
        type: Node,
        tooltip: " 攻击花朵"
      }), _dec28 = property({
        type: Node,
        tooltip: "禁止金币掉落区域"
      }), _dec(_class = (_class2 = class SceneNode extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "player", _descriptor, this);

          _initializerDefineProperty(this, "enemyParent", _descriptor2, this);

          _initializerDefineProperty(this, "bloodParent", _descriptor3, this);

          _initializerDefineProperty(this, "coinParent", _descriptor4, this);

          _initializerDefineProperty(this, "effectParent", _descriptor5, this);

          _initializerDefineProperty(this, "bombEffectParent", _descriptor6, this);

          _initializerDefineProperty(this, "enemyBirthPos", _descriptor7, this);

          _initializerDefineProperty(this, "enemyBirthPos1", _descriptor8, this);

          _initializerDefineProperty(this, "enemyMovePath", _descriptor9, this);

          _initializerDefineProperty(this, "enemyMovePath2", _descriptor10, this);

          _initializerDefineProperty(this, "enemyMoveRvoPath", _descriptor11, this);

          _initializerDefineProperty(this, "obstacleParrent", _descriptor12, this);

          _initializerDefineProperty(this, "moveBlockPos", _descriptor13, this);

          _initializerDefineProperty(this, "moveEndBlockPos", _descriptor14, this);

          _initializerDefineProperty(this, "juma01", _descriptor15, this);

          _initializerDefineProperty(this, "allPos", _descriptor16, this);

          _initializerDefineProperty(this, "fireArrow", _descriptor17, this);

          _initializerDefineProperty(this, "beetleMovePath", _descriptor18, this);

          _initializerDefineProperty(this, "beetleBirthPos", _descriptor19, this);

          _initializerDefineProperty(this, "beetleParent", _descriptor20, this);

          _initializerDefineProperty(this, "flower", _descriptor21, this);

          _initializerDefineProperty(this, "GameEnd", _descriptor22, this);

          _initializerDefineProperty(this, "guideParent", _descriptor23, this);

          _initializerDefineProperty(this, "guideList", _descriptor24, this);

          _initializerDefineProperty(this, "QianBiJuMa", _descriptor25, this);

          _initializerDefineProperty(this, "attackFlower", _descriptor26, this);

          _initializerDefineProperty(this, "coinAreaBan", _descriptor27, this);
        }

        start() {
          this.enemyParent.active = false;
        } // protected onLoad(): void {
        //    let level_1 = this.palingParent.getChildByName("yijiweiqiang")
        //    for(let i = 1 ;i < 9;i++){
        //         this.attackPalingLevel_1.push(level_1.getChildByName("weiqiang0"+i))
        //    }
        // }

        /**攻击的围栏 */
        // attackPalingLevel_1(){
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enemyParent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bloodParent", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "coinParent", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "effectParent", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bombEffectParent", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enemyBirthPos", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enemyBirthPos1", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "enemyMovePath", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "enemyMovePath2", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "enemyMoveRvoPath", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "obstacleParrent", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "moveBlockPos", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "moveEndBlockPos", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "juma01", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "allPos", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "fireArrow", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "beetleMovePath", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "beetleBirthPos", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "beetleParent", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "flower", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "GameEnd", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "guideParent", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "guideList", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "QianBiJuMa", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "attackFlower", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "coinAreaBan", [_dec28], {
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
//# sourceMappingURL=57f8de557510e4c284b949f691442e37be4d6dd0.js.map