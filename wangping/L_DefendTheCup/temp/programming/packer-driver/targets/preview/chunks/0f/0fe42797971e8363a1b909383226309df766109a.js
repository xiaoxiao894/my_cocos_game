System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, geometry, PhysicsSystem, Vec2, Vec3, view, DataManager, MonsterBorn, _crd;

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
      geometry = _cc.geometry;
      PhysicsSystem = _cc.PhysicsSystem;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      view = _cc.view;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2496fWeC2BA3a6PGJiZ2mIc", "MonsterBorn", undefined);

      __checkObsolete__(['Camera', 'geometry', 'PhysicsSystem', 'Vec2', 'Vec3', 'view']);

      /**
       * 怪出生坐标计算
       */
      _export("default", MonsterBorn = class MonsterBorn {
        static getWorldBornPos() {
          var cameraMain = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.camera;
          var centerWorld = new Vec3(0, 0, 0); //  地图中心点（可改为自定义节点位置）

          var radius = 40; //  固定生成半径

          var maxTry = 10;

          for (var i = 0; i < maxTry; i++) {
            var angle = Math.random() * 2 * Math.PI; //  在中心点为圆心的固定半径圆环上生成点

            var offset = new Vec3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            var targetWorld = centerWorld.clone().add(offset); //  将该点转为屏幕坐标

            var screenPos = cameraMain.worldToScreen(targetWorld);
            var screenSize = view.getVisibleSize(); //  仅接受屏幕外的点

            if (screenPos.x < 0 || screenPos.x > screenSize.width || screenPos.y < 0 || screenPos.y > screenSize.height) {
              var ray = new geometry.Ray();
              cameraMain.screenPointToRay(screenPos.x, screenPos.y, ray);
              var mask = 0xffffffff;
              var rayDistance = 1000;
              var queryTrigger = true;

              if (PhysicsSystem.instance.raycastClosest(ray, mask, rayDistance, queryTrigger)) {
                var hitPoint = PhysicsSystem.instance.raycastClosestResult.hitPoint.clone();
                return hitPoint;
              }
            }
          }

          console.warn("未找到合法出生点（屏幕外 + 固定半径）");
          return null;
        } // //怪出生世界坐标
        // public static getWorldBornPos(): Vec3 {
        //     //有效范围
        //     let fixedY: number = 1;
        //     //随机角度
        //     let radAngle: number = this.randomAngle();
        //     //console.log(`monster radAngle ${radAngle}`);
        //     let cameraMain: Camera = DataManager.Instance.mainCamera.camera;
        //     let uiPos: Vec2 = this.getRayRectangleIntersection(radAngle);
        //     if (uiPos) {
        //         //console.log(`monster sceenPos ${uiPos.x} ${uiPos.y}`);
        //         let ray: geometry.Ray = new geometry.Ray();
        //         cameraMain.screenPointToRay(uiPos.x, uiPos.y, ray);
        //         //cameraMain.screenPointToRay(view.getViewportRect().width/2,view.getViewportRect().height/2,ray);
        //         // 以下参数可选
        //         const mask = 0xffffffff;
        //         const maxDistance = 10000000;
        //         const queryTrigger = true;
        //         if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
        //             const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
        //             const hitPoint = raycastClosestResult.hitPoint;
        //             //console.log(`monster worldPos ${hitPoint}`);   
        //             //pos.y = fixedY;
        //             return hitPoint;
        //         } else {
        //             console.log("no raycastClosest");
        //         }
        //     } else {
        //         console.log("no sceenPos");
        //     }
        //     return null;
        // }

        /**
         * 随机角度
         * @returns radAngle 弧度
         */


        static randomAngle() {
          var pos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.player.node.worldPosition; //console.log(pos);

          var x = pos.x,
              z = -pos.z; // 注意z轴取反
          // 计算指向中心的基准角度

          var centerAngle = Math.atan2(z, x) + Math.PI; // 确定边界条件

          var atXBoundary = Math.abs(x) > this.xBoundary;
          var atZBoundary = Math.abs(z) > this.zBoundary; // 计算随机角度范围

          if (atXBoundary && atZBoundary) {
            // 角落区域：中心角度±π/4范围
            return centerAngle + (Math.random() - 0.5) * Math.PI / 2;
          } else if (atXBoundary) {
            // X边界：确保cos方向正确
            return x > 0 ? Math.PI / 2 + Math.random() * Math.PI // π/2 到 3π/2(左)
            : -Math.PI / 2 + Math.random() * Math.PI; // -π/2 到 π/2(右)
          } else if (atZBoundary) {
            // Z边界：确保sin方向正确
            return z > 0 ? Math.PI + Math.random() * Math.PI // π 到 2π(下)
            : Math.random() * Math.PI; // 0 到 π(上)
          } // 无边界限制：完全随机


          return Math.random() * Math.PI * 2;
        }

        static getRayRectangleIntersection(angle) {
          //x cos y sin
          var cosA = Math.cos(angle);
          var sinA = Math.sin(angle);
          var screen = view.getVisibleSize(); // 矩形边界范围（假设矩形是轴对齐的）

          var bounder = 20;
          var xMin = 0 - bounder;
          var xMax = screen.width + bounder;
          var yMin = 0 - bounder;
          var yMax = screen.height + bounder; // 处理极端情况

          var epsilon = 0.0001; // 从屏幕中心发射射线

          var rayOrigin = new Vec2(screen.width / 2, screen.height / 2);
          var nearestT = Infinity;
          var intersection = null; // 处理完全垂直或水平的射线

          if (Math.abs(cosA) < epsilon) {
            // 垂直射线
            return new Vec2(0, sinA > 0 ? yMax : yMin);
          }

          if (Math.abs(sinA) < epsilon) {
            // 水平射线
            return new Vec2(cosA > 0 ? xMax : xMin, 0);
          } // 右边界 x = xMax


          var tRight = (xMax - rayOrigin.x) / cosA;
          var yRight = rayOrigin.y + tRight * sinA;

          if (tRight > epsilon && yRight >= yMin && yRight <= yMax && tRight < nearestT) {
            nearestT = tRight;
            intersection = new Vec2(xMax, yRight);
          } // 左边界 x = xMin


          var tLeft = (xMin - rayOrigin.x) / cosA;
          var yLeft = rayOrigin.y + tLeft * sinA;

          if (tLeft > epsilon && yLeft >= yMin && yLeft <= yMax) {
            nearestT = tLeft;
            intersection = new Vec2(xMin, yLeft);
          } // 上边界 y = yMax


          var tTop = (yMax - rayOrigin.y) / sinA;
          var xTop = rayOrigin.x + tTop * cosA;

          if (tTop > epsilon && xTop >= xMin && xTop <= xMax && tTop < nearestT) {
            nearestT = tTop;
            intersection = new Vec2(xTop, yMax);
          } // 下边界 y = yMin


          var tBottom = (yMin - rayOrigin.y) / sinA;
          var xBottom = rayOrigin.x + tBottom * cosA;

          if (tBottom > epsilon && xBottom >= xMin && xBottom <= xMax && tBottom < nearestT) {
            nearestT = tBottom;
            intersection = new Vec2(xBottom, yMin);
          }

          return intersection;
        }

      });

      MonsterBorn.xBoundary = 30;
      MonsterBorn.zBoundary = 30;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0fe42797971e8363a1b909383226309df766109a.js.map