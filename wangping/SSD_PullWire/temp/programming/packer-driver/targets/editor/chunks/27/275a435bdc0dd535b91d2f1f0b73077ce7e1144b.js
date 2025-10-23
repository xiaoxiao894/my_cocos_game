System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, super_html_playable, _crd;

  _export("super_html_playable", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5cbc1in49JN97WWOJqfqvIW", "super_html_playable", undefined);

      /**
       * super-html playable adapter
       * @help https://store.cocos.com/app/detail/3657
       * @home https://github.com/magician-f/cocos-playable-demo
       * @author https://github.com/magician-f
       */
      _export("super_html_playable", super_html_playable = class super_html_playable {
        download() {
          console.log("download"); //@ts-ignore

          window.super_html && super_html.download();
        }

        game_end() {
          console.log("game end"); //@ts-ignore

          window.super_html && super_html.game_end();
        }
        /**
         * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
         * channel : google
         */


        is_hide_download() {
          //@ts-ignore
          if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
          }

          return false;
        }
        /**
         * 设置商店地址
         * channel : unity
         * @param url https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp
         */


        set_google_play_url(url) {
          //@ts-ignore
          window.super_html && (super_html.google_play_url = url);
        }
        /**
        * 设置商店地址
        * channel : unity
        * @param url https://apps.apple.com/us/app/ad-testing/id1463016906
        */


        set_app_store_url(url) {
          //@ts-ignore
          window.super_html && (super_html.appstore_url = url);
        }
        /**
        * 是否开启声音
        * channel : ironsource
        */


        is_audio() {
          //@ts-ignore
          return window.super_html && super_html.is_audio() || true;
        }

      });

      _export("default", new super_html_playable());

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=275a435bdc0dd535b91d2f1f0b73077ce7e1144b.js.map