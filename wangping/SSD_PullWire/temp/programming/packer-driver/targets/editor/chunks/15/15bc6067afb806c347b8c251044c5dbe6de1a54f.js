System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Mat4, Vec2, Vec3, DataManager, TransformPositionUtil, _crd;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Mat4 = _cc.Mat4;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "45d52gRTFxPwpLkvERXyeRo", "TransformPositionUtil", undefined);

      __checkObsolete__(['Camera', 'geometry', 'Mat4', 'UITransform', 'Vec2', 'Vec3']);

      _export("default", TransformPositionUtil = class TransformPositionUtil {
        // 获取点在远近平面之间的比例 (0=近平面, 1=远平面)
        static getDepthRatio(camera, worldPos) {
          // 创建逆矩阵
          const inverseMat = new Mat4();
          Mat4.invert(inverseMat, camera.node.worldMatrix); // 应用矩阵变换

          const localPos = new Vec3();
          Vec3.transformMat4(localPos, worldPos, inverseMat);
          const depth = -localPos.z; // 视图空间中的深度值
          // 计算标准化深度 (0到1之间)

          return (depth - camera.near) / (camera.far - camera.near);
        }
        /**
         * 计算点C在AB直线上的投影比例
         * @param a 点A坐标
         * @param b 点B坐标 
         * @param c 点C坐标
         * @returns 投影点到A的距离与AB长度的比例 (范围可能超出[0,1])
         */


        static getProjectionRatio(a, b, c) {
          // 计算向量AB和AC
          const ab = b.subtract(a);
          const ac = c.subtract(a); // 计算AB长度的平方

          const abLengthSq = ab.lengthSqr(); // 如果AB长度接近0，返回0避免除零错误

          if (abLengthSq < Number.EPSILON) {
            return 0;
          } // 计算投影比例 (向量点积公式)


          const ratio = Vec2.dot(ac, ab) / abLengthSq;
          return ratio;
        }
        /**
         * 获取插件位置 (主方法)
         */


        static getPlugPos(pos) {
          const camera = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          const ray = camera.screenPointToRay(pos.x, pos.y);
          const lastPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.nowPlug.worldPosition.clone(); // 1. 计算射线上最近的点

          const closestPoint = this.getClosestPointOnRay(ray, lastPos); // 2. 应用高度曲线

          closestPoint.y = this.calculateHeight(closestPoint.x, closestPoint.z); // 3. 边界限制
          //this.applyBoundaryLimits(closestPoint);
          // 4. 动态平滑处理

          return this.applySmoothing(lastPos, closestPoint);
        }
        /**
         * 计算射线上距离目标点最近的点
         */


        static getClosestPointOnRay(ray, targetPoint) {
          const rayDirection = ray.d.normalize();
          const rayToPoint = Vec3.subtract(new Vec3(), targetPoint, ray.o);
          const projection = Vec3.dot(rayToPoint, rayDirection);
          return projection <= 0 ? ray.o.clone() : ray.o.add(rayDirection.multiplyScalar(projection));
        }
        /**
         * 高度计算函数 (基于与原点距离)
         */


        static calculateHeight(x, z) {
          const distance = Math.sqrt(x * x + z * z);
          const normalizedDistance = Math.min(distance, 10); // 二次曲线平滑过渡：原点高度10，距离10时高度3

          return 3 + 7 * Math.pow(1 - normalizedDistance / 10, 2);
        }
        /**
         * 应用移动边界限制
         */


        static applyBoundaryLimits(pos) {
          // 移动边界限制
          let moveBoundary = 10.0;
          const len = Math.sqrt(pos.x * pos.x + pos.z * pos.z);

          if (len > moveBoundary) {
            const factor = moveBoundary / len;
            pos.x *= factor;
            pos.z *= factor;
          }
        }
        /**
         * 应用动态平滑过渡
         */


        static applySmoothing(lastPos, targetPos) {
          // 平滑系数 (0.1-1.0，越小越平滑)
          let smoothFactor = 0.3; // 最大移动距离 (防止瞬间跳跃)

          let maxMoveDistance = 5.0; // 计算实际移动距离

          const moveDistance = Vec3.distance(lastPos, targetPos); // 动态调整平滑系数 (移动越快越不平滑)

          const dynamicSmooth = Math.min(smoothFactor, 1 / (moveDistance + 0.1)); // 限制最大移动距离

          if (moveDistance > maxMoveDistance) {
            return lastPos;
          } // 应用线性插值


          return new Vec3(lastPos.x + (targetPos.x - lastPos.x) * dynamicSmooth, lastPos.y + (targetPos.y - lastPos.y) * dynamicSmooth, lastPos.z + (targetPos.z - lastPos.z) * dynamicSmooth);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=15bc6067afb806c347b8c251044c5dbe6de1a54f.js.map