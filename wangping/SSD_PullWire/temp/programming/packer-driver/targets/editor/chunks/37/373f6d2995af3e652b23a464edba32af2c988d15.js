System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Color, Component, MeshRenderer, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, CloudEffctFade;

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
      Color = _cc.Color;
      Component = _cc.Component;
      MeshRenderer = _cc.MeshRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c5f99AjR/9GRro3tXZLmbRc", "CloudEffctFade", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Color', 'Component', 'Material', 'MeshRenderer', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CloudEffctFade", CloudEffctFade = (_dec = ccclass('CloudEffctFade'), _dec2 = property({
        type: CCFloat,
        tooltip: '渐变持续时间（秒）'
      }), _dec(_class = (_class2 = class CloudEffctFade extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "duration", _descriptor, this);

          this._materials = [];
          // 存储所有需要渐变的材质
          this._fadeStarted = false;
          // 标记是否开始渐变
          this._elapsedTime = 0;
        }

        // 已过去的时间
        initCloud() {
          console.log("同级节点 ceshi");
          const siblings = this.node.children; // 收集所有需要渐变的材质

          siblings.forEach((sibling, index) => {
            console.log(`同级节点 ${index + 1}: ${sibling.name}`);
            this.collectMaterials(sibling);
          }); // 开始渐变

          this.startFade();
        }

        collectMaterials(sibling) {
          const targetNode = sibling.getChildByName("Plane001");

          if (!targetNode) {
            console.error("未找到名为'Plane001'的子节点");
            return;
          }

          const meshRenderer = targetNode.getComponent(MeshRenderer);

          if (!(meshRenderer != null && meshRenderer.material)) {
            console.error("需要 MeshRenderer 组件和有效材质");
            return;
          } // 存储材质并设置初始透明度为完全不透明


          const material = meshRenderer.material;

          this._materials.push(material);

          material.setProperty('albedo', new Color(255, 255, 255, 255));
        }

        startFade() {
          if (this._fadeStarted || this._materials.length === 0) return;
          this._fadeStarted = true;
          this._elapsedTime = 0;
        }

        update(deltaTime) {
          if (!this._fadeStarted || this._materials.length === 0) return; // 累加已过去的时间

          this._elapsedTime += deltaTime; // 计算渐变进度（0-1范围）

          const progress = Math.min(this._elapsedTime / this.duration, 1); // 根据进度计算当前透明度（从255到0）

          const alpha = Math.floor(255 * (1 - progress));
          const currentColor = new Color(255, 255, 255, alpha); // 更新所有材质的透明度

          this._materials.forEach(material => {
            material.setProperty('albedo', currentColor);
          }); // 渐变完成后停止更新


          if (progress >= 1) {
            this._fadeStarted = false;
            console.log("所有材质透明度渐变完成");
          }
        }

        start() {
          this.initCloud();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=373f6d2995af3e652b23a464edba32af2c988d15.js.map