System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, MeshRenderer, tween, CCBoolean, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, CloudEffct;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      MeshRenderer = _cc.MeshRenderer;
      tween = _cc.tween;
      CCBoolean = _cc.CCBoolean;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "030a8eAogNLp5nr5Hz/ZExv", "CloudEffct", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Material', 'MeshRenderer', 'Node', 'tween', 'Tween', 'CCBoolean']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CloudEffct", CloudEffct = (_dec = ccclass('CloudEffct'), _dec2 = property({
        tooltip: '渐变持续时间(秒)'
      }), _dec3 = property({
        tooltip: '每个云之间的延迟时间(秒)'
      }), _dec4 = property({
        tooltip: '目标透明度(0-255)'
      }), _dec5 = property({
        tooltip: '是否随机延迟'
      }), _dec6 = property({
        tooltip: '随机延迟范围(秒)'
      }), _dec7 = property({
        type: CCBoolean,
        tooltip: 'true为淡入效果,false为淡出效果'
      }), _dec(_class = (_class2 = class CloudEffct extends Component {
        constructor(...args) {
          super(...args);

          // 可配置参数
          _initializerDefineProperty(this, "fadeDuration", _descriptor, this);

          _initializerDefineProperty(this, "delayBetweenClouds", _descriptor2, this);

          // @property({ tooltip: '材质颜色属性名' })
          this.colorPropertyName = 'mainColor';
          // @property({ tooltip: '初始透明度(0-255)' })
          this.initialOpacity = 255;

          _initializerDefineProperty(this, "targetOpacity", _descriptor3, this);

          _initializerDefineProperty(this, "randomizeDelay", _descriptor4, this);

          _initializerDefineProperty(this, "randomDelayRange", _descriptor5, this);

          _initializerDefineProperty(this, "isFadeIn", _descriptor6, this);

          // 存储材质和动画状态
          this.materials = [];
          this.isInitialized = false;
          // 标记是否已初始化材质
          this.materialStates = new Map();
        }

        start() {
          // 仅收集材质，不启动任何效果
          this.initMaterials();
        }
        /**
         * 初始化材质收集
         */


        initMaterials() {
          if (this.isInitialized) return;
          const siblings = this.node.children;

          if (siblings.length === 0) {
            console.warn("CloudEffct: 当前节点没有子节点");
            return;
          }

          siblings.forEach(sibling => {
            const meshNode = sibling.getChildByName("Plane001");
            if (!meshNode) return;
            const meshRenderer = meshNode.getComponent(MeshRenderer);
            if (!meshRenderer || !meshRenderer.material) return; // 检查材质兼容性

            if (!this.checkMaterialCompatibility(meshRenderer.material)) {
              console.error(`CloudEffct: 材质 ${meshRenderer.material.name} 不兼容`);
              return;
            }

            const material = meshRenderer.material;
            const startColor = new Color(255, 255, 255, this.initialOpacity);
            material.setProperty(this.colorPropertyName, startColor), this.materials.push(material);
            this.materialStates.set(material, {
              currentTween: null,
              pendingAction: null
            });
          });
          this.isInitialized = true;
          console.log(`CloudEffct: 已收集 ${this.materials.length} 个材质`);
        }
        /**
         * 外部调用接口：启动云效果
         * @param isFadeIn true=淡入 false=淡出
         */


        startEffect(isFadeIn) {
          // 确保材质已初始化
          if (!this.isInitialized) {
            this.initMaterials();
          } // 如果没有材质可用，直接返回


          if (this.materials.length === 0) {
            console.warn("CloudEffct: 没有可用的材质");
            return;
          } // 更新效果方向


          this.isFadeIn = isFadeIn; // 为每个材质安排淡入/淡出

          this.materials.forEach((material, index) => {
            // 计算延迟时间
            let delayTime = 0;

            if (this.randomizeDelay) {
              delayTime = Math.random() * this.randomDelayRange;
            } else if (this.delayBetweenClouds > 0) {
              delayTime = index * this.delayBetweenClouds;
            } // 延迟安排动画


            this.scheduleOnce(() => {
              this.scheduleFade(material, isFadeIn ? 'fadeIn' : 'fadeOut');
            }, delayTime);
          });
        }
        /**
         * 安排材质的淡入淡出效果
         */


        scheduleFade(material, action) {
          const state = this.materialStates.get(material);
          if (!state) return; // 如果当前没有动画运行，立即开始

          if (!state.currentTween) {
            this.startFade(material, action);
          } else {
            // 如果已有动画，将此操作设为待处理
            state.pendingAction = action;
          }
        }
        /**
         * 启动单个材质动画
         */


        startFade(material, action) {
          const state = this.materialStates.get(material);
          if (!state) return; // 获取当前材质的透明度

          const currentColor = material.getProperty(this.colorPropertyName);
          const currentOpacity = currentColor.a; // 检查是否需要执行淡入操作

          if (action === 'fadeIn' && currentOpacity === this.initialOpacity) {
            console.log(`CloudEffct: 材质 ${material.name} 当前透明度与初始透明度相同，跳过淡入操作`);
            return;
          } // 检查是否需要执行淡出操作


          if (action === 'fadeOut' && currentOpacity === this.targetOpacity) {
            console.log(`CloudEffct: 材质 ${material.name} 当前透明度与目标透明度相同，跳过淡出操作`);
            return;
          }

          const startOpacity = action === 'fadeIn' ? this.targetOpacity : this.initialOpacity;
          const endOpacity = action === 'fadeIn' ? this.initialOpacity : this.targetOpacity;
          const startColor = new Color(255, 255, 255, startOpacity);
          const endColor = new Color(255, 255, 255, endOpacity); // 创建并存储tween

          const tweenInstance = tween(startColor).to(this.fadeDuration, {
            a: endOpacity
          }, {
            onUpdate: target => material.setProperty(this.colorPropertyName, target),
            easing: 'linear'
          }).call(() => {
            // 动画完成后清除当前tween
            state.currentTween = null; // 检查是否有待处理的动作

            if (state.pendingAction) {
              const nextAction = state.pendingAction;
              state.pendingAction = null;
              this.startFade(material, nextAction);
            }
          }).start(); // 更新状态

          state.currentTween = tweenInstance;
        }
        /**
         * 检查材质兼容性
         */


        checkMaterialCompatibility(material) {
          try {
            // 尝试获取属性
            material.getProperty(this.colorPropertyName);
            return true;
          } catch (error) {
            // 尝试常见的其他属性名
            const alternativeNames = ['color', 'mainColor', 'diffuseColor'];

            for (const name of alternativeNames) {
              try {
                material.getProperty(name); // 如果找到兼容属性名，更新组件属性

                this.colorPropertyName = name;
                return true;
              } catch (e) {
                continue;
              }
            }

            return false;
          }
        }
        /**
         * 组件销毁时清理资源
         */


        onDestroy() {
          // 停止所有动画
          this.materials.forEach(material => {
            const state = this.materialStates.get(material);

            if (state && state.currentTween) {
              state.currentTween.stop();
            }
          });
          this.materialStates.clear();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "fadeDuration", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "delayBetweenClouds", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "targetOpacity", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "randomizeDelay", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "randomDelayRange", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "isFadeIn", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=47f2c1176c85ff1896fc706d37f2cbd0d53ed865.js.map