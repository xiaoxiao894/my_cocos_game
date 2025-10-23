System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, UIOpacity, Vec3, super_html_playable, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, GameEndManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../../super_html_playable", _context.meta, extras);
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
      Node = _cc.Node;
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      super_html_playable = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "751216TjlZLF7hDR8OiMy1J", "GameEndManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'UIOpacity', 'Vec3']);

      //import Platform from '../Common/Platform';
      // const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
      // const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
      ({
        ccclass,
        property
      } = _decorator);

      _export("GameEndManager", GameEndManager = (_dec = ccclass('GameEndManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = class GameEndManager extends Component {
        constructor(...args) {
          super(...args);

          // ;
          // super_html_playable.set_app_store_url(appstore);
          _initializerDefineProperty(this, "bg", _descriptor, this);

          _initializerDefineProperty(this, "icon", _descriptor2, this);

          _initializerDefineProperty(this, "download", _descriptor3, this);

          // @property(Node)
          // win: Node = null;
          _initializerDefineProperty(this, "hand", _descriptor4, this);
        }

        start() {
          // DataManager.Instance.gameEndManager = this;
          this.node.active = false;
          this.init();
          this.playFingerAndButtonAnim();
        }

        init() {
          this.hand.active = false;
          this.node.active = true; // 背景淡入

          const opacityCom = this.bg.getComponent(UIOpacity) || this.bg.addComponent(UIOpacity);
          opacityCom.opacity = 0;
          tween(opacityCom).to(0.1, {
            opacity: 150
          }).start(); // 初始缩放

          this.icon.setScale(0, 0, 0);
          this.download.setScale(0, 1, 1);
          tween(this.icon).to(0.25, {
            scale: new Vec3(2.2, 2.2, 2.2)
          }).to(0.3, {
            scale: new Vec3(2, 2, 2)
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
          })).start(); // 按钮点击提示动画（1.0 -> 1.1 -> 1.0 循环）
          // tween(this.download)
          //     .repeatForever(
          //         tween()
          //             .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
          //             .to(0.3, { scale: new Vec3(1, 1, 1) })
          //     )
          //     .start();
        }

        platformBtnEvent() {
          console.log("点击下载"); // Platform.instance.jumpStore();
          // super_html_playable.set_google_play_url(google_play);

          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "download", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "hand", [_dec5], {
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
//# sourceMappingURL=e8459ee57d2ec467fe729f49810545ab8445ff3b.js.map