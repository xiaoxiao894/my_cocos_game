System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Material, MeshRenderer, tween, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, PalingMaterial;

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
      tween = _cc.tween;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2a182jLQjpMN5B8VilL6IBo", "PalingMaterial", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Material', 'MeshRenderer', 'Node', 'SkinnedMeshRenderer', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PalingMaterial", PalingMaterial = (_dec = ccclass('PalingMaterial'), _dec2 = property({
        type: Material,
        tooltip: "基础材质"
      }), _dec3 = property({
        type: Material,
        tooltip: "红色材质"
      }), _dec4 = property({
        type: Material,
        tooltip: "附加材质"
      }), _dec5 = property({
        type: MeshRenderer,
        tooltip: "MeshRenderer"
      }), _dec(_class = (_class2 = class PalingMaterial extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "baseMaterial", _descriptor, this);

          _initializerDefineProperty(this, "redMaterial", _descriptor2, this);

          _initializerDefineProperty(this, "extendMaterial", _descriptor3, this);

          _initializerDefineProperty(this, "rendererMaterial", _descriptor4, this);
        }

        // shakeMaterial(){
        //     //this.node.getComponent(MeshRenderer).material = this.redMaterial;
        // }
        shakeMaterial() {
          //  let houseMaterial = this.node.getChildByName("playerNode").getChildByName("player").getChildByName("Shimin").getComponent(SkinnedMeshRenderer);
          // let materials = houseMaterial.materials;
          //    materials[0] = this.redyMaterial;
          //    materials[1] = this.redyMaterial;
          //    houseMaterial.materials = materials
          tween(this.rendererMaterial.node) // 定义要重复的动作序列：切换材质→等待→切回材质→等待
          .sequence( // 切换到目标材质
          tween().call(() => {
            this.rendererMaterial.setMaterialInstance(this.redMaterial, 0);

            if (this.extendMaterial) {
              this.rendererMaterial.setMaterialInstance(this.redMaterial, 1);
            } // houseMaterial.setMaterialInstance(this.redyMaterial, 1);

          }), // 等待 0.2 秒
          tween().delay(0.1), // 切回原材质
          tween().call(() => {
            this.rendererMaterial.setMaterialInstance(this.baseMaterial, 0);

            if (this.extendMaterial) {
              this.rendererMaterial.setMaterialInstance(this.extendMaterial, 1);
            }
          }), // 等待 0.2 秒（与切换时间对称）
          tween().delay(0.1)) // 重复整个序列 3 次
          .repeat(1) // 启动 tween
          .start();
        }

        start() {}

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "baseMaterial", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "redMaterial", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "extendMaterial", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rendererMaterial", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=365fe4f42190e8814e701b9291ae42e43e649750.js.map