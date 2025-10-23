System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Quat, Vec3, _dec, _class, _crd, ccclass, property, _lookAtTarget, _rotationQuat, FenceBloodBarManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7835exB4ExJh5nEzrJe82hO", "FenceBloodBarManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'find', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      _lookAtTarget = new Vec3();
      _rotationQuat = new Quat();

      _export("FenceBloodBarManager", FenceBloodBarManager = (_dec = ccclass('FenceBloodBarManager'), _dec(_class = class FenceBloodBarManager extends Component {
        constructor() {
          super(...arguments);
          this.mainCamera = null;
          this._startRot = new Vec3(-45, 47.5, 0);
        }

        start() {
          var newAngle = new Vec3();
          Vec3.subtract(newAngle, this._startRot, this.node.parent.eulerAngles);
          this.node.eulerAngles = newAngle;
        } // update(deltaTime: number) {
        //     if (!this.mainCamera) return;
        //     // 获取摄像机世界位置
        //     const cameraWorldPos = this.mainCamera.worldPosition;
        //     // 设置朝向目标点为摄像机位置
        //     this.node.getWorldPosition(_lookAtTarget);
        //     // 计算从当前节点位置指向摄像机方向的旋转
        //     Vec3.subtract(_lookAtTarget, cameraWorldPos, _lookAtTarget);
        //     _lookAtTarget.normalize();
        //     Quat.fromViewUp(_rotationQuat, _lookAtTarget.negative(), Vec3.UP);
        //     this.node.worldRotation = _rotationQuat;
        // }


      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b7938dfb0f8f6ad6ba7da7b1585665979cea2dbf.js.map