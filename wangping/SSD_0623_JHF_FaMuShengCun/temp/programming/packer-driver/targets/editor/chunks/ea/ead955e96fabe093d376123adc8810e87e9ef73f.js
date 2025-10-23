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

          const code = sys.languageCode;
          const val = (_ref = (_this$DICT$code$key = (_this$DICT$code = this.DICT[code]) == null ? void 0 : _this$DICT$code[key]) != null ? _this$DICT$code$key : (_this$DICT$en = this.DICT['en']) == null ? void 0 : _this$DICT$en[key]) != null ? _ref : key;
          return val;
        }

        static get Instance() {
          return super.GetInstance();
        }

      }, _class2.DICT = {
        'zh': {
          Download: '立即试玩',
          Language: "zh"
        },
        'zh-cn': {
          Download: '立即试玩',
          Language: "zh-cn"
        },
        'zh-hk': {
          Download: '立即試玩',
          Language: "zh-hk"
        },
        'zh-mo': {
          Download: '立即試玩',
          Language: "zh-mo"
        },
        'zh-tw': {
          Download: '立即試玩',
          Language: "zh-tw"
        },
        'en': {
          Download: 'Play Now',
          Language: "en"
        },
        'fr': {
          Download: 'Jouer maintenant',
          Language: "fr"
        },
        'ja': {
          Download: '今すぐプレイ',
          Language: "ja"
        },
        'ko': {
          Download: '지금 플레이',
          Language: "ko"
        },
        'de': {
          Download: 'Jetzt spielen',
          Language: "de"
        },
        'ru': {
          Download: 'Играть сейчас',
          Language: "ru"
        }
      }, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ead955e96fabe093d376123adc8810e87e9ef73f.js.map