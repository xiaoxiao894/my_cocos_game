import { Vec3 } from "cc"

export enum PrefabPathEnum {
    Wood = "Prefab/Prop/Wood",
    Board = "Prefab/Prop/Board",

    Bear = "Prefab/xiaoPrefab/BearPrefab",
    Bear_L = "Prefab/xiaoPrefab/BearPrefab_L",
    Bear_B = "Prefab/xiaoPrefab/BearPrefab_B",
    Elephant = "Prefab/xiaoPrefab/ElephantPrefab",

    Coin = "Prefab/Prop/Coin",
    Tree = "Prefab/Tree",

    Electricity = "Prefab/Prop/Electricity",
    Partner = "Prefab/Actor/Partner",

    PathArrow = "Prefab/Tip/PathArrow",
}

export enum EntityTypeEnum {
    Wood = "Wood",
    Board = "Board",

    Bear_L = "Bear_L",
    Bear_B = "Bear_B",
    Bear = "Bear",
    Dog = "Dog",
    Elephant = "Elephant",

    Coin = "Coin",
    Tree = "Tree",

    Electricity = "Electricity",
    Partner = "Partner",
    FenceBloodBar = "FenceBloodBar",

    PathArrow = "PathArrow",
}

export enum EventNames {
    ArmyMoveByRVO = "ArmyMoveByRVO",
}

export enum GamePlayNameEnum {
    GamePlayOne = "GamePlay1",
    GamePlayTwo = "GamePlay2"
}

export enum PlotEnum {
    Plot1 = "Plot1",
    Plot2 = "Plot2",
    Plot3 = "Plot3",
    Plot4 = "Plot4",
    Plot5 = "Plot5",
    Plot6 = "Plot6",
    Plot7 = "Plot7",
    Plot8 = "Plot8",
    Plot9 = "Plot9",
}

export enum FunTypeEnum {
    Deliver = "Deliver",          // 交付
    Collect = "Collect",          // 收集
}

export enum PlacingEnum {
    WoodAccumulationCon = "WoodAccumulationCon",         // 木材堆积区域
    SceneCoinCon = "SceneCoinCon",
    Plot2Con = "Plot2Con",
    Plot3Con = "Plot3Con",
    Plot4Con = "Plot4Con",
    Plot5Con = "Plot5Con",
    Plot6Con = "Plot6Con",
    Plot7Con = "Plot7Con",
    Plot8Con = "Plot8Con",
    Plot9Con = "Plot9Con",

}

export enum TypeItemEnum {
    Wood = "Wood",
    Coin = "Coin",
}

export enum CollisionEntityEnum {
    DeliveryAreas1 = "DeliveryAreas1",
    DeliveryAreas2 = "DeliveryAreas2",
    DeliveryAreas3 = "DeliveryAreas3",
    DeliveryAreas4 = "DeliveryAreas4",
    DeliveryAreas5 = "DeliveryAreas5",
    DeliveryAreas6 = "DeliveryAreas6",
    DeliveryAreas7 = "DeliveryAreas7",
    DeliveryAreas8 = "DeliveryAreas8",
    DeliveryAreas9 = "DeliveryAreas9",
    DeliveryAreas10 = "DeliveryAreas10",
}

export enum PathEnum {
    FencesScene1 = "ThreeDNode/Map/Fences/Scene1",
    FencesScene2 = "ThreeDNode/Map/Fences/Scene2",
    FencesScene3 = "ThreeDNode/Map/Fences/Scene3",
    DeliveryAreas7 = "ThreeDNode/Map/DeliveryAreas/DeliveryAreas7",
    DeliveryAreas9 = "ThreeDNode/Map/DeliveryAreas/DeliveryAreas9",
    DeliveryAreas10 = "ThreeDNode/Map/DeliveryAreas/DeliveryAreas10",
    MinionWeaponCon = "ThreeDNode/MinionWeaponCon",
    RoadS2H = "ThreeDNode/road/roadS2-H",
    RoadS2S = "ThreeDNode/road/roadS2-S",
    Scene1PhysicsRight = "ThreeDNode/Map/Fences/Scene1Physics/Right",
    Scene2PhysicsRight = "ThreeDNode/Map/Fences/Scene2Physics/Right",
    Scene1Physics = "ThreeDNode/Map/Fences/Scene1Physics",
    Scene2Physics = "ThreeDNode/Map/Fences/Scene2Physics",
    Scene3Physics = "ThreeDNode/Map/Fences/Scene3Physics",
    OutSide1 = "ThreeDNode/Map/Fences/OutSide1",
    OutSide2 = "ThreeDNode/Map/Fences/OutSide2",
    OutSide3 = "ThreeDNode/Map/Fences/OutSide3",
    OutSide4 = "ThreeDNode/Map/Fences/OutSide4",
    Scene1 = "ThreeDNode/Map/Fences/Scene1",
    Scene2 = "ThreeDNode/Map/Fences/Scene2",
    Scene3 = "ThreeDNode/Map/Fences/Scene3",
    DeliveryAreasPh = "ThreeDNode/Map/ScenePh/DeliveryAreas"
}

export enum AreaEnum {
    ObtainEquipmentArea = "ObtainEquipmentArea",            // 获取
    DeliverEquipmentArea = "DeliverEquipmentArea"           // 交付
}

export type TreeAniData = {
    dir: Vec3,//控制树倒的幅度方向
    tree: {
        x: number,
        y: number
    }
}