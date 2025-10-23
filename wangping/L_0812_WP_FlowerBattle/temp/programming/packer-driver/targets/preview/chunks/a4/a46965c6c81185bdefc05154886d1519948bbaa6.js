System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, Vec3, MathUtil, _dec, _class, _crd, ccclass, property, HandOver;

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../core/MathUtils", _context.meta, extras);
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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      MathUtil = _unresolved_2.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6c6ddzlK5NBV4KVU+Q9bOX5", "HandOver", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HandOver", HandOver = (_dec = ccclass('HandOver'), _dec(_class = class HandOver extends Component {
        handOver(packNode, handOverNode, callBack) {
          //  GlobeVariable.handOverPhase = true;
          // 获取交付位置节点
          var handOverPosNode = handOverNode;

          if (!handOverPosNode) {
            console.error("找不到交付位置节点");
            return;
          }

          var handOverPos = handOverPosNode.worldPosition.clone();
          var woodNode = packNode;
          var woodWorldPos = woodNode.getWorldPosition().clone(); // 计算贝塞尔曲线控制点（提升高度可配置）

          var LIFT_HEIGHT = 10; // 可提取为配置项
          //  const controlPoint = new Vec3(
          //      (woodNode.worldPosition.x + handOverPos.x) / 2,
          //      (woodNode.worldPosition.y + handOverPos.y) / 2 + LIFT_HEIGHT,
          //      (woodNode.worldPosition.z + handOverPos.z) / 2
          //  );

          var controlPoint = new Vec3(woodNode.worldPosition.x, (woodNode.worldPosition.y + handOverPos.y) / 2 + LIFT_HEIGHT, woodNode.worldPosition.z); // 执行贝塞尔曲线动画

          tween(woodNode).to(0.1, {
            scale: new Vec3(6, 6, 6)
          }, {
            easing: 'cubicInOut',
            onUpdate: (target, ratio) => {
              // GlobeVariable.handOverPhase = true;
              // 计算贝塞尔曲线位置
              var position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(woodWorldPos, controlPoint, handOverPos, ratio);
              target.worldPosition = position;
            }
          }).call(() => {
            // 从场景中移除木头
            woodNode.removeFromParent();
            woodNode.destroy(); //  GlobeVariable.handOverPhase = false;

            callBack();
          }).start();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a46965c6c81185bdefc05154886d1519948bbaa6.js.map