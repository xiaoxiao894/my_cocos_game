System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, sys, Singleton, _dec, _class, _class2, _crd, ccclass, LanguageManager;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5ce68exlxhOXJFmiSx39DV8", "LanguageManager", undefined);

      __checkObsolete__(['_decorator', 'sys']);

      ({
        ccclass
      } = _decorator);

      _export("LanguageManager", LanguageManager = (_dec = ccclass('LanguageManager'), _dec(_class = (_class2 = class LanguageManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static t(key) {
          var _ref, _this$DICT$code$key, _this$DICT$code, _this$DICT$en;

          var code = sys.languageCode;
          var val = (_ref = (_this$DICT$code$key = (_this$DICT$code = this.DICT[code]) == null ? void 0 : _this$DICT$code[key]) != null ? _this$DICT$code$key : (_this$DICT$en = this.DICT['en']) == null ? void 0 : _this$DICT$en[key]) != null ? _ref : key;
          return val;
        }

        static get Instance() {
          return super.GetInstance();
        }

      }, _class2.DICT = {
        'zh': {
          Download: '下载',
          Stagbeetle: '锹形虫',
          Beetle: '甲虫',
          Beetlewarrior: '甲虫战士'
        },
        'zh-cn': {
          Download: '下载',
          Stagbeetle: '锹形虫',
          Beetle: '甲虫',
          Beetlewarrior: '甲虫战士'
        },
        'zh-hk': {
          Download: '下載',
          Stagbeetle: '鍬形蟲',
          Beetle: '甲蟲',
          Beetlewarrior: '甲蟲戰士'
        },
        'zh-mo': {
          Download: '下載',
          Stagbeetle: '鍬形蟲',
          Beetle: '甲蟲',
          Beetlewarrior: '甲蟲戰士'
        },
        'zh-tw': {
          Download: '下載',
          Stagbeetle: '鍬形蟲',
          Beetle: '甲蟲',
          Beetlewarrior: '甲蟲戰士'
        },
        'en': {
          Download: 'Download',
          Stagbeetle: 'Stagbeetle',
          Beetle: 'Beetle',
          Beetlewarrior: 'Beetlewarrior'
        },
        'fr': {
          Download: 'Télécharger',
          Stagbeetle: 'Lucane',
          Beetle: 'Scarabée',
          Beetlewarrior: 'Guerrier scarabée'
        },
        'ja': {
          Download: 'ダウンロード',
          Stagbeetle: 'クワガタムシ',
          Beetle: '甲虫',
          Beetlewarrior: '甲虫戦士'
        },
        'ko': {
          Download: '다운로드',
          Stagbeetle: '사슴벌레',
          Beetle: '딱정벌레',
          Beetlewarrior: '딱정벌레 전사'
        },
        'de': {
          Download: 'Herunterladen',
          Stagbeetle: 'Hirschkäfer',
          Beetle: 'Käfer',
          Beetlewarrior: 'Käferkrieger'
        },
        'ru': {
          Download: 'Скачать',
          Stagbeetle: 'Жук-олень',
          Beetle: 'Жук',
          Beetlewarrior: 'Жук-воин'
        }
      }, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9d0ce00f23d5fc75a2d6d9052a79f48d322c8661.js.map