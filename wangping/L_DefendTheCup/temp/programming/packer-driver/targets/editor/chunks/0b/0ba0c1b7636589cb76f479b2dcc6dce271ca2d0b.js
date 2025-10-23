System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PlatformEnum, Platform, _crd, AdvChannels, storeIOS, storeANDROID;

  function _reportPossibleCrUseOfPlatformEnum(extras) {
    _reporterNs.report("PlatformEnum", "../Enum", _context.meta, extras);
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

      _cclegacy._RF.push({}, "3146b+3QLJO15/o3/EnN32O", "Platform", undefined); // @ts-nocheck


      //打包过程会重置这个值，变成平台类型
      _export("AdvChannels", AdvChannels = '{{__adv_channels_adapter__}}');

      _export("storeIOS", storeIOS = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3");

      _export("storeANDROID", storeANDROID = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3"); // applovin google ironsource moloco unity


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

          // console.log(`平台：${AdvChannels} lockstore:${this._lockStore}`);
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
                console.error(`${AdvChannels}平台包 当前环境没有 mraid 环境`);
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
                console.error(`${AdvChannels}平台包 当前环境没有 dapi 环境`);
              }

              break;

            case (_crd && PlatformEnum === void 0 ? (_reportPossibleCrUseOfPlatformEnum({
              error: Error()
            }), PlatformEnum) : PlatformEnum).Moloco:
              if (typeof window.FbPlayableAd !== "undefined") {
                window.FbPlayableAd.onCTAClick();
              } else {
                this.defaultJump();
                console.error(`${AdvChannels}平台包 当前环境没有 FbPlayableAd 环境`);
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
                console.error(`${AdvChannels}平台包 当前环境没有 ExitApi 环境`);
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
                console.error(`${AdvChannels}平台包 当前环境没有 FbPlayableAd 环境`);
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
              console.error(`${AdvChannels}平台未接入或接入有问题，请联系开发人员`);
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
//# sourceMappingURL=0ba0c1b7636589cb76f479b2dcc6dce271ca2d0b.js.map