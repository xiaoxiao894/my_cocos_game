System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, Sprite, tween, UIOpacity, Vec3, DataManager, super_html_playable, SoundManager, LanguageManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, GameEndManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../Common/super_html_playable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../Common/SoundManager", _context.meta, extras);
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
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      super_html_playable = _unresolved_3.default;
    }, function (_unresolved_4) {
      SoundManager = _unresolved_4.SoundManager;
    }, function (_unresolved_5) {
      LanguageManager = _unresolved_5.LanguageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "56ff429qyxGs4TUGW8qdzPM", "GameEndManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'Sprite', 'tween', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameEndManager", GameEndManager = (_dec = ccclass('GameEndManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec(_class = (_class2 = class GameEndManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bg", _descriptor, this);

          _initializerDefineProperty(this, "icon", _descriptor2, this);

          _initializerDefineProperty(this, "download", _descriptor3, this);

          _initializerDefineProperty(this, "win", _descriptor4, this);

          _initializerDefineProperty(this, "hand", _descriptor5, this);

          this.isExecuteClickButton = false;
        }

        start() {
          var _this$download;

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gameEndManager = this;
          this.node.active = false;
          var downloadLabel = (_this$download = this.download) == null || (_this$download = _this$download.getChildByName("Label")) == null ? void 0 : _this$download.getComponent(Label);
          var text = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
            error: Error()
          }), LanguageManager) : LanguageManager).t('Download');

          if (downloadLabel && text) {
            downloadLabel.string = text;
          }

          var iconSpr = this.icon.getComponent(Sprite);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.UIPropertyManager.adaptationLanguageLogo(iconSpr);
        }

        onEnable() {// this.scheduleOnce(() => {
          //     if (!this.isExecuteClickButton) {
          //         this.isExecuteClickButton = true;
          //         this.onClickButton();
          //     }
          // }, 2);
        }

        init() {
          this.hand.active = false;
          this.node.active = true; // 背景淡入

          var opacityCom = this.bg.getComponent(UIOpacity) || this.bg.addComponent(UIOpacity);
          opacityCom.opacity = 0;
          tween(opacityCom).to(0.1, {
            opacity: 150
          }).start(); // 初始缩放

          this.icon.setScale(0, 0, 0); // this.win.setScale(0, 1, 1);

          this.download.setScale(0, 1, 1);
          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).inst.playAudio("DC_shengli");
          tween(this.icon).to(0.3, {
            scale: new Vec3(2.2, 2.2, 2.2)
          }).to(0.3, {
            scale: new Vec3(2, 2, 2)
          }).start();
          tween(this.download).delay(0.3).to(0.3, {
            scale: new Vec3(2.1, 2.1, 2.1)
          }).to(0.3, {
            scale: new Vec3(2, 2, 2)
          }).call(() => {
            this.hand.active = true;
            this.playFingerAndButtonAnim();
          }).start(); // tween(this.win)
          //     .delay(0.1)
          //     .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
          //     .to(0.3, { scale: new Vec3(1, 1, 1) })
          //     .call(() => {
          //         this.hand.active = true;
          //         this.playFingerAndButtonAnim();
          //     })
          //     .start();
        } // 手指+按钮循环提示动画


        playFingerAndButtonAnim() {
          // 手指动画（0.9 -> 1 循环）
          tween(this.hand).repeatForever(tween().to(0.3, {
            scale: new Vec3(0.3, 0.3, 0.3)
          }).to(0.3, {
            scale: new Vec3(0.4, 0.4, 0.4)
          })).start(); // 按钮点击提示动画（1.0 -> 1.1 -> 1.0 循环）
          // tween(this.download)
          //     .repeatForever(
          //         tween()
          //             .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
          //             .to(0.3, { scale: new Vec3(1, 1, 1) })
          //     )
          //     .start();
        }

        onClickButton() {
          this.isExecuteClickButton = true;
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "download", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "win", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "hand", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=41d3f9eb6a1a3b77f9f00a317773e169a261625b.js.map