System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Collider, Component, find, instantiate, Mat4, Pool, RigidBody, tween, Vec3, DataManager, EntityTypeEnum, MathUtil, _dec, _class, _crd, ccclass, property, WoodManager;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Util/MathUtil", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Collider = _cc.Collider;
      Component = _cc.Component;
      find = _cc.find;
      instantiate = _cc.instantiate;
      Mat4 = _cc.Mat4;
      Pool = _cc.Pool;
      RigidBody = _cc.RigidBody;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }, function (_unresolved_4) {
      MathUtil = _unresolved_4.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "16da365oKBCmolA8PD5lVyC", "WoodManager", undefined);

      __checkObsolete__(['_decorator', 'Collider', 'Component', 'find', 'instantiate', 'Mat4', 'Node', 'Pool', 'RigidBody', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("WoodManager", WoodManager = (_dec = ccclass('WoodManager'), _dec(_class = class WoodManager extends Component {
        constructor() {
          super(...arguments);
          this._woodPool = null;
          this._woodCount = 300;
          this._woodMaxNum = 3;
          this._woodMinNum = 3;
          this._woodList = [];
          this.stackGap = 0.5;
          this.arcOffset = -2;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.woodManager = this;
        }

        woodManagerInit() {
          this._woodPool = new Pool(() => {
            var woodPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Wood);
            return instantiate(woodPrefab);
          }, this._woodCount, node => {
            node.removeFromParent();
          });
        }

        createWood() {
          if (!this._woodPool) return;

          var node = this._woodPool.alloc();

          if (node.parent == null) node.setParent(this.node);
          node.active = true;
          return node;
        }

        onDestroy() {
          this._woodPool.destroy();
        } // 回收木桩


        onWoodDead(node) {
          node.active = false;

          this._woodPool.free(node);
        } // 随机生成木桩


        generateWoods(isPlayer, treeNode, role) {
          var _this = this;

          var woods = find("THREE3DNODE/Woods");
          if (!woods) return;
          var renderWoodNum = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).getRandom(this._woodMinNum, this._woodMaxNum);
          var startPos = treeNode.worldPosition;

          var _loop = function _loop() {
            var woodPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Wood);
            var wood = instantiate(woodPrefab);
            wood["__isReady"] = false;
            woods.addChild(wood); // === 随机目标点（相对世界坐标） ===

            var radius = 2;
            var angle = Math.random() * 2 * Math.PI;
            var distance = Math.random() * radius;
            var offsetX = Math.cos(angle) * distance;
            var offsetZ = Math.sin(angle) * distance;
            var targetPos = new Vec3(startPos.x + offsetX, startPos.y + 1.5, startPos.z + offsetZ); // === 控制点（中间高度 +1~2） ===

            var ctrlPos = new Vec3(startPos.x + offsetX * 0.5, startPos.y + 2 + Math.random(), // 提升 Y 值形成抛物
            startPos.z + offsetZ * 0.5);
            wood.setWorldPosition(startPos); // 确保以世界坐标为准
            // === 贝塞尔动画 ===

            var bezierHelper = {
              t: 0
            };
            var randomRotation = new Vec3(Math.random() * 360, // X轴旋转（可选）
            Math.random() * 360, // Y轴旋转（最常见）
            Math.random() * 360 // Z轴旋转（可选）
            );
            tween(bezierHelper).to(0.35, {
              t: 1
            }, {
              easing: 'quadOut',
              onUpdate: () => {
                var t = bezierHelper.t;
                var x = (1 - t) * (1 - t) * startPos.x + 2 * (1 - t) * t * ctrlPos.x + t * t * targetPos.x;
                var y = (1 - t) * (1 - t) * startPos.y + 2 * (1 - t) * t * ctrlPos.y + t * t * targetPos.y;
                var z = (1 - t) * (1 - t) * startPos.z + 2 * (1 - t) * t * ctrlPos.z + t * t * targetPos.z;
                wood.setWorldPosition(new Vec3(x, y, z));
              },
              onComplete: () => {
                wood.eulerAngles = randomRotation;
                wood["__isReady"] = true;

                if (isPlayer) {
                  _this._woodList.push(wood);
                } else {
                  var collider = wood.getComponent(Collider);

                  if (collider) {
                    collider.enabled = false;
                  }

                  var rightbody = wood.getComponent(RigidBody);

                  if (rightbody) {
                    rightbody.enabled = false;
                  }

                  if (role) {
                    _this.getWoods(role, [wood]);
                  }
                }
              }
            }).start();
          };

          for (var i = 0; i < renderWoodNum; i++) {
            _loop();
          }
        }

        getWood() {
          var woodList = this._woodList.splice(0, this._woodList.length);

          return woodList;
        }

        /**
           * 从背包子节点里寻找“Base”节点作为底部锚点；没有则返回 0
           */
        getBackpackBaseY(bp) {
          var base = bp.getChildByName('Base');
          return base ? base.getPosition().y : 0;
        }
        /**
         * 目标背包选择规则：
         * 1) 优先已有同名木头的背包；
         * 2) 否则优先空背包；
         * 3) 否则回退第一个背包。
         */


        findTargetBackpack(wood, backpacks) {
          var matched = null;
          var empty = null;

          for (var backpack of backpacks) {
            if (!backpack) continue;
            var children = backpack.children;

            if (children.length === 0 && !empty) {
              empty = backpack;
            } else {
              for (var child of children) {
                if (!child || !child.isValid) continue;

                if (child.name === wood.name) {
                  matched = backpack;
                  break;
                }
              }
            }

            if (matched) break;
          }

          return matched || empty || backpacks[0] || null;
        }
        /**
         * 从最底部开始堆叠木头，并在落地后统一重排
         */


        getWoods(role, woodLs) {
          var _this2 = this;

          var player = role;
          var backpack1 = player.getChildByName('Backpack1');
          var backpack2 = player.getChildByName('Backpack2');
          var backpack3 = player.getChildByName('Backpack3');
          var backpacks = [backpack1, backpack2, backpack3];
          var allwoods = [...woodLs];
          var delayCounter = 0;

          var _loop2 = function _loop2() {
            var wood = allwoods[i];
            if (!wood || !wood.isValid) return 0; // continue

            var targetBackpack = _this2.findTargetBackpack(wood, backpacks);

            if (!targetBackpack) return 0; // continue
            // 起点（世界坐标）

            var start = wood.worldPosition.clone();
            var duration = 0.6;
            var controller = {
              t: 0
            }; // 暂时提升到较上层父节点，避免局部坐标干扰

            wood.setParent(_this2.node.parent);
            wood.setWorldPosition(start); // 禁用物理，避免飞行中被撞动

            var woodCollider = wood.getComponent(Collider);
            if (woodCollider) woodCollider.enabled = false;
            var woodRigidBody = wood.getComponent(RigidBody);
            if (woodRigidBody) woodRigidBody.enabled = false; // 旋转插值（例：飞行中转到 Z=90°）

            var startRot = wood.eulerAngles.clone();
            var endRot = new Vec3(0, 0, 90);
            tween(controller).delay(delayCounter * 0.05).to(duration, {
              t: 1
            }, {
              easing: 'quadOut',
              onUpdate: () => {
                var t = controller.t;
                var oneMinusT = 1 - t; // —— 从“底部 + 已有数量 * 间距”开始堆叠（底部优先）——

                var baseY = _this2.getBackpackBaseY(targetBackpack);

                var nextIndex = targetBackpack.children.length; // 本木头将要放置的层索引

                var localTarget = new Vec3(0, baseY + nextIndex * _this2.stackGap, 0); // 背包的世界变换

                var worldPos = targetBackpack.getWorldPosition();
                var worldRot = targetBackpack.getWorldRotation();
                var worldScale = targetBackpack.getWorldScale();
                var worldMat = new Mat4();
                Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
                var worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat); // 抛物曲线的控制点

                var control = new Vec3((start.x + worldTarget.x) / 2, Math.max(start.y, worldTarget.y) + _this2.arcOffset, (start.z + worldTarget.z) / 2); // 二次贝塞尔插值

                var pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z);
                wood.setWorldPosition(pos); // 旋转插值

                var lerpedEuler = new Vec3(startRot.x * oneMinusT + endRot.x * t, startRot.y * oneMinusT + endRot.y * t, startRot.z * oneMinusT + endRot.z * t);
                wood.eulerAngles = lerpedEuler;
              }
            }).call(() => {
              // 落地：先把世界坐标固定，再改父节点，最后回设世界坐标
              var finalWorldPos = wood.getWorldPosition().clone();
              wood.setParent(targetBackpack);
              wood.setWorldPosition(finalWorldPos); // === 从底部开始统一重新排列（严格对齐到 Base + 层间距） ===

              var baseY = _this2.getBackpackBaseY(targetBackpack);

              var children = targetBackpack.children.slice(); // 拷贝避免遍历时修改影响

              children.forEach((child, idx) => {
                if (!child || !child.isValid) return;
                child.setPosition(0, baseY + idx * _this2.stackGap, 0);
              }); // 反馈缩放动画

              tween(wood).to(0.15, {
                scale: new Vec3(1.2, 1.2, 1.2)
              }, {
                easing: 'quadOut'
              }).to(0.05, {
                scale: new Vec3(1, 1, 1)
              }, {
                easing: 'quadOut'
              }).start(); // 如需恢复物理，可在此处按需开启：
              // if (woodCollider) woodCollider.enabled = true;
              // if (woodRigidBody) woodRigidBody.enabled = true;
            }).start();
            delayCounter++;
          },
              _ret;

          for (var i = 0; i < allwoods.length; i++) {
            _ret = _loop2();
            if (_ret === 0) continue;
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e78cf77c82a63d1d1215de1c3a1845d72aa31841.js.map