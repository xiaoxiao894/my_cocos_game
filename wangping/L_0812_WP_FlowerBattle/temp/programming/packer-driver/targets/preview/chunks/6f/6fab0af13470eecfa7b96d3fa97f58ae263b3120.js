System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, tween, UIOpacity, Vec3, super_html_playable, SoundManager, LanguageManager, App, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, GameEndManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../core/super_html_playable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageManager(extras) {
    _reporterNs.report("LanguageManager", "../Language/LanguageManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
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
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      super_html_playable = _unresolved_2.default;
    }, function (_unresolved_3) {
      SoundManager = _unresolved_3.SoundManager;
    }, function (_unresolved_4) {
      LanguageManager = _unresolved_4.LanguageManager;
    }, function (_unresolved_5) {
      App = _unresolved_5.App;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "751216TjlZLF7hDR8OiMy1J", "GameEndManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'tween', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameEndManager", GameEndManager = (_dec = ccclass('GameEndManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = (_class2 = class GameEndManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bg", _descriptor, this);

          _initializerDefineProperty(this, "icon", _descriptor2, this);

          _initializerDefineProperty(this, "download", _descriptor3, this);

          _initializerDefineProperty(this, "download1", _descriptor4, this);

          _initializerDefineProperty(this, "continue", _descriptor5, this);

          // @property(Node)
          // win: Node = null;
          _initializerDefineProperty(this, "hand", _descriptor6, this);

          this.type = 1;

          // 封装处理标签语言转换的函数
          this.updateLabelText = node => {
            var _node$getChildByName;

            if (!node) return;
            var label = (_node$getChildByName = node.getChildByName("Label")) == null ? void 0 : _node$getChildByName.getComponent(Label);

            if (label) {
              var text = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
                error: Error()
              }), LanguageManager) : LanguageManager).t(label.string);
              if (text) label.string = text;
            }
          };
        }

        start() {
          this.node.active = false;
          this.init();
          this.playFingerAndButtonAnim(); // 调用函数处理各个节点

          this.updateLabelText(this.download);
          this.updateLabelText(this.download1);
          this.updateLabelText(this.continue);

          if (this.type == 1) {
            this.download1.active = false;
            this.continue.active = false;
            this.download.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("win");
          } else {
            this.download.active = false;
            this.continue.active = true;
            this.download1.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("fail");
          }
        }

        showGameEnd(type) {
          if (type === void 0) {
            type = 1;
          }

          this.node.active = true;
          this.type = type;

          if (type == 1) {
            this.download1.active = false;
            this.continue.active = false;
            this.download.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("win");
          } else {
            this.download.active = false;
            this.continue.active = true;
            this.download1.active = true;
            (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).Instance.playAudio("fail");
          }

          if (this.type == 1) {
            this.hand.setPosition(new Vec3(117.659, -281.833, 0));
          } else {
            this.hand.setPosition(new Vec3(248.414, -281.833, 0));
          }
        }

        init() {
          this.hand.active = false;
          this.node.active = true;

          if (this.type == 1) {
            this.hand.setPosition(new Vec3(117.659, -281.833, 0));
          } else {
            this.hand.setPosition(new Vec3(248.414, -281.833, 0));
          } // 背景淡入


          var opacityCom = this.bg.getComponent(UIOpacity) || this.bg.addComponent(UIOpacity);
          opacityCom.opacity = 0;
          tween(opacityCom).to(0.1, {
            opacity: 150
          }).start(); // 初始缩放

          this.icon.setScale(0, 0, 0);
          this.download.setScale(0, 1, 1);
          tween(this.icon).to(0.25, {
            scale: new Vec3(1.2, 1.2, 1.2)
          }).to(0.3, {
            scale: new Vec3(1, 1, 1)
          }).start();
          tween(this.download).delay(0.25).to(0.25, {
            scale: new Vec3(1.1, 1.1, 1.1)
          }).to(0.3, {
            scale: new Vec3(1, 1, 1)
          }).call(() => {
            this.hand.active = true;
          }).start();
        } // 手指+按钮循环提示动画


        playFingerAndButtonAnim() {
          // this.hand.active = true;
          // 手指动画（0.9 -> 1 循环）
          tween(this.hand).repeatForever(tween().to(0.3, {
            scale: new Vec3(0.4, 0.4, 0.4)
          }).to(0.3, {
            scale: new Vec3(0.5, 0.5, 0.5)
          })).start();
        }

        platformBtnEvent() {
          console.log("点击下载");
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
        }

        continueGame() {
          console.log("从新开始游戏");
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).gameManager.continueGame();
          this.type = 1;
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "download1", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "continue", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "hand", [_dec7], {
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
//# sourceMappingURL=6fab0af13470eecfa7b96d3fa97f58ae263b3120.js.map