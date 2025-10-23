System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, BoxCollider, Collider, CylinderCollider, Vec3, Vector2, Simulator, RVOObstacles, _crd;

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "../RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "../RVO/Simulator", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      BoxCollider = _cc.BoxCollider;
      Collider = _cc.Collider;
      CylinderCollider = _cc.CylinderCollider;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Vector2 = _unresolved_2.Vector2;
    }, function (_unresolved_3) {
      Simulator = _unresolved_3.Simulator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6c96bkda2lCmZ9E9Z9bp2YP", "RVOObstacles", undefined);

      __checkObsolete__(['BoxCollider', 'Collider', 'CylinderCollider', 'Node', 'Vec3']);

      /**
       * 每个障碍物需要有Collider组件 目前只支持了 BoxCollider 和 CylinderCollider
       */
      _export("default", RVOObstacles = class RVOObstacles {
        static addOneObstacle(obstacle) {
          var collider = obstacle.getComponent(Collider);
          if (!collider) return; // 获取障碍物世界变换信息

          var worldPos = obstacle.worldPosition;
          var worldRotation = obstacle.worldRotation;
          var worldScale = obstacle.worldScale;
          var vertices = [];

          if (collider instanceof BoxCollider) {
            // 盒子碰撞器 - 精确四个角点
            var size = collider.size.clone();
            size.x *= worldScale.x;
            size.z *= worldScale.z; // 定义盒子4个顶点（局部空间）

            var halfExtents = new Vec3(size.x / 2, 0, size.z / 2);
            var corners = [new Vec3(-halfExtents.x, 0, -halfExtents.z), new Vec3(halfExtents.x, 0, -halfExtents.z), new Vec3(halfExtents.x, 0, halfExtents.z), new Vec3(-halfExtents.x, 0, halfExtents.z), new Vec3(-halfExtents.x, 0, -halfExtents.z) // 闭合多边形
            ]; // 转换到世界空间

            corners.forEach(corner => {
              var rotated = Vec3.transformQuat(new Vec3(), corner, worldRotation);
              vertices.push(new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(worldPos.x + rotated.x, worldPos.z + rotated.z));
            });
          } else if (collider instanceof CylinderCollider) {
            // 圆柱体碰撞器 - 用6边形近似
            var radius = collider.radius * Math.max(worldScale.x, worldScale.z);
            var segments = 6; // 6边形

            for (var j = 0; j <= segments; j++) {
              // 注意这里 j <= segments 确保闭合
              var angle = j / segments * Math.PI * 2;
              var x = Math.cos(angle) * radius;
              var z = Math.sin(angle) * radius;
              vertices.push(new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
                error: Error()
              }), Vector2) : Vector2)(worldPos.x + x, worldPos.z + z));
            }
          } // 添加到RVO2仿真器


          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.addObstacle(vertices);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ee20e4c1ed1031dc95bdbbe4a6411013562fd7e6.js.map