System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, StateDefine, MinionStateEnum, MonsterStateEnum, PartnerAttackEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "456b3cv5H9HYKvX+7wb1xsP", "StateDefine", undefined);

      _export("StateDefine", StateDefine = /*#__PURE__*/function (StateDefine) {
        StateDefine["Attack"] = "attack";
        StateDefine["Idle"] = "idle";
        StateDefine["Walk"] = "walk_f";
        StateDefine["Walk_attack"] = "walk-attack";
        StateDefine["Die"] = "Die";
        return StateDefine;
      }({}));

      _export("MinionStateEnum", MinionStateEnum = /*#__PURE__*/function (MinionStateEnum) {
        MinionStateEnum["Attack"] = "attack";
        MinionStateEnum["Idle"] = "idle";
        MinionStateEnum["Walk"] = "walk_f";
        return MinionStateEnum;
      }({}));

      _export("MonsterStateEnum", MonsterStateEnum = /*#__PURE__*/function (MonsterStateEnum) {
        MonsterStateEnum["Attack"] = "attack01";
        MonsterStateEnum["Idle"] = "idle";
        MonsterStateEnum["Die"] = "die";
        MonsterStateEnum["Walk"] = "walk_f";
        return MonsterStateEnum;
      }({}));

      _export("PartnerAttackEnum", PartnerAttackEnum = /*#__PURE__*/function (PartnerAttackEnum) {
        PartnerAttackEnum["Attack"] = "attack";
        return PartnerAttackEnum;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=19b26be9e6be2ab15969538120268a2031af8ca2.js.map