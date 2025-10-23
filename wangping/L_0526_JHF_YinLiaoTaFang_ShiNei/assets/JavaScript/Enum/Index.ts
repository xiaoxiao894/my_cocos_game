export enum PrefabPathEnum {
    //怪物
    Spider = "Prefab/Monster/Spider",
    Mantis = "Prefab/Monster/Mantis",

    //怪的血条
    MonsterBloodBar = "Prefab/UI/MonsterBloodBar",

    // 伙伴
    // Partner1 = "Prefab/PartnerSequence/Partner1-L",
    // Partner2 = "Prefab/PartnerSequence/Partner2-L",
    // Partner3 = "Prefab/PartnerSequence/Partner3-L",
    // Partner4 = "Prefab/PartnerSequence/Partner4-L",
    // Partner5 = "Prefab/PartnerSequence/Partner5-L",

    // 卡片
    // Card1 = "Prefab/Card/Card1Con",
    // Card2 = "Prefab/Card/Card2Con",
    // Card3 = "Prefab/Card/Card3Con",
    // Card4 = "Prefab/Card/Card4Con",
    // Card5 = "Prefab/Card/Card5Con",

    // 箭头
    Arrow = "Prefab/Tip/Arrow",
    BoosTip = "Prefab/Tip/BoosTip",
    PathArrow = "Prefab/Tip/PathArrow",

    //掉落物
    dropItem = "Prefab/Icon/dropItem",

    // 兵人 武器
    Weapon = "Prefab/Actor/Weapon",
    Minion = "Prefab/Actor/Minion",

    // 伙伴技能
    // PartnerSkill1 = "Prefab/PartnerSkills/PartnerSkill1",
    // PartnerSkill2 = "Prefab/PartnerSkills/PartnerSkill2",
    // PartnerSkill3 = "Prefab/PartnerSkills/PartnerSkill3",
    // PartnerSkill4 = "Prefab/PartnerSkills/PartnerSkill4",
    // PartnerSkill5 = "Prefab/PartnerSkills/PartnerSkill5",

    FenceBloodBar = "Prefab/UI/FenceBloodBar",

    // 兵人武器
    MinionWeapons = "Prefab/Emitter/weapon_mianqianB",
    TX_Attack_hit = "Prefab/Emitter/TX_Attack_hit",
    // TX_zidanB_hit = "Prefab/Emitter/TX_zidanB_hit",
    TX_shengjiLZ = "Prefab/TX/TX_shengjiLZ"
}

// 武器类型
export enum PlayerWeaponTypeEnum {
    CottonSwab = "CottonSwab",                  // 棉签
    Knife = "Knife",                            // 刀
    Flamethrower = "Flamethrower",              // 喷火器
}

export enum EntityTypeEnum {
    //怪物
    Spider = "Spider",
    Mantis = "Mantis",

    //怪的血条
    MonsterBloodBar = "MonsterBloodBar",

    // 伙伴
    Partner1 = "Partner1",
    Partner2 = "Partner2",
    Partner3 = "Partner3",
    Partner4 = "Partner4",
    Partner5 = "Partner5",

    //卡片
    Card1 = "Card1",
    Card2 = "Card2",
    Card3 = "Card3",
    Card4 = "Card4",
    Card5 = "Card5",

    Arrow = "Arrow",
    BoosTip = "BoosTip",
    PathArrow = "PathArrow",

    //掉落物
    dropItem = "dropItem",

    Weapon = "Weapon",
    Minion = "Minion",

    // 伙伴技能
    PartnerSkill1 = "PartnerSkill1",
    PartnerSkill2 = "PartnerSkill2",
    PartnerSkill3 = "PartnerSkill3",
    PartnerSkill4 = "PartnerSkill4",
    PartnerSkill5 = "PartnerSkill5",

    // 栅栏血条
    FenceBloodBar = "FenceBloodBar",

    // 兵人武器
    MinionWeapons = "MinionWeapons",
    TX_Attack_hit = "TX_Attack_hit",
    TX_zidanB_hit = "TX_zidanB_hit",
    TX_shengjiLZ = "TX_shengjiLZ",
}

//广告平台
export enum PlatformEnum {
    AppLovin = 'AppLovin',
    Facebook = 'Facebook',
    Google = 'Google',
    IronSource = 'IronSource',
    Moloco = 'Moloco',
    Pangle = 'Pangle',
    Tiktok = 'Tiktok',
    Unity = 'Unity',
    Vungle = 'Vungle'

}

export enum EventNames {
    ArmyMoveByRVO = "ArmyMoveByRVO",
}

export enum GamePlayNameEnum {
    GamePlayOne = "GamePlay1",
    GamePlayTwo = "GamePlay2"
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
    DeliveryAreas11 = "DeliveryAreas11",
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