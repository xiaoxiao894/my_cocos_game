System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, sys, _dec, _class, _class2, _crd, ccclass, LanguageManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5ce68exlxhOXJFmiSx39DV8", "LanguageManager", undefined);

      //import Singleton from '../Base/Singleton';
      __checkObsolete__(['_decorator', 'sys']);

      ({
        ccclass
      } = _decorator);

      _export("LanguageManager", LanguageManager = (_dec = ccclass('LanguageManager'), _dec(_class = (_class2 = class LanguageManager {
        static get Instance() {
          if (this._instance == null) {
            this._instance = new LanguageManager();
          }

          return this._instance;
        }

        static t(key) {
          var _ref, _this$DICT$code$key, _this$DICT$code, _this$DICT$en;

          const code = sys.languageCode;
          const val = (_ref = (_this$DICT$code$key = (_this$DICT$code = this.DICT[code]) == null ? void 0 : _this$DICT$code[key]) != null ? _this$DICT$code$key : (_this$DICT$en = this.DICT['en']) == null ? void 0 : _this$DICT$en[key]) != null ? _ref : key;
          return val;
        }

      }, _class2._instance = null, _class2.DICT = {
        'zh': {
          Download: '下载',
          retry: '重试',
          Stagbeetle: '锹形虫',
          Beetle: '甲虫',
          Beetlewarrior: '甲虫战士'
        },
        'zh-cn': {
          Download: '下载',
          retry: '重试',
          Stagbeetle: '锹形虫',
          Beetle: '甲虫',
          Beetlewarrior: '甲虫战士'
        },
        'zh-hk': {
          Download: '下載',
          retry: '重試',
          Stagbeetle: '鍬形蟲',
          Beetle: '甲蟲',
          Beetlewarrior: '甲蟲戰士'
        },
        'zh-mo': {
          Download: '下載',
          retry: '重試',
          Stagbeetle: '鍬形蟲',
          Beetle: '甲蟲',
          Beetlewarrior: '甲蟲戰士'
        },
        'zh-tw': {
          Download: '下載',
          retry: '重試',
          Stagbeetle: '鍬形蟲',
          Beetle: '甲蟲',
          Beetlewarrior: '甲蟲戰士'
        },
        'en': {
          Download: 'Download',
          retry: 'TryAgain',
          Stagbeetle: 'Stagbeetle',
          Beetle: 'Beetle',
          Beetlewarrior: 'Beetlewarrior'
        },
        'fr': {
          Download: 'Télécharger',
          retry: 'Réessayer',
          Stagbeetle: 'Lucane',
          Beetle: 'Scarabée',
          Beetlewarrior: 'Guerrier scarabée'
        },
        'ja': {
          Download: 'ダウンロード',
          Stagbeetle: 'クワガタムシ',
          retry: '再試行',
          Beetle: '甲虫',
          Beetlewarrior: '甲虫戦士'
        },
        'ko': {
          Download: '다운로드',
          retry: '다시 시도',
          Stagbeetle: '사슴벌레',
          Beetle: '딱정벌레',
          Beetlewarrior: '딱정벌레 전사'
        },
        'de': {
          Download: 'Herunterladen',
          retry: 'Wiederholen',
          Stagbeetle: 'Hirschkäfer',
          Beetle: 'Käfer',
          Beetlewarrior: 'Käferkrieger'
        },
        'ru': {
          Download: 'Скачать',
          Stagbeetle: 'Жук-олень',
          retry: 'Повторить',
          Beetle: 'Жук',
          Beetlewarrior: 'Жук-воин'
        }
      }, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=84f3bf23d7336bea4cae756841db4f75afd4cf73.js.map