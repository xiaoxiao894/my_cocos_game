System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, App, _dec, _class, _class2, _crd, ccclass, property, PlayerController;

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "./Player", _context.meta, extras);
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
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ec9de8qf+9PiLQS/E7je55l", "PlayerController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerController", PlayerController = (_dec = ccclass('PlayerController'), _dec(_class = (_class2 = class PlayerController {
        constructor() {
          this.player = null;
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new PlayerController();
          }

          return this._instance;
        }

        continueGame() {
          this.player.continue(); // this.initPlayer();
        }

        getPlayer() {
          return this.player;
        }

        initPlayer() {
          this.player = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.player;
          this.player.idle();
        }

        playMove() {
          this.player.move();
        }

        playIdle() {
          this.player.idle();
        }

        playMoveAttack() {
          this.player.moveAttack();
        }

        update(dt) {//this.player.update(dt);
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f45e6b9efe47d8bf9769ca4d93778e3a3d8a4e86.js.map