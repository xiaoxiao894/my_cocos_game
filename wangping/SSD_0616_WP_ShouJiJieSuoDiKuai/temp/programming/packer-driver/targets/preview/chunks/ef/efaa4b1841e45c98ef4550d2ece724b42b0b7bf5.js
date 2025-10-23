System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Material, MeshRenderer, SkinnedMeshRenderer, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, DissolveEffect;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
      SkinnedMeshRenderer = _cc.SkinnedMeshRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "379d8rnrJBLIphfSu77uiVg", "DissolveEffect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Material', 'MeshRenderer', 'EventTouch', 'SkinnedMeshRenderer']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DissolveEffect", DissolveEffect = (_dec = ccclass('DissolveEffect'), _dec2 = property([Material]), _dec(_class = (_class2 = class DissolveEffect extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "delayTime", _descriptor, this);

          _initializerDefineProperty(this, "mats", _descriptor2, this);

          this._matInstances = [];
          this._startTime = 0;
          this._playTime = 0;
        }

        start() {
          // 创建材质实例，确保每个模型使用独立的材质
          this._createMaterialInstances();
        }

        _createMaterialInstances() {
          // 优先检查 SkinnedMeshRenderer，其次检查 MeshRenderer
          var renderer = this.getComponent(SkinnedMeshRenderer) || this.getComponent(MeshRenderer);

          if (!renderer) {
            console.error("DissolveEffect: 找不到 SkinnedMeshRenderer 或 MeshRenderer 组件");
            return;
          }

          if (this.mats.length === 0) {
            console.error("DissolveEffect: 没有指定材质");
            return;
          } // 保存原始材质索引


          var originalMaterials = renderer.materials; // 创建材质实例

          for (var i = 0; i < this.mats.length; i++) {
            var originalMat = this.mats[i];

            if (originalMat) {
              var matInstance = null; // 尝试使用 setMaterial() 方法创建实例（通用方法）
              // 临时应用材质以创建实例

              if (i < renderer.materials.length) {
                renderer.setMaterial(originalMat, i); // 获取实例化后的材质（兼容新旧 API）

                if (typeof renderer.getMaterialInstance === 'function') {
                  // 使用新 API (推荐)
                  matInstance = renderer.getMaterialInstance(i);
                }
              }

              if (matInstance) {
                this._matInstances.push(matInstance);
              }
            }
          } // 恢复原始材质，避免影响场景


          renderer.materials = originalMaterials; // 应用新的材质实例

          if (this._matInstances.length > 0) {
            renderer.materials = this._matInstances;
            console.log("DissolveEffect: \u6210\u529F\u4E3A " + this.node.name + " \u521B\u5EFA\u4E86 " + this._matInstances.length + " \u4E2A\u6750\u8D28\u5B9E\u4F8B");
          } else {
            console.error("DissolveEffect: 未能创建任何材质实例");
          }
        }

        play(timeS) {
          this._playTime = timeS;
          this._startTime = Date.now() + this.delayTime * 1000;

          for (var i = 0; i < this._matInstances.length; ++i) {
            this._matInstances[i].setProperty('dissolveThreshold', 0.0);
          }

          this.node.getComponent(SkinnedMeshRenderer).shadowCastingMode = SkinnedMeshRenderer.ShadowCastingMode.OFF;
        }

        onPlayTest(event, customData) {
          this.play(customData - 0);
        }

        update(deltaTime) {
          if (this._startTime && this._playTime && this._startTime < Date.now()) {
            var timeElapsed = (Date.now() - this._startTime) / 1000.0;
            var factor = timeElapsed / this._playTime;

            if (factor >= 1.0) {
              factor = 1.0;
              this._startTime = 0;
              this._playTime = 0;
            }

            for (var i = 0; i < this._matInstances.length; ++i) {
              this._matInstances[i].setProperty('dissolveThreshold', factor);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "delayTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mats", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=efaa4b1841e45c98ef4550d2ece724b42b0b7bf5.js.map