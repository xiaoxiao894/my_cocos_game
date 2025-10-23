System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, super_html_playable, _dec, _class, _crd, ccclass, property, GameEndUI;

  function _reportPossibleCrUseOfsuper_html_playable(extras) {
    _reporterNs.report("super_html_playable", "../super_html_playable", _context.meta, extras);
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
    }, function (_unresolved_2) {
      super_html_playable = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "41ecaz4f/JI1KuWQ4nZW93i", "GameEndUI", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameEndUI", GameEndUI = (_dec = ccclass('GameEndUI'), _dec(_class = class GameEndUI extends Component {
        downlodBtnCallBack() {
          console.log("点击了下载按钮");
          (_crd && super_html_playable === void 0 ? (_reportPossibleCrUseOfsuper_html_playable({
            error: Error()
          }), super_html_playable) : super_html_playable).download();
        } // start() {
        // }
        // update(deltaTime: number) {
        // }


      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e1e2e348d2f404578beed1d52e67febf4af7ab67.js.map