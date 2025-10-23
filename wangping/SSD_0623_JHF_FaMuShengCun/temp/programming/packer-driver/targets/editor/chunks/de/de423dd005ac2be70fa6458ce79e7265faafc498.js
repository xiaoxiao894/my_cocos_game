System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _crd, PrefabPathEnum, EntityTypeEnum, EventNames, GamePlayNameEnum, PlotEnum, FunTypeEnum, PlacingEnum, TypeItemEnum, CollisionEntityEnum, PathEnum, AreaEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a69b0DoJZtIAZHdCbXbn0FJ", "Index", undefined);

      __checkObsolete__(['Vec3']);

      _export("PrefabPathEnum", PrefabPathEnum = /*#__PURE__*/function (PrefabPathEnum) {
        PrefabPathEnum["Wood"] = "Prefab/Prop/Wood";
        PrefabPathEnum["Board"] = "Prefab/Prop/Board";
        PrefabPathEnum["Bear"] = "Prefab/xiaoPrefab/BearPrefab";
        PrefabPathEnum["Bear_L"] = "Prefab/xiaoPrefab/BearPrefab_L";
        PrefabPathEnum["Bear_B"] = "Prefab/xiaoPrefab/BearPrefab_B";
        PrefabPathEnum["Elephant"] = "Prefab/xiaoPrefab/ElephantPrefab";
        PrefabPathEnum["Coin"] = "Prefab/Prop/Coin";
        PrefabPathEnum["Tree"] = "Prefab/Tree";
        PrefabPathEnum["Electricity"] = "Prefab/Prop/Electricity";
        PrefabPathEnum["Partner"] = "Prefab/Actor/Partner";
        PrefabPathEnum["PathArrow"] = "Prefab/Tip/PathArrow";
        return PrefabPathEnum;
      }({}));

      _export("EntityTypeEnum", EntityTypeEnum = /*#__PURE__*/function (EntityTypeEnum) {
        EntityTypeEnum["Wood"] = "Wood";
        EntityTypeEnum["Board"] = "Board";
        EntityTypeEnum["Bear_L"] = "Bear_L";
        EntityTypeEnum["Bear_B"] = "Bear_B";
        EntityTypeEnum["Bear"] = "Bear";
        EntityTypeEnum["Dog"] = "Dog";
        EntityTypeEnum["Elephant"] = "Elephant";
        EntityTypeEnum["Coin"] = "Coin";
        EntityTypeEnum["Tree"] = "Tree";
        EntityTypeEnum["Electricity"] = "Electricity";
        EntityTypeEnum["Partner"] = "Partner";
        EntityTypeEnum["FenceBloodBar"] = "FenceBloodBar";
        EntityTypeEnum["PathArrow"] = "PathArrow";
        return EntityTypeEnum;
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

      _export("PlotEnum", PlotEnum = /*#__PURE__*/function (PlotEnum) {
        PlotEnum["Plot1"] = "Plot1";
        PlotEnum["Plot2"] = "Plot2";
        PlotEnum["Plot3"] = "Plot3";
        PlotEnum["Plot4"] = "Plot4";
        PlotEnum["Plot5"] = "Plot5";
        PlotEnum["Plot6"] = "Plot6";
        PlotEnum["Plot7"] = "Plot7";
        PlotEnum["Plot8"] = "Plot8";
        PlotEnum["Plot9"] = "Plot9";
        return PlotEnum;
      }({}));

      _export("FunTypeEnum", FunTypeEnum = /*#__PURE__*/function (FunTypeEnum) {
        FunTypeEnum["Deliver"] = "Deliver";
        FunTypeEnum["Collect"] = "Collect";
        return FunTypeEnum;
      }({}));

      _export("PlacingEnum", PlacingEnum = /*#__PURE__*/function (PlacingEnum) {
        PlacingEnum["WoodAccumulationCon"] = "WoodAccumulationCon";
        PlacingEnum["SceneCoinCon"] = "SceneCoinCon";
        PlacingEnum["Plot2Con"] = "Plot2Con";
        PlacingEnum["Plot3Con"] = "Plot3Con";
        PlacingEnum["Plot4Con"] = "Plot4Con";
        PlacingEnum["Plot5Con"] = "Plot5Con";
        PlacingEnum["Plot6Con"] = "Plot6Con";
        PlacingEnum["Plot7Con"] = "Plot7Con";
        PlacingEnum["Plot8Con"] = "Plot8Con";
        PlacingEnum["Plot9Con"] = "Plot9Con";
        return PlacingEnum;
      }({}));

      _export("TypeItemEnum", TypeItemEnum = /*#__PURE__*/function (TypeItemEnum) {
        TypeItemEnum["Wood"] = "Wood";
        TypeItemEnum["Coin"] = "Coin";
        return TypeItemEnum;
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
//# sourceMappingURL=de423dd005ac2be70fa6458ce79e7265faafc498.js.map