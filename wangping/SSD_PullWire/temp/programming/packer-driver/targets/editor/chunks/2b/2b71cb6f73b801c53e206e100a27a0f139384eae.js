System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, Material, MeshRenderer, tween, Vec3, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, FruitScript;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d774avUvktB363u4P+1Km1Y", "FruitScript", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'Material', 'MeshRenderer', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FruitScript", FruitScript = (_dec = ccclass('FruitScript'), _dec2 = property(Material), _dec3 = property(Material), _dec4 = property({
        type: CCFloat,

        visible() {
          return !this.enableBounce;
        },

        tooltip: '缩放动画时常 '
      }), _dec5 = property({
        type: CCFloat,

        visible() {
          return !this.enableBounce;
        },

        tooltip: '缩放成度'
      }), _dec6 = property({
        tooltip: '跳跃效果开始参数调节 只有跳跃效果生效'
      }), _dec7 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '弹跳动画总时长 '
      }), _dec8 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '弹跳高度 跳跃效果生效'
      }), _dec9 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '下落时超过起始点的距离 '
      }), _dec10 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '上升阶段占总时间的比例 '
      }), _dec11 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '下降阶段占总时间的比例 '
      }), _dec12 = property({
        type: CCFloat,

        visible() {
          return this.enableBounce;
        },

        tooltip: '回弹阶段占总时间的比例 '
      }), _dec(_class = (_class2 = class FruitScript extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "materialRed", _descriptor, this);

          // 红色材质
          _initializerDefineProperty(this, "materialGreen", _descriptor2, this);

          // 绿色材质
          this.fruitNode = null;
          this.isRedState = false;
          // 当前是否为红色状态
          this.meshRenderers = [];
          // 缓存 MeshRenderer 组件
          this.originalScale = null;

          _initializerDefineProperty(this, "scaleTime", _descriptor3, this);

          _initializerDefineProperty(this, "scaleNumber", _descriptor4, this);

          _initializerDefineProperty(this, "enableBounce", _descriptor5, this);

          _initializerDefineProperty(this, "totalDuration", _descriptor6, this);

          _initializerDefineProperty(this, "bounceHeight", _descriptor7, this);

          _initializerDefineProperty(this, "overshootDistance", _descriptor8, this);

          _initializerDefineProperty(this, "upPhaseRatio", _descriptor9, this);

          _initializerDefineProperty(this, "downPhaseRatio", _descriptor10, this);

          _initializerDefineProperty(this, "bounceBackRatio", _descriptor11, this);
        }

        onLoad() {
          this.initFruitState();
        }

        initFruitState() {
          this.fruitNode = this.node.getChildByName("fruitNode") || this.node;
          this.fruitNode.active = false;
          this.originalScale = this.fruitNode.scale.clone(); // 缓存所有需要渲染的 MeshRenderer 组件

          this.cacheMeshRenderers();
        } // 缓存所有需要渲染的 MeshRenderer 组件


        cacheMeshRenderers() {
          this.meshRenderers = []; // 遍历 fruitNode 的所有子节点

          this.fruitNode.children.forEach(child => {
            const fanqieNode = child.getChildByName("fanqie");

            if (fanqieNode) {
              const meshRenderer = fanqieNode.getComponent(MeshRenderer);

              if (meshRenderer) {
                this.meshRenderers.push(meshRenderer);
              }
            }
          });
        }

        getFruitState() {
          return this.isRedState;
        } // 设置水果状态（红色或绿色）


        setFruitState(state, isFirst = false) {
          if (!this.fruitNode.active) {
            this.fruitNode.active = true;
          }

          if (!this.materialRed || !this.materialGreen) return;
          const targetMaterial = state === 'red' ? this.materialRed : this.materialGreen;
          this.isRedState = state === 'red'; // 一次性应用材质到所有缓存的 MeshRenderer

          this.meshRenderers.forEach(meshRenderer => {
            meshRenderer.setMaterial(targetMaterial, 0);
          }); // 根据状态播放动画

          if (this.enableBounce && state === 'green' && isFirst) {
            this.startBounce();
          } else if (state === 'red') {
            this.addScaleEffect();
          }
        }

        // 对整个 fruitNode 添加缩放效果，而不是每个子节点
        addScaleEffect() {
          tween(this.fruitNode).to(this.scaleTime, {
            scale: this.fruitNode.scale.multiplyScalar(this.scaleNumber)
          }).to(this.scaleTime, {
            scale: this.originalScale
          }).start();
        }

        startBounce() {
          // 确保节点处于激活状态
          this.fruitNode.active = true; // 获取当前位置作为起始点

          const startPos = new Vec3(this.fruitNode.position.x, this.fruitNode.position.y, this.fruitNode.position.z); // 计算弹跳的最高点

          const peakPos = new Vec3(startPos.x, startPos.y + this.bounceHeight, startPos.z); // 计算下落时超过起始点的位置

          const overshootPos = new Vec3(startPos.x, startPos.y - this.overshootDistance, startPos.z); // 对整个 fruitNode 应用弹跳动画

          tween(this.fruitNode) // 上升阶段
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
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "materialRed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "materialGreen", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scaleTime", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "scaleNumber", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "enableBounce", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "totalDuration", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bounceHeight", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "overshootDistance", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "upPhaseRatio", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.4;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "downPhaseRatio", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "bounceBackRatio", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2b71cb6f73b801c53e206e100a27a0f139384eae.js.map