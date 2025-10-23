System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PlatformEnum, Platform, _crd, AdvChannels, storeIOS, storeANDROID;

  function _reportPossibleCrUseOfPlatformEnum(extras) {
    _reporterNs.report("PlatformEnum", "./Enum", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      PlatformEnum = _unresolved_2.PlatformEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2907e84w69NOYYDPc4ZRkDj", "Platform", undefined); // @ts-nocheck


      //打包过程会重置这个值，变成平台类型
      _export("AdvChannels", AdvChannels = '{{__adv_channels_adapter__}}');

      _export("storeIOS", storeIOS = "https://play.google.com/store/apps/details?id=com.funplus.ts.global");

      _export("storeANDROID", storeANDROID = "https://play.google.com/store/apps/details?id=com.funplus.ts.global"); // applovin google ironsource moloco unity


      _export("default", Platform = class Platform {
        constructor() {
          this._lockStore = false;
        }

        static get instance() {
          if (!this._instance) {
            this._instance = new Platform();
          }

          return this._instance;
        }

        init() {
          this._lockStore = false; //this.launchPlayable();
        } // private launchPlayable () {
        // }

        /**
         * 跳转
         */


        jumpStore() {
          var _dapi, _ExitApi;

          console.log("\u5E73\u53F0\uFF1A" + AdvChannels + " lockstore:" + this._lockStore);

          switch (AdvChannels) {
            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).AppLovin:
            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Unity:
              if (this._lockStore) return;

              if (/android/i.test(navigator.userAgent)) {
                var _window$mraid;

                this._lockStore = true;
                (_window$mraid = window.mraid) == null || _window$mraid.open(storeANDROID);
                setTimeout(() => {
                  this._lockStore = false;
                }, 500);
              } else {
                var _window$mraid2;

                this._lockStore = true;
                (_window$mraid2 = window.mraid) == null || _window$mraid2.open(storeIOS);
                setTimeout(() => {
                  this._lockStore = false;
                }, 500);
              }

              if (!window.mraid) {
                this.defaultJump();
                console.error(AdvChannels + "\u5E73\u53F0\u5305 \u5F53\u524D\u73AF\u5883\u6CA1\u6709 mraid \u73AF\u5883");
              }

              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).IronSource:
              if (this._lockStore) return;
              this._lockStore = true;
              (_dapi = dapi) == null || _dapi.openStoreUrl();
              setTimeout(() => {
                this._lockStore = false;
              }, 500);

              if (!dapi) {
                this.defaultJump();
                console.error(AdvChannels + "\u5E73\u53F0\u5305 \u5F53\u524D\u73AF\u5883\u6CA1\u6709 dapi \u73AF\u5883");
              }

              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Moloco:
              if (typeof window.FbPlayableAd !== "undefined") {
                window.FbPlayableAd.onCTAClick();
              } else {
                this.defaultJump();
                console.error(AdvChannels + "\u5E73\u53F0\u5305 \u5F53\u524D\u73AF\u5883\u6CA1\u6709 FbPlayableAd \u73AF\u5883");
              }

              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Google:
              if (this._lockStore) return;
              this._lockStore = true;
              (_ExitApi = ExitApi) == null || _ExitApi.exit();
              setTimeout(() => {
                this._lockStore = false;
              }, 500);

              if (!ExitApi) {
                this.defaultJump();
                console.error(AdvChannels + "\u5E73\u53F0\u5305 \u5F53\u524D\u73AF\u5883\u6CA1\u6709 ExitApi \u73AF\u5883");
              }

              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Facebook:
              if (window._lockStore) return;
              window._lockStore = true;
              setTimeout(function () {
                window._lockStore = false;
              }, 500);

              if (typeof window.FbPlayableAd !== "undefined") {
                window.FbPlayableAd.onCTAClick();
              } else {
                this.defaultJump();
                console.error(AdvChannels + "\u5E73\u53F0\u5305 \u5F53\u524D\u73AF\u5883\u6CA1\u6709 FbPlayableAd \u73AF\u5883");
              }

              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Pangle:
            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Tiktok:
              if (window._lockStore) return;
              window._lockStore = true;
              setTimeout(function () {
                window._lockStore = false;
              }, 500);
              window.openAppStore();
              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Vungle:
              if (window._lockStore) return;
              window._lockStore = true;
              window.parent.postMessage('download', '*');
              setTimeout(function () {
                window._lockStore = false;
              }, 500);
              break;

            default:
              this.defaultJump();
              console.error(AdvChannels + "\u5E73\u53F0\u672A\u63A5\u5165\u6216\u63A5\u5165\u6709\u95EE\u9898\uFF0C\u8BF7\u8054\u7CFB\u5F00\u53D1\u4EBA\u5458");
              break;
          }
        }

        defaultJump() {
          window.open(/android/i.test(navigator.userAgent) ? storeANDROID : storeIOS, "_blank");
        }

      });

      Platform._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=13514b27d9bace2c8de0f7bda5be31d5bcc91a4b.js.map