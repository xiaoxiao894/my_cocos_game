System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, PrefabPathEnum, EntityTypeEnum, PlatformEnum, EventNames, GamePlayNameEnum, CollisionEntityEnum, PathEnum, AreaEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a69b0DoJZtIAZHdCbXbn0FJ", "Index", undefined);

      _export("PrefabPathEnum", PrefabPathEnum = /*#__PURE__*/function (PrefabPathEnum) {
        PrefabPathEnum["Spider"] = "Prefab/Monster/Spider";
        PrefabPathEnum["Mantis"] = "Prefab/Monster/Mantis";
        PrefabPathEnum["MonsterBloodBar"] = "Prefab/UI/MonsterBloodBar";
        PrefabPathEnum["Partner1"] = "Prefab/PartnerSequence/Partner1-L";
        PrefabPathEnum["Partner2"] = "Prefab/PartnerSequence/Partner2-L";
        PrefabPathEnum["Partner3"] = "Prefab/PartnerSequence/Partner3-L";
        PrefabPathEnum["Card1"] = "Prefab/Card/Card1Con";
        PrefabPathEnum["Card2"] = "Prefab/Card/Card2Con";
        PrefabPathEnum["Card3"] = "Prefab/Card/Card3Con";
        PrefabPathEnum["Arrow"] = "Prefab/Tip/Arrow";
        PrefabPathEnum["BoosTip"] = "Prefab/Tip/BoosTip";
        PrefabPathEnum["PathArrow"] = "Prefab/Tip/PathArrow";
        PrefabPathEnum["dropItem"] = "Prefab/Icon/dropItem";
        PrefabPathEnum["Weapon"] = "Prefab/Actor/Weapon";
        PrefabPathEnum["Minion"] = "Prefab/Actor/Minion";
        PrefabPathEnum["PartnerSkill1"] = "Prefab/PartnerSkills/PartnerSkill1";
        PrefabPathEnum["FenceBloodBar"] = "Prefab/UI/FenceBloodBar";
        PrefabPathEnum["MinionWeapons"] = "Prefab/Emitter/weapon_mianqianB";
        PrefabPathEnum["TX_Attack_hit"] = "Prefab/Emitter/TX_Attack_hit";
        PrefabPathEnum["TX_zidanB_hit"] = "Prefab/Emitter/TX_zidanB_hit";
        PrefabPathEnum["TX_shengjiLZ"] = "Prefab/TX/TX_shengjiLZ";
        return PrefabPathEnum;
      }({}));

      _export("EntityTypeEnum", EntityTypeEnum = /*#__PURE__*/function (EntityTypeEnum) {
        EntityTypeEnum["Spider"] = "Spider";
        EntityTypeEnum["Mantis"] = "Mantis";
        EntityTypeEnum["MonsterBloodBar"] = "MonsterBloodBar";
        EntityTypeEnum["Partner1"] = "Partner1";
        EntityTypeEnum["Partner2"] = "Partner2";
        EntityTypeEnum["Partner3"] = "Partner3";
        EntityTypeEnum["Partner4"] = "Partner4";
        EntityTypeEnum["Partner5"] = "Partner5";
        EntityTypeEnum["Card1"] = "Card1";
        EntityTypeEnum["Card2"] = "Card2";
        EntityTypeEnum["Card3"] = "Card3";
        EntityTypeEnum["Card4"] = "Card4";
        EntityTypeEnum["Card5"] = "Card5";
        EntityTypeEnum["Arrow"] = "Arrow";
        EntityTypeEnum["BoosTip"] = "BoosTip";
        EntityTypeEnum["PathArrow"] = "PathArrow";
        EntityTypeEnum["dropItem"] = "dropItem";
        EntityTypeEnum["Weapon"] = "Weapon";
        EntityTypeEnum["Minion"] = "Minion";
        EntityTypeEnum["PartnerSkill1"] = "PartnerSkill1";
        EntityTypeEnum["PartnerSkill2"] = "PartnerSkill2";
        EntityTypeEnum["PartnerSkill3"] = "PartnerSkill3";
        EntityTypeEnum["PartnerSkill4"] = "PartnerSkill4";
        EntityTypeEnum["PartnerSkill5"] = "PartnerSkill5";
        EntityTypeEnum["FenceBloodBar"] = "FenceBloodBar";
        EntityTypeEnum["MinionWeapons"] = "MinionWeapons";
        EntityTypeEnum["TX_Attack_hit"] = "TX_Attack_hit";
        EntityTypeEnum["TX_zidanB_hit"] = "TX_zidanB_hit";
        EntityTypeEnum["TX_shengjiLZ"] = "TX_shengjiLZ";
        return EntityTypeEnum;
      }({})); //广告平台


      _export("PlatformEnum", PlatformEnum = /*#__PURE__*/function (PlatformEnum) {
        PlatformEnum["AppLovin"] = "AppLovin";
        PlatformEnum["Facebook"] = "Facebook";
        PlatformEnum["Google"] = "Google";
        PlatformEnum["IronSource"] = "IronSource";
        PlatformEnum["Moloco"] = "Moloco";
        PlatformEnum["Pangle"] = "Pangle";
        PlatformEnum["Tiktok"] = "Tiktok";
        PlatformEnum["Unity"] = "Unity";
        PlatformEnum["Vungle"] = "Vungle";
        return PlatformEnum;
      }({}));

      _export("EventNames", EventNames = /*#__PURE__*/function (EventNames) {
        EventNames["ArmyMoveByRVO"] = "ArmyMoveByRVO";
        return EventNames;
      }({}));

      _export("GamePlayNameEnum", GamePlayNameEnum = /*#__PURE__*/function (GamePlayNameEnum) {
        GamePlayNameEnum["GamePlayOne"] = "GamePlay1";
        GamePlayNameEnum["GamePlayTwo"] = "GamePlay2";
        return GamePlayNameEnum;
      }({}));

      _export("CollisionEntityEnum", CollisionEntityEnum = /*#__PURE__*/function (CollisionEntityEnum) {
        CollisionEntityEnum["DeliveryAreas1"] = "DeliveryAreas1";
        CollisionEntityEnum["DeliveryAreas2"] = "DeliveryAreas2";
        CollisionEntityEnum["DeliveryAreas3"] = "DeliveryAreas3";
        CollisionEntityEnum["DeliveryAreas4"] = "DeliveryAreas4";
        CollisionEntityEnum["DeliveryAreas5"] = "DeliveryAreas5";
        CollisionEntityEnum["DeliveryAreas6"] = "DeliveryAreas6";
        CollisionEntityEnum["DeliveryAreas7"] = "DeliveryAreas7";
        CollisionEntityEnum["DeliveryAreas8"] = "DeliveryAreas8";
        CollisionEntityEnum["DeliveryAreas9"] = "DeliveryAreas9";
        CollisionEntityEnum["DeliveryAreas10"] = "DeliveryAreas10";
        return CollisionEntityEnum;
      }({}));

      _export("PathEnum", PathEnum = /*#__PURE__*/function (PathEnum) {
        PathEnum["FencesScene1"] = "ThreeDNode/Map/Fences/Scene1";
        PathEnum["FencesScene2"] = "ThreeDNode/Map/Fences/Scene2";
        PathEnum["FencesScene3"] = "ThreeDNode/Map/Fences/Scene3";
        PathEnum["DeliveryAreas7"] = "ThreeDNode/Map/DeliveryAreas/DeliveryAreas7";
        PathEnum["DeliveryAreas9"] = "ThreeDNode/Map/DeliveryAreas/DeliveryAreas9";
        PathEnum["DeliveryAreas10"] = "ThreeDNode/Map/DeliveryAreas/DeliveryAreas10";
        PathEnum["MinionWeaponCon"] = "ThreeDNode/MinionWeaponCon";
        PathEnum["RoadS2H"] = "ThreeDNode/road/roadS2-H";
        PathEnum["RoadS2S"] = "ThreeDNode/road/roadS2-S";
        PathEnum["Scene1PhysicsRight"] = "ThreeDNode/Map/Fences/Scene1Physics/Right";
        PathEnum["Scene2PhysicsRight"] = "ThreeDNode/Map/Fences/Scene2Physics/Right";
        PathEnum["Scene1Physics"] = "ThreeDNode/Map/Fences/Scene1Physics";
        PathEnum["Scene2Physics"] = "ThreeDNode/Map/Fences/Scene2Physics";
        PathEnum["Scene3Physics"] = "ThreeDNode/Map/Fences/Scene3Physics";
        PathEnum["OutSide1"] = "ThreeDNode/Map/Fences/OutSide1";
        PathEnum["OutSide2"] = "ThreeDNode/Map/Fences/OutSide2";
        PathEnum["OutSide3"] = "ThreeDNode/Map/Fences/OutSide3";
        PathEnum["OutSide4"] = "ThreeDNode/Map/Fences/OutSide4";
        PathEnum["Scene1"] = "ThreeDNode/Map/Fences/Scene1";
        PathEnum["Scene2"] = "ThreeDNode/Map/Fences/Scene2";
        PathEnum["Scene3"] = "ThreeDNode/Map/Fences/Scene3";
        PathEnum["DeliveryAreasPh"] = "ThreeDNode/Map/ScenePh/DeliveryAreas";
        return PathEnum;
      }({}));

      _export("AreaEnum", AreaEnum = /*#__PURE__*/function (AreaEnum) {
        AreaEnum["ObtainEquipmentArea"] = "ObtainEquipmentArea";
        AreaEnum["DeliverEquipmentArea"] = "DeliverEquipmentArea";
        return AreaEnum;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1ed039c5e0eac41d0196875266557e24b8dda38e.js.map