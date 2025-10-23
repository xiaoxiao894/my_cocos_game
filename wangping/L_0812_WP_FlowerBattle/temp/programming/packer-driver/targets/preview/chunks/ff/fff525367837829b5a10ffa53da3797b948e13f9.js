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

      _cclegacy._RF.push({}, "c96adGipyhEgo+2O3DP1nO9", "MathUtils", undefined);

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
          if (!(targetNode != null && targetNode.isValid)) {
            console.warn('Target node is invalid!');
            return localPos.clone();
          } // 确保worldMatrix是最新的


          targetNode.updateWorldTransform();
          var worldPos = new Vec3();
          var mat = new Mat4();
          targetNode.getWorldMatrix(mat);
          Vec3.transformMat4(worldPos, localPos, mat);
          return worldPos;
        }

        static signAngle(from, to, axis) {
          var angle = Vec3.angle(from, to);
          Vec3.cross(tempVec, from, to);
          var sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
          return angle * sign;
        }
        /**
         * 将欧拉角（弧度制）转换为 forward 向量
         * @param eulerAngles - 欧拉角（弧度制，顺序可能是 XYZ/YXZ，取决于引擎）
         * @returns forward 向量（单位向量，指向物体的前向方向）
         */


        static eulerToForward(eulerAngles) {
          // 1. 将欧拉角转换为四元数
          var rotation = new Quat();
          Quat.fromEuler(rotation, eulerAngles.x, eulerAngles.y, eulerAngles.z); // 2. 定义默认 forward 方向（Cocos Creator 默认是 -Z 轴）

          var forward = new Vec3(0, 0, -1); // 3. 应用旋转

          Vec3.transformQuat(forward, forward, rotation); // 4. 归一化（确保是单位向量）

          Vec3.normalize(forward, forward);
          return forward;
        }

        static bezierCurve(start, control, end, t) {
          var u = 1 - t;
          var tt = t * t;
          var uu = u * u;
          var p = new Vec3();
          p.x = uu * start.x + 2 * u * t * control.x + tt * end.x;
          p.y = uu * start.y + 2 * u * t * control.y + tt * end.y;
          p.z = uu * start.z + 2 * u * t * control.z + tt * end.z;
          return p;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fff525367837829b5a10ffa53da3797b948e13f9.js.map