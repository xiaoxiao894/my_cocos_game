System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, Sprite, DataManager, LanguageManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, UIPropertyManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageManager(extras) {
    _reporterNs.report("LanguageManager", "../Language/LanguageManager", _context.meta, extras);
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
      Label = _cc.Label;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      LanguageManager = _unresolved_3.LanguageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b6246BNmcFAba92koQh4wea", "UIPropertyManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIPropertyManager", UIPropertyManager = (_dec = ccclass('UIPropertyManager'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Node), _dec5 = property(Sprite), _dec(_class = (_class2 = class UIPropertyManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "propertyLabel", _descriptor, this);

          _initializerDefineProperty(this, "downloadLabel", _descriptor2, this);

          _initializerDefineProperty(this, "kLabelNode", _descriptor3, this);

          _initializerDefineProperty(this, "pageIconSpr", _descriptor4, this);

          this._total = 0;
        }

        onLoad() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.UIPropertyManager = this;
        }

        start() {
          const text = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
            error: Error()
          }), LanguageManager) : LanguageManager).t('Download');

          if (this.downloadLabel && text) {
            this.downloadLabel.string = text;
          }

          this.adaptationLanguageLogo(this.pageIconSpr);
          this._total = 0;
          this.propertyLabel.string = `${this._total}`;
          this.scheduleOnce(() => {
            if (this.kLabelNode) this.kLabelNode.active = false;
          }, 5);
        }

        collectProperty() {
          this._total++;
          this.propertyLabel.string = `${this._total}`;
        }

        deliverProperty() {
          this._total--;

          if (this._total >= 0) {
            this.propertyLabel.string = `${this._total}`;
          }
        }

        update(deltaTime) {} // 适配语言logo


        adaptationLanguageLogo(sprite) {
          const language = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
            error: Error()
          }), LanguageManager) : LanguageManager).t('Language');

          if (language == "ko") {
            sprite.spriteFrame = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManager.logoIcon[0];
          } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
            sprite.spriteFrame = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManager.logoIcon[0];
          } else if (language) {
            sprite.spriteFrame = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.sceneManager.logoIcon[0];
          } //   if (language == "ko") {
          //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[0]
          // } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
          //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[1]
          // } else if (language) {
          //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[2]
          // }

        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "propertyLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "downloadLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "kLabelNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "pageIconSpr", [_dec5], {
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
//# sourceMappingURL=dc5c93c5f98a5d52bfe094e9dc13b70f9e050751.js.map