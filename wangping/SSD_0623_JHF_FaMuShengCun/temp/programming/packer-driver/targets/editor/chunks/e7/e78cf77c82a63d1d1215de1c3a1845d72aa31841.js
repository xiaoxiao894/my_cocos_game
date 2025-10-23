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
        constructor(...args) {
          super(...args);
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
            const woodPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
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

          const node = this._woodPool.alloc();

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
          const woods = find("THREE3DNODE/Woods");
          if (!woods) return;
          const renderWoodNum = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).getRandom(this._woodMinNum, this._woodMaxNum);
          const startPos = treeNode.worldPosition;

          for (let i = 0; i < renderWoodNum; i++) {
            const woodPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Wood);
            const wood = instantiate(woodPrefab);
            wood[`__isReady`] = false;
            woods.addChild(wood); // === 随机目标点（相对世界坐标） ===

            const radius = 2;
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * radius;
            const offsetX = Math.cos(angle) * distance;
            const offsetZ = Math.sin(angle) * distance;
            const targetPos = new Vec3(startPos.x + offsetX, startPos.y + 1.5, startPos.z + offsetZ); // === 控制点（中间高度 +1~2） ===

            const ctrlPos = new Vec3(startPos.x + offsetX * 0.5, startPos.y + 2 + Math.random(), // 提升 Y 值形成抛物
            startPos.z + offsetZ * 0.5);
            wood.setWorldPosition(startPos); // 确保以世界坐标为准
            // === 贝塞尔动画 ===

            const bezierHelper = {
              t: 0
            };
            const randomRotation = new Vec3(Math.random() * 360, // X轴旋转（可选）
            Math.random() * 360, // Y轴旋转（最常见）
            Math.random() * 360 // Z轴旋转（可选）
            );
            tween(bezierHelper).to(0.35, {
              t: 1
            }, {
              easing: 'quadOut',
              onUpdate: () => {
                const t = bezierHelper.t;
                const x = (1 - t) * (1 - t) * startPos.x + 2 * (1 - t) * t * ctrlPos.x + t * t * targetPos.x;
                const y = (1 - t) * (1 - t) * startPos.y + 2 * (1 - t) * t * ctrlPos.y + t * t * targetPos.y;
                const z = (1 - t) * (1 - t) * startPos.z + 2 * (1 - t) * t * ctrlPos.z + t * t * targetPos.z;
                wood.setWorldPosition(new Vec3(x, y, z));
              },
              onComplete: () => {
                wood.eulerAngles = randomRotation;
                wood[`__isReady`] = true;

                if (isPlayer) {
                  this._woodList.push(wood);
                } else {
                  const collider = wood.getComponent(Collider);

                  if (collider) {
                    collider.enabled = false;
                  }

                  const rightbody = wood.getComponent(RigidBody);

                  if (rightbody) {
                    rightbody.enabled = false;
                  }

                  if (role) {
                    this.getWoods(role, [wood]);
                  }
                }
              }
            }).start();
          }
        }

        getWood() {
          const woodList = this._woodList.splice(0, this._woodList.length);

          return woodList;
        }

        /**
           * 从背包子节点里寻找“Base”节点作为底部锚点；没有则返回 0
           */
        getBackpackBaseY(bp) {
          const base = bp.getChildByName('Base');
          return base ? base.getPosition().y : 0;
        }
        /**
         * 目标背包选择规则：
         * 1) 优先已有同名木头的背包；
         * 2) 否则优先空背包；
         * 3) 否则回退第一个背包。
         */


        findTargetBackpack(wood, backpacks) {
          let matched = null;
          let empty = null;

          for (const backpack of backpacks) {
            if (!backpack) continue;
            const children = backpack.children;

            if (children.length === 0 && !empty) {
              empty = backpack;
            } else {
              for (const child of children) {
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
          const player = role;
          const backpack1 = player.getChildByName('Backpack1');
          const backpack2 = player.getChildByName('Backpack2');
          const backpack3 = player.getChildByName('Backpack3');
          const backpacks = [backpack1, backpack2, backpack3];
          const allwoods = [...woodLs];
          let delayCounter = 0;

          for (let i = 0; i < allwoods.length; i++) {
            const wood = allwoods[i];
            if (!wood || !wood.isValid) continue;
            const targetBackpack = this.findTargetBackpack(wood, backpacks);
            if (!targetBackpack) continue; // 起点（世界坐标）

            const start = wood.worldPosition.clone();
            const duration = 0.6;
            const controller = {
              t: 0
            }; // 暂时提升到较上层父节点，避免局部坐标干扰

            wood.setParent(this.node.parent);
            wood.setWorldPosition(start); // 禁用物理，避免飞行中被撞动

            const woodCollider = wood.getComponent(Collider);
            if (woodCollider) woodCollider.enabled = false;
            const woodRigidBody = wood.getComponent(RigidBody);
            if (woodRigidBody) woodRigidBody.enabled = false; // 旋转插值（例：飞行中转到 Z=90°）

            const startRot = wood.eulerAngles.clone();
            const endRot = new Vec3(0, 0, 90);
            tween(controller).delay(delayCounter * 0.05).to(duration, {
              t: 1
            }, {
              easing: 'quadOut',
              onUpdate: () => {
                const t = controller.t;
                const oneMinusT = 1 - t; // —— 从“底部 + 已有数量 * 间距”开始堆叠（底部优先）——

                const baseY = this.getBackpackBaseY(targetBackpack);
                const nextIndex = targetBackpack.children.length; // 本木头将要放置的层索引

                const localTarget = new Vec3(0, baseY + nextIndex * this.stackGap, 0); // 背包的世界变换

                const worldPos = targetBackpack.getWorldPosition();
                const worldRot = targetBackpack.getWorldRotation();
                const worldScale = targetBackpack.getWorldScale();
                const worldMat = new Mat4();
                Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
                const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat); // 抛物曲线的控制点

                const control = new Vec3((start.x + worldTarget.x) / 2, Math.max(start.y, worldTarget.y) + this.arcOffset, (start.z + worldTarget.z) / 2); // 二次贝塞尔插值

                const pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z);
                wood.setWorldPosition(pos); // 旋转插值

                const lerpedEuler = new Vec3(startRot.x * oneMinusT + endRot.x * t, startRot.y * oneMinusT + endRot.y * t, startRot.z * oneMinusT + endRot.z * t);
                wood.eulerAngles = lerpedEuler;
              }
            }).call(() => {
              // 落地：先把世界坐标固定，再改父节点，最后回设世界坐标
              const finalWorldPos = wood.getWorldPosition().clone();
              wood.setParent(targetBackpack);
              wood.setWorldPosition(finalWorldPos); // === 从底部开始统一重新排列（严格对齐到 Base + 层间距） ===

              const baseY = this.getBackpackBaseY(targetBackpack);
              const children = targetBackpack.children.slice(); // 拷贝避免遍历时修改影响

              children.forEach((child, idx) => {
                if (!child || !child.isValid) return;
                child.setPosition(0, baseY + idx * this.stackGap, 0);
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
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e78cf77c82a63d1d1215de1c3a1845d72aa31841.js.map