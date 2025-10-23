System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, v3, Quat, Mat4, MathUtil, _crd, tempVec, tempVec2, tempVec3, up;

  _export("MathUtil", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
      v3 = _cc.v3;
      Quat = _cc.Quat;
      Mat4 = _cc.Mat4;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7c0b5+C9GtPBpG5PHvh+cLh", "MathUtils", undefined);

      __checkObsolete__(['_decorator', 'Vec3', 'v3', 'Quat', 'Mat4', 'Node']);

      tempVec = v3();
      tempVec2 = v3();
      tempVec3 = v3();
      up = v3();

      _export("MathUtil", MathUtil = class MathUtil {
        /**
         * 生成平滑3D路径
         * @param startPos 起点位置
         * @param endPos 终点位置
         * @param segmentCount 生成的段数
         * @param curveHeight 曲线高度(控制路径弯曲程度)
         * @returns 包含位置和旋转的路径点数组
         */
        static generateSmoothPath(startPos, endPos, segmentCount, curveHeight) {
          if (segmentCount === void 0) {
            segmentCount = 100;
          }

          if (curveHeight === void 0) {
            curveHeight = 5;
          }

          // 计算结果数组
          var pathPoints = []; // 计算中间控制点(形成曲线顶部)

          var midPoint = Vec3.lerp(new Vec3(), startPos, endPos, 0.5);
          midPoint.y += curveHeight; // 计算所有点的位置(二次贝塞尔曲线)

          var positions = [];

          for (var i = 0; i <= segmentCount; i++) {
            var t = i / segmentCount;
            positions.push(this.quadraticBezier(startPos, midPoint, endPos, t));
          } // 计算每个点的旋转角度(基于切线方向)


          for (var _i = 0; _i < positions.length; _i++) {
            var tangent = void 0;

            if (_i === 0) {
              // 第一个点：使用下一个点的方向
              tangent = positions[_i + 1].clone();
              tangent = tangent.subtract(positions[_i]);
            } else if (_i === positions.length - 1) {
              // 最后一个点：使用前一个点的方向
              tangent = positions[_i].clone();
              tangent = tangent.subtract(positions[_i - 1]);
            } else {
              // 中间点：使用前后点的平均方向
              var prevDir = positions[_i].clone();

              prevDir.subtract(positions[_i - 1]);

              var nextDir = positions[_i + 1].clone();

              nextDir.subtract(positions[_i]);
              tangent = prevDir.add(nextDir).multiplyScalar(0.5);
            }

            tangent.normalize(); // 计算旋转(使物体朝向切线方向)

            var rotation = new Quat();

            if (!tangent.equals(Vec3.ZERO)) {
              var _up = new Vec3(0, 1, 0);

              Quat.rotationTo(rotation, _up, tangent);
            }

            pathPoints.push({
              position: positions[_i],
              rotation
            });
          }

          return pathPoints;
        } // 二次贝塞尔曲线辅助函数


        static quadraticBezier(p0, p1, p2, t) {
          var u = 1 - t;
          var uu = u * u;
          var tt = t * t;
          var x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
          var y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;
          var z = uu * p0.z + 2 * u * t * p1.z + tt * p2.z;
          return new Vec3(x, y, z);
        } // 计算当前旋转与目标旋转之间的角度差（弧度）


        static getAngleBetweenQuats(currentRot, targetRot) {
          // 计算两个四元数之间的点积
          var dot = Quat.dot(currentRot, targetRot); // 确保点积在有效范围内[-1, 1]

          var clampedDot = Math.min(1, Math.max(-1, dot)); // 返回角度差（弧度）

          return Math.acos(clampedDot) * 2;
        }
        /**
         * 将节点局部坐标转换为世界坐标
         * @param localPos 局部坐标(Vec3)
         * @param targetNode 目标节点(Node)
         * @returns 世界坐标(Vec3)
         */


        static localToWorldPos3D(localPos, targetNode) {
          if (!targetNode.isValid) {
            console.warn('Target node is invalid!');
            return localPos.clone();
          }

          var worldPos = new Vec3();
          Vec3.transformMat4(worldPos, localPos, targetNode.worldMatrix);
          return worldPos;
        }

        static worldToLocal(worldPos, targetNode) {
          // 获取节点的世界变换矩阵的逆矩阵
          var worldMatInv = new Mat4();
          Mat4.invert(worldMatInv, targetNode.worldMatrix); // 应用逆矩阵转换坐标

          var localPos = new Vec3();
          Vec3.transformMat4(localPos, worldPos, worldMatInv);
          return localPos;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3d61e1e43575fbcc496d96ebe2a8e6feec9daa48.js.map