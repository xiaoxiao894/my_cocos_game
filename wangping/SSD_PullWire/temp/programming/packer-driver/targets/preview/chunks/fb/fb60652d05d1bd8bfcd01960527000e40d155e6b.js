System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, PhysicsSystem, instantiate, Node, Vec3, Quat, CylinderCollider, RigidBody, MathUtil, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, RopeGeneratorNew;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Utils/MathUtils", _context.meta, extras);
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
      PhysicsSystem = _cc.PhysicsSystem;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
      CylinderCollider = _cc.CylinderCollider;
      RigidBody = _cc.RigidBody;
    }, function (_unresolved_2) {
      MathUtil = _unresolved_2.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b5c57F/BdtAa5MkaWem4hsi", "RopeGeneratorNew", undefined);

      __checkObsolete__(['_decorator', 'Component', 'PhysicsSystem', 'instantiate', 'Node', 'Vec3', 'Quat', 'CylinderCollider', 'RigidBody']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RopeGeneratorNew", RopeGeneratorNew = (_dec = ccclass('RopeGeneratorNew'), _dec2 = property(Node), _dec(_class = (_class2 = class RopeGeneratorNew extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "ropeSegmentPrefab", _descriptor, this);

          this.staticTar = null;
          this.plugTar = null;
          this.head = null;
          this.tail = null;
          this.headConstraint = null;
          this.tailConstraint = null;
          this.rope = [];
          this.joints = [];
          this.cannonWorld = null;
          this._diameter = 0.4;
          this._yLen = 10;
          //停止绳子表现更新 timer
          this._stopTimer = void 0;
          //停止绳子平滑更新 timer
          this._stopSmoothTimer = void 0;
          //是否更新绳子可视化表现
          this._updateVisuals = false;
        }

        update(deltaTime) {
          // 更新绳子的可视化表现
          this.updateRopeVisuals();
        } // 更新绳子的可视化效果


        updateRopeVisuals() {
          if (this.rope.length < 2) return;

          if (!this._updateVisuals) {
            return;
          }

          var sampleDir = new Vec3();
          var poses = [];

          for (var i = 0; i < this.rope.length - 1; i++) {
            poses.push(this.rope[i].getWorldPosition());
          } //console.log(JSON.stringify(poses));
          // 处理头节点与第一个节点之间的连接


          if (this.head && this.rope.length > 0) {
            var headPos = this.head.getWorldPosition();
            var firstNodePos = this.rope[0].getWorldPosition();
            Vec3.subtract(sampleDir, firstNodePos, headPos);
            var length = Vec3.len(sampleDir);

            if (length > 0.001) {
              Vec3.multiplyScalar(sampleDir, sampleDir, 1.0 / length);
              var rotation = new Quat();
              Quat.rotationTo(rotation, new Vec3(0, 1, 0), sampleDir);
              this.head.setWorldRotation(rotation); // 调整头节点的缩放，使其覆盖整个距离

              var scale = new Vec3(this._diameter, length, this._diameter);
              this.head.setWorldScale(scale); // 将头节点放在两点之间的中心

              var midPoint = new Vec3();
              Vec3.lerp(midPoint, headPos, firstNodePos, 0);
              this.head.setWorldPosition(midPoint);
            }
          } // 处理绳子节点之间的连接，确保它们形成连续的线


          for (var _i = 0; _i < this.rope.length - 1; _i++) {
            var currentNode = this.rope[_i];
            var nextNode = this.rope[_i + 1];
            var currentPos = currentNode.getWorldPosition();
            var nextPos = nextNode.getWorldPosition();
            Vec3.subtract(sampleDir, nextPos, currentPos);

            var _length = Vec3.len(sampleDir);

            if (_length < 0.001) continue;
            Vec3.multiplyScalar(sampleDir, sampleDir, 1.0 / _length);

            var _rotation = new Quat();

            Quat.rotationTo(_rotation, new Vec3(0, 1, 0), sampleDir);
            currentNode.setWorldRotation(_rotation); // 使用完整长度的圆柱体表示绳子段

            var _scale = new Vec3(this._diameter, _length, this._diameter);

            currentNode.setWorldScale(_scale); // 将节点放在两点之间的中心

            var _midPoint = new Vec3();

            Vec3.lerp(_midPoint, currentPos, nextPos, 0.5);
            currentNode.setWorldPosition(_midPoint);
          }
        }

        createRope(nodes, staticTar, plugTar) {
          this.staticTar = staticTar;
          this.plugTar = plugTar;
          this.cannonWorld = PhysicsSystem.instance.physicsWorld.impl; // 清除之前的绳子
          //this.clearRope();
          // 初始化头节点

          this.head = this.node; // 设置插头和静态目标为静态刚体

          var plugRb = plugTar.getComponent(RigidBody);
          plugRb.type = 2; //plugRb.type = RigidBody.Type.STATIC;

          var staticRb = staticTar.getComponent(RigidBody);
          staticRb.type = 2; //staticRb.type = RigidBody.Type.STATIC;
          // 设置头节点为动态刚体

          var headRb = this.head.getComponent(RigidBody);
          headRb.type = 1; //headRb.type = RigidBody.Type.DYNAMIC; // 修改为DYNAMIC

          headRb.allowSleep = false;
          headRb.mass = 0.1;
          headRb.linearDamping = 0.8;
          headRb.angularDamping = 0.8; // 创建绳子节点

          var prevNode = this.head;
          var prevBody = headRb._body.impl; // 绑定头节点到插头

          var plugBody = plugRb._body.impl;
          this.headConstraint = new CANNON.PointToPointConstraint(prevBody, new CANNON.Vec3(0, 0, 0), plugBody, new CANNON.Vec3(0, 0, 0));
          this.cannonWorld.addConstraint(this.headConstraint);
          this.joints.push(this.headConstraint); // 使用距离约束

          var headDistanceConstraint = new CANNON.DistanceConstraint(prevBody, plugBody, -0.1, 100 // 降低强度以增加柔软度
          );
          this.cannonWorld.addConstraint(headDistanceConstraint);
          this.joints.push(headDistanceConstraint);
          var curvePoints = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).generateSmoothPath(plugTar.getWorldPosition().clone(), staticTar.getWorldPosition().clone(), nodes, -4.34); //console.log(JSON.stringify(curvePoints));
          // 生成绳子节点

          for (var i = 1; i < nodes; i++) {
            // 创建新节点
            var newNode = instantiate(this.head);
            this.node.parent.addChild(newNode);
            this.rope.push(newNode); // 设置物理属性

            var newRb = newNode.getComponent(RigidBody);
            newRb.type = 1; //newRb.type = RigidBody.Type.DYNAMIC;

            newRb.mass = 0.1;
            newRb.linearDamping = 0.8;
            newRb.angularDamping = 0.8; // 确保节点有圆柱体碰撞器用于渲染

            var collider = newNode.getComponent(CylinderCollider);

            if (!collider) {
              collider = newNode.addComponent(CylinderCollider);
              collider.radius = 0.025;
              collider.height = 1.0;
              collider.direction = 1; // Y轴方向
            } // 计算位置


            var t = i / (nodes - 1);
            newNode.setWorldPosition(curvePoints[i].position); //console.log(`rope pos ${i} ${JSON.stringify(newNode.worldPosition)}`);

            newNode.rotation = curvePoints[i].rotation; // 添加物理约束

            var currBody = newRb._body.impl; //const distance = Vec3.distance(prevNode.worldPosition,newNode.worldPosition);
            // 使用距离约束

            var distanceConstraint = new CANNON.DistanceConstraint(prevBody, currBody, 0, 100 // 降低强度以增加柔软度
            );
            this.cannonWorld.addConstraint(distanceConstraint);
            this.joints.push(distanceConstraint); // 添加铰链约束以限制弯曲

            if (i > 1) {
              //const prevPrevNode = i === 1 ? this.head : this.rope[i - 2];
              //const prevPrevBody = (prevPrevNode.getComponent(RigidBody) as any)._body.impl;
              var hingeConstraint = new CANNON.ConeTwistConstraint(prevBody, currBody, {
                pivotA: new CANNON.Vec3(0, 0, 0),
                pivotB: new CANNON.Vec3(0, 0, 0),
                axisA: new CANNON.Vec3(0, 1, 0),
                axisB: new CANNON.Vec3(0, 1, 0) //angle: Math.PI / 8, // 限制弯曲角度
                // twistAngle: Math.PI / 4

              });
              this.cannonWorld.addConstraint(hingeConstraint);
              this.joints.push(hingeConstraint);
            }

            prevNode = newNode;
            prevBody = currBody;
          } // 设置尾节点


          this.tail = prevNode; // 绑定尾节点到静态目标

          var tailRb = this.tail.getComponent(RigidBody);
          var tailBody = tailRb._body.impl;
          var staticBody = staticRb._body.impl;
          this.tailConstraint = new CANNON.PointToPointConstraint(tailBody, new CANNON.Vec3(0, 0, 0), staticBody, new CANNON.Vec3(0, -0.05, 0));
          this.cannonWorld.addConstraint(this.tailConstraint);
          this.joints.push(this.tailConstraint);
          this.startRopeMovement(); //8秒后停止平滑处理

          this._stopSmoothTimer = setTimeout(() => {
            this.unschedule(this.smoothRopeMovement);
          }, 8000);
          return this.head;
        } // 平滑绳子运动


        smoothRopeMovement() {
          // 应用平滑处理到所有绳子节点
          for (var i = 0; i < this.rope.length; i++) {
            var node = this.rope[i];
            var rb = node.getComponent(RigidBody);
            if (!rb) continue;
            var body = rb._body.impl; // 降低角速度

            body.angularVelocity.scale(0.9); // 如果速度很小，直接设为0

            if (body.velocity.lengthSquared() < 0.05) {
              body.velocity.scale(0.9);
            }

            if (body.angularVelocity.lengthSquared() < 0.05) {
              body.angularVelocity.setZero();
            } // 对中间节点应用额外平滑


            if (i > 0 && i < this.rope.length - 1) {
              var prevNode = this.rope[i - 1];
              var nextNode = this.rope[i + 1];
              var prevPos = prevNode.getWorldPosition();
              var nextPos = nextNode.getWorldPosition(); // 计算平均位置

              var avgPos = new Vec3((prevPos.x + nextPos.x) * 0.5, (prevPos.y + nextPos.y) * 0.5, (prevPos.z + nextPos.z) * 0.5); // 轻微地向平均位置移动

              var currPos = node.getWorldPosition();
              var newPos = new Vec3(currPos.x * 0.95 + avgPos.x * 0.05, currPos.y * 0.95 + avgPos.y * 0.05, currPos.z * 0.95 + avgPos.z * 0.05); // 应用新位置

              node.setWorldPosition(newPos);
            }
          } // 处理头节点


          if (this.head) {
            var headRb = this.head.getComponent(RigidBody);

            if (headRb) {
              var headBody = headRb._body.impl;
              headBody.angularVelocity.scale(0.9);
            }
          }
        } // 清除绳子


        clearRope() {
          this.scheduleOnce(() => {
            var _this$node$getCompone;

            this.unschedule(this.smoothRopeMovement);
            this._updateVisuals = false; // 移除所有约束

            if (this.joints.length > 0) {
              for (var joint of this.joints) {
                if (this.cannonWorld) {
                  this.cannonWorld.removeConstraint(joint);
                }
              }

              this.joints = [];
            } //去掉所有刚体


            this.rope.forEach(node => {
              var _node$getComponent, _node$getComponent2;

              (_node$getComponent = node.getComponent(RigidBody)) == null || _node$getComponent.destroy();
              (_node$getComponent2 = node.getComponent(CylinderCollider)) == null || _node$getComponent2.destroy();
            });
            (_this$node$getCompone = this.node.getComponent(RigidBody)) == null || _this$node$getCompone.destroy(); // 移除所有节点
            // for (const node of this.rope) {
            //     node.destroy();
            // }
            // this.rope = [];

            this.headConstraint = null;
            this.tailConstraint = null;
          }, 5);
        }

        onDestroy() {
          // 清理资源
          this.clearRope();
        }

        startRopeMovement() {
          // 启用平滑处理
          this.unschedule(this.smoothRopeMovement);
          this.schedule(this.smoothRopeMovement, 0.01);
        } //开始更新绳子可视化表现


        startMove() {
          this._updateVisuals = true;
          clearTimeout(this._stopTimer);
          clearTimeout(this._stopSmoothTimer);
          this.startRopeMovement();
        } //停止更新绳子可视化表现


        stopMove() {
          this._stopTimer = setTimeout(() => {
            this._updateVisuals = false;
            this.unschedule(this.smoothRopeMovement);
          }, 5000);
        }

        shackRope() {
          console.log("没平滑"); // this.rope.forEach((body, index) => {
          //     this.scheduleOnce(() => {
          //         body.getComponent(RigidBody).applyImpulse(new Vec3(0, 1, 0));
          //     }, index * 0.01); // 延迟时间产生波浪效果
          // });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ropeSegmentPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fb60652d05d1bd8bfcd01960527000e40d155e6b.js.map