System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCBoolean, CCFloat, Component, Node, tween, Vec3, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, PalingAnimation;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "adb55p+Fq9Gh477C8d+ALCJ", "PalingAnimation", undefined);

      __checkObsolete__(['_decorator', 'CCBoolean', 'CCFloat', 'Component', 'Node', 'Tween', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PalingAnimation", PalingAnimation = (_dec = ccclass('PalingAnimation'), _dec2 = property({
        type: Node,
        tooltip: '要显示动画的子节点组，如果为空则使用当前节点的所有子节点'
      }), _dec3 = property({
        tooltip: '动画持续时间(秒)'
      }), _dec4 = property({
        tooltip: '起始位置Y轴偏移量'
      }), _dec5 = property({
        type: CCBoolean,
        tooltip: '跳跃效果开始参数调节 只有跳跃效果生效'
      }), _dec6 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '弹跳动画总时长 '
      }), _dec7 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '弹跳高度 跳跃效果生效'
      }), _dec8 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '下落时超过起始点的距离 '
      }), _dec9 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '上升阶段占总时间的比例 '
      }), _dec10 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '下降阶段占总时间的比例 '
      }), _dec11 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '回弹阶段占总时间的比例 '
      }), _dec(_class = (_class2 = class PalingAnimation extends Component {
        constructor() {
          super(...arguments);
          // 存储所有活动的Tween
          this.activeTweens = [];

          // 动画配置参数
          _initializerDefineProperty(this, "targetNode", _descriptor, this);

          _initializerDefineProperty(this, "duration", _descriptor2, this);

          _initializerDefineProperty(this, "startOffsetY", _descriptor3, this);

          _initializerDefineProperty(this, "enableBounce", _descriptor4, this);

          _initializerDefineProperty(this, "totalDuration", _descriptor5, this);

          _initializerDefineProperty(this, "bounceHeight", _descriptor6, this);

          _initializerDefineProperty(this, "overshootDistance", _descriptor7, this);

          _initializerDefineProperty(this, "upPhaseRatio", _descriptor8, this);

          _initializerDefineProperty(this, "downPhaseRatio", _descriptor9, this);

          _initializerDefineProperty(this, "bounceBackRatio", _descriptor10, this);
        }

        /**
         * 开始播放连续显示动画，并返回动画完成的Promise
         */
        startAnimation() {
          return new Promise(resolve => {
            // 停止所有正在运行的动画
            this.stopAllAnimations(); // 获取要处理的节点

            var nodeToAnimate = this.targetNode || this.node; // 确保节点是激活状态

            if (!nodeToAnimate.active) {
              nodeToAnimate.active = true;
            }

            var siblings = nodeToAnimate.children; // 如果没有子节点，直接resolve

            if (siblings.length === 0) {
              resolve();
              return;
            } // 首先将所有子节点移动到初始位置


            siblings.forEach(sibling => {
              var originalPosition = sibling.position.clone();
              sibling.position = new Vec3(originalPosition.x, originalPosition.y - this.startOffsetY, originalPosition.z);

              if (sibling.active == false) {
                sibling.active = true;
              }
            }); // 递归播放动画，并在最后一个动画完成时resolve

            this.playAnimationSequentially(siblings, 0, resolve);
          });
        } //从地底向上出现


        startMoveDown() {
          var originalPosition = new Vec3(this.node.position.x, this.node.position.y - this.startOffsetY, this.node.position.z);
          var tweenInstance = tween(this.node).by(this.duration, {
            position: originalPosition
          }, {
            easing: "quadIn",
            onStart: () => {
              this.node.active = true; // 确保节点激活
            },
            onComplete: () => {
              this.node.active = false; // 当前动画完成后，递归播放下一个
              // this.playAnimationSequentially(siblings, index + 1, resolve);
            }
          }).start();
        }

        //有跳跃的效果
        startBounce() {
          // 如果没有指定目标节点，使用当前组件所在节点
          var node = this.targetNode || this.node; // 确保节点处于激活状态

          node.active = true; // 获取当前位置作为起始点

          var startPos = new Vec3(node.position.x, node.position.y, node.position.z); // 计算弹跳的最高点

          var peakPos = new Vec3(startPos.x, startPos.y + this.bounceHeight, startPos.z); // 计算下落时超过起始点的位置

          var overshootPos = new Vec3(startPos.x, startPos.y - this.overshootDistance, startPos.z); // 分阶段设置动画

          tween(node) // 上升阶段
          .to(this.totalDuration * this.upPhaseRatio, {
            position: peakPos
          }, {
            easing: "backOut"
          }) // 下降阶段
          .to(this.totalDuration * this.downPhaseRatio, {
            position: overshootPos
          }, {
            easing: "bounceOut"
          }) // 回弹到起始位置
          .to(this.totalDuration * this.bounceBackRatio, {
            position: startPos
          }, {
            easing: "quadOut"
          }).call(() => {// 动画完成后的回调
            // this.playAnimationSequentially(siblings, index + 1, resolve);
          }).start();
        }
        /**
         * 递归方法：按顺序播放每个子节点的动画
         * @param siblings 子节点数组
         * @param index 当前播放动画的子节点索引
         * @param resolve 动画完成的resolve函数
         */


        playAnimationSequentially(siblings, index, resolve) {
          if (index >= siblings.length) {
            resolve(); // 所有动画播放完毕

            return;
          }

          var sibling = siblings[index];
          var originalPosition = sibling.position.clone();
          originalPosition.y += this.startOffsetY; // 恢复原始位置
          // 创建动画

          var tweenInstance = tween(sibling).to(this.duration, {
            position: originalPosition
          }, {
            easing: "quadIn",
            //"backOut",
            onStart: () => {
              sibling.active = true; // 确保节点激活
            },
            onComplete: () => {
              // 当前动画完成后，递归播放下一个
              this.playAnimationSequentially(siblings, index + 1, resolve);
            }
          }).start(); // 存储tween实例以便后续管理

          this.activeTweens.push(tweenInstance);
        }
        /**
         * 停止所有动画并重置状态
         */


        stopAllAnimations() {
          this.activeTweens.forEach(tween => tween.stop());
          this.activeTweens = [];
        } // 组件销毁时清理资源


        onDestroy() {
          this.stopAllAnimations();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "startOffsetY", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableBounce", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "totalDuration", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bounceHeight", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "overshootDistance", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "upPhaseRatio", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.4;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "downPhaseRatio", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.6;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "bounceBackRatio", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=10bbbf07c4b71449e5405303ddf5a8b81b1d559b.js.map