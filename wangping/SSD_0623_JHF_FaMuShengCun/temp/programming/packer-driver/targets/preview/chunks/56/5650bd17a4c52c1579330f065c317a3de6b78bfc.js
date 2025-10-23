System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, StateDefine, PartnerEnum, MinionStateEnum, MonsterStateEnum, PartnerAttackEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "456b3cv5H9HYKvX+7wb1xsP", "StateDefine", undefined);

      _export("StateDefine", StateDefine = /*#__PURE__*/function (StateDefine) {
        StateDefine["Attack"] = "Cut_Woodcutter";
        StateDefine["Idle"] = "Idel_Woodcutter";
        StateDefine["Walk"] = "Run_Woodcutter";
        StateDefine["Walk_attack"] = "walk-attack";
        StateDefine["Die"] = "Die";
        return StateDefine;
      }({}));

      _export("PartnerEnum", PartnerEnum = /*#__PURE__*/function (PartnerEnum) {
        PartnerEnum["Attack"] = "Cut_Woodcutter";
        PartnerEnum["Idle"] = "Idel_Woodcutter";
        PartnerEnum["Walk"] = "Run_Woodcutter";
        PartnerEnum["Walk_attack"] = "walk-attack";
        PartnerEnum["Die"] = "Die";
        return PartnerEnum;
      }({}));

      _export("MinionStateEnum", MinionStateEnum = /*#__PURE__*/function (MinionStateEnum) {
        MinionStateEnum["Attack"] = "attack";
        MinionStateEnum["Idle"] = "idle";
        MinionStateEnum["Walk"] = "walk_f";
        return MinionStateEnum;
      }({}));

      _export("MonsterStateEnum", MonsterStateEnum = /*#__PURE__*/function (MonsterStateEnum) {
        MonsterStateEnum["Attack"] = "attack";
        MonsterStateEnum["Idle"] = "idle";
        MonsterStateEnum["Die"] = "die";
        MonsterStateEnum["Walk"] = "walk";
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
//# sourceMappingURL=5650bd17a4c52c1579330f065c317a3de6b78bfc.js.map