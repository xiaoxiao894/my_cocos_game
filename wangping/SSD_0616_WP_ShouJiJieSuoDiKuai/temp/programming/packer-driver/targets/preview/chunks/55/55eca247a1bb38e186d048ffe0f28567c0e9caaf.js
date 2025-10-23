System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, Vec3, MathUtil, Global, eventMgr, EventType, _dec, _class, _crd, ccclass, property, goodsDrop;

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "./MathUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "./core/Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "./core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "./core/EventType", _context.meta, extras);
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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      MathUtil = _unresolved_2.MathUtil;
    }, function (_unresolved_3) {
      Global = _unresolved_3.Global;
    }, function (_unresolved_4) {
      eventMgr = _unresolved_4.eventMgr;
    }, function (_unresolved_5) {
      EventType = _unresolved_5.EventType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "112eeDqeHJIgrsFine77m5L", "goodsDrop", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("goodsDrop", goodsDrop = (_dec = ccclass('goodsDrop'), _dec(_class = class goodsDrop extends Component {
        constructor() {
          super(...arguments);
          this.backpacks = [{
            parentNode: null,
            indexLength: 0,
            originalPositions: new Map(),
            name: "backpack1",
            restoringCount: 0
          }, {
            parentNode: null,
            indexLength: 0,
            originalPositions: new Map(),
            name: "backpack",
            restoringCount: 0
          }];
          // 跟踪所有背包中正在归位的物品总数
          this.totalRestoringCount = 0;
        }

        start() {
          this.initGoods();
        }

        update(deltaTime) {// 可以添加帧更新逻辑
        } // 初始化所有背包


        initGoods() {
          this.backpacks.forEach(backpack => {
            backpack.parentNode = this.node.getChildByName(backpack.name);
            if (!backpack.parentNode) return;
            backpack.indexLength = backpack.parentNode.children.length - 1; // 保存所有物品的初始位置

            backpack.parentNode.children.forEach(child => {
              backpack.originalPositions.set(child, child.getWorldPosition().clone());
            });
          });
        } // 随机化指定背包中的物品位置


        randomizeItemsInBackpack(backpackIndex, count) {
          if (count === void 0) {
            count = 1;
          }

          var temp = -0.8;

          if (backpackIndex == 0) {
            temp = -0.5;
          }

          var backpack = this.backpacks[backpackIndex];
          if (count < 0 || !backpack.parentNode || backpack.indexLength < 0) return;
          var parentWorldPos = backpack.parentNode.getWorldPosition(); // 生成相对于相对于父节点的随机偏移量

          var relativeOffset;

          do {
            relativeOffset = new Vec3(Math.floor(Math.random() * 7) - 3, // -3 到 3
            temp, Math.floor(Math.random() * 7) - 3 // -3 到 3
            );
          } while (relativeOffset.x === 0 && relativeOffset.z === 0); // 计算相对于父节点的目标位置


          var handOverPos = new Vec3(parentWorldPos.x + relativeOffset.x, parentWorldPos.y + relativeOffset.y, parentWorldPos.z + relativeOffset.z);
          var itemNode = backpack.parentNode.children[backpack.indexLength];
          var itemWorldPos = itemNode.getWorldPosition().clone(); // 计算贝塞尔曲线控制点

          var LIFT_HEIGHT = 2;

          var randomLift = () => Math.floor(Math.random() * (LIFT_HEIGHT * 2 + 1)) - LIFT_HEIGHT;

          var controlPoint = new Vec3((itemNode.worldPosition.x + handOverPos.x) / 2 + randomLift(), (itemNode.worldPosition.y + handOverPos.y) / 2 + 6, (itemNode.worldPosition.z + handOverPos.z) / 2 + randomLift()); // 执行贝塞尔曲线动画

          tween(itemNode).to(0.1, {// scale: new Vec3(1, 1, 1)
          }, {
            easing: 'cubicInOut',
            onUpdate: (target, ratio) => {
              var position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(itemWorldPos, controlPoint, handOverPos, ratio);
              target.worldPosition = position;
            }
          }).call(() => {
            backpack.indexLength--;
            this.randomizeItemsInBackpack(backpackIndex, count - 1);
          }).start();
        } // 恢复指定背包中的物品位置


        restoreItemsInBackpack(backpackIndex) {
          var backpack = this.backpacks[backpackIndex];
          if (!(backpack != null && backpack.parentNode)) return;
          var children = backpack.parentNode.children; // 计算需要归位的物品数量

          var ii = 0;

          if (backpack.indexLength - 2 >= 0) {
            ii = backpack.indexLength - 2;
          }

          var itemsToRestore = children.length - ii; // 更新计数器

          backpack.restoringCount = itemsToRestore;
          this.totalRestoringCount += itemsToRestore; // 为每个物品设置延迟动画

          for (var i = ii; i < children.length; i++) {
            // 使用立即执行函数解决闭包问题
            (function (index) {
              var itemNode = children[index];

              if (!itemNode) {
                // 如果物品节点不存在，也需要减少计数器
                this.itemRestoreComplete(backpackIndex);
                return;
              } // 安排动画


              this.scheduleOnce(() => {
                var originalPos = backpack.originalPositions.get(itemNode);

                if (!originalPos) {
                  this.itemRestoreComplete(backpackIndex);
                  return;
                }

                var currentPos = itemNode.getWorldPosition().clone(); // 贝塞尔曲线控制点

                var controlPoint = new Vec3((currentPos.x + originalPos.x) / 2, (currentPos.y + originalPos.y) / 2 + 5, (currentPos.z + originalPos.z) / 2); // 播放音效

                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).soundManager.playPickUpSound(); // 执行动画

                tween(itemNode).to(0.3, {}, {
                  easing: 'cubicInOut',
                  onUpdate: (target, ratio) => {
                    var position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                      error: Error()
                    }), MathUtil) : MathUtil).bezierCurve(currentPos, controlPoint, originalPos, ratio);
                    target.worldPosition = position;
                  }
                }).call(() => {
                  // 单个物品动画完成
                  this.itemRestoreComplete(backpackIndex);
                }).start();
              }, index * 0.1);
            }).call(this, i); // 绑定this并传递当前索引
          }
        } // 单个物品归位完成


        itemRestoreComplete(backpackIndex) {
          var backpack = this.backpacks[backpackIndex];
          if (!backpack) return; // 减少当前背包的归位计数器

          backpack.restoringCount--; // 减少全局归位计数器

          this.totalRestoringCount--; // 重置当前背包的indexLength（当该背包所有物品都归位后）

          if (backpack.restoringCount <= 0) {
            var _backpack$parentNode;

            backpack.indexLength = ((_backpack$parentNode = backpack.parentNode) == null ? void 0 : _backpack$parentNode.children.length) - 1 || 0;
          } // 检查是否所有物品都已归位


          this.checkAllItemsRestored();
        } // 检查是否所有物品都已归位


        checkAllItemsRestored() {
          // 当全局计数器为0时，说明所有物品都已归位
          if (this.totalRestoringCount <= 0) {
            (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
              error: Error()
            }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).GAME_OVER);
          }
        } // 恢复所有背包中的物品位置


        restoreItemsInAllBackpacks() {
          // 重置计数器
          this.totalRestoringCount = 0;
          this.backpacks.forEach(backpack => {
            backpack.restoringCount = 0;
          }); // 开始所有背包的物品归位

          this.backpacks.forEach((_, index) => {
            this.restoreItemsInBackpack(index);
          });
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=55eca247a1bb38e186d048ffe0f28567c0e9caaf.js.map