System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, find, Quat, v3, Vec3, VirtualInput, _dec, _class, _class2, _descriptor, _crd, ccclass, property, MoveBase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfVirtualInput(extras) {
    _reporterNs.report("VirtualInput", "../UI/VirtuallInput", _context.meta, extras);
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
      find = _cc.find;
      Quat = _cc.Quat;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      VirtualInput = _unresolved_2.VirtualInput;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "afeeav5qMZLvpkPCQoISvta", "MoveBase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'find', 'Node', 'Quat', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MoveBase", MoveBase = (_dec = ccclass('MoveBase'), _dec(_class = (_class2 = class MoveBase extends Component {
        constructor() {
          super(...arguments);

          // 添加移动平滑系数
          _initializerDefineProperty(this, "moveSmoothFactor", _descriptor, this);

          // 移动平滑系数，值越小越平滑
          // 保存上一帧的移动方向，用于平滑处理
          this.lastMoveDir = v3();
        }

        handleInput(dt, entity) {
          var x = (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).horizontal;
          var y = (_crd && VirtualInput === void 0 ? (_reportPossibleCrUseOfVirtualInput({
            error: Error()
          }), VirtualInput) : VirtualInput).vertical; // 如果没有输入，停止移动

          if (x === 0 && y === 0) {
            entity.destForward.set(0, 0, 0);
            return;
          }

          var camNode = find("Main Camera");
          if (!camNode) return; // 获取摄像机的世界旋转

          var camRot = camNode.getWorldRotation(); // 计算基于摄像机的移动方向

          var forward = new Vec3(0, 0, -1);
          var right = new Vec3(1, 0, 0); // 将方向向量应用摄像机旋转

          Vec3.transformQuat(forward, forward, camRot);
          Vec3.transformQuat(right, right, camRot); // 只保留水平分量

          forward.y = 0;
          right.y = 0;
          forward.normalize();
          right.normalize(); // 计算最终移动方向

          var moveDir = new Vec3();
          Vec3.scaleAndAdd(moveDir, moveDir, right, x);
          Vec3.scaleAndAdd(moveDir, moveDir, forward, y);
          moveDir.normalize(); // 对移动方向进行平滑处理，避免突然变化

          if (moveDir.length() > 0.1) {
            moveDir.normalize(); // 线性插值平滑过渡

            Vec3.lerp(this.lastMoveDir, this.lastMoveDir, moveDir, this.moveSmoothFactor);
            this.lastMoveDir.normalize();
          } else {
            this.lastMoveDir.set(0, 0, 0);
          } // 保存目标方向


          entity.destForward.set(this.lastMoveDir); // 执行移动和旋转

          this.doMove(dt, entity);
          this.doRotate(dt, entity);
        }

        doMove(dt, entity) {
          // 使用目标方向和速度计算位移
          var velocity = v3();
          Vec3.multiplyScalar(velocity, entity.destForward, entity.moveSpeed * dt); // 更新位置

          var currentPos = entity.node.getWorldPosition();
          entity.node.setWorldPosition(currentPos.x + velocity.x, currentPos.y, currentPos.z + velocity.z);
        }

        doRotate(dt, entity) {
          // 如果没有目标方向，不进行旋转
          if (entity.destForward.length() < 0.1) return; // 计算目标旋转

          var targetQuat = new Quat();
          Quat.fromViewUp(targetQuat, entity.destForward, Vec3.UP); // 平滑旋转到目标方向

          var currentRot = entity.node.getWorldRotation();
          Quat.slerp(currentRot, currentRot, targetQuat, dt * entity.rotateSpeed); // 应用旋转

          entity.node.setWorldRotation(currentRot);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSmoothFactor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2ce2e94782ac829500e745cc67639394fc1a876f.js.map