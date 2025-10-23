export enum PrefabPathEnum {
    JoyStick = "Prefab/JoyStick",                    // 虚拟摇杆
    Property = "Prefab/Property",                    // 资产UI
    //Map = "Prefab/Map",                   // 地图UI
    Money = "Prefab/Money",               // 钱
    Medicine = "Prefab/Medicine",           // 药剂
    Honor = "Prefab/Honor",                 // 荣誉
    People = "Prefab/People",               // 人物
    Mera = "Prefab/Mera",                  //眉拉
    Batman = "Prefab/Batman",               //蝙蝠侠
    Woman = "Prefab/Woman",               //神奇女侠
    Monster = "Prefab/Monster",             //小绿怪
    WithdrawMoneyRobot = "Prefab/WithdrawMoneyRobot",               // 收钱机器人
    CollectingMedicationRobot = "Prefab/CollectingMedicationRobot", // 收集药剂机器人
    Waypoints = "Prefab/Waypoints",                                 // 收钱机器人路线
    Waypoints1 = "Prefab/Waypoints1",                                // 收药剂机器人路线
    GameEnd = "Prefab/GameEnd"                                      //结束游戏界面
}

export enum EntityTypeEnum {
    JoyStick = "JoyStick",
    Property = "Property",
    Map = "Map",
    MiddleTile = "MiddleTile",
    Money = "Money", // 钱
    Medicine = "Medicine",  //药剂
    Honor = "Honor",  //荣誉
    People = "People",  //人
    WithdrawMoneyRobot = "WithdrawMoneyRobot",                      // 提款机器人 
    CollectingMedicationRobot = "CollectingMedicationRobot",         // 收集药剂机器人
    Mera = "Mera",                    //眉拉
    Batman = "Batman",               //蝙蝠侠
    Woman = "Woman",               //神奇女侠
    Monster = "Monster",             //小绿怪
    GameEnd = "GameEnd",            //结束界面
    Player = "Player",              //玩家
}


export enum CollisionZoneEnum {
    GetMoneyArea = "GetMoneyArea",  // 获取钱区域
    Operator = "Operator",          // 实验室交付区域
    MedicineGetArea = "MedicineGetArea",  //药剂获取区域，无实际区域引导用 
    DeliverMedicineArea = "DeliverMedicineArea",  // 交付药剂区域
    GetHonorArea = "GetHonorArea",  // 获取荣誉区域
    Helper1Area = "Helper1Area", //帮手1区域
    Helper2Area = "Helper2Area", //帮手2区域
    UnlockTileArea = "UnlockTileArea" //解锁地块区域
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

export enum UnlockType {
    Helper1,
    Helper2,
    UnlockTile
}

export enum EventNames {
    MedicineCanPick = 'MedicineStateChange',
    CreatMonster = "CreatMonster", //生成小绿怪
    MonsterBeaten = "MonsterBeaten", //小绿怪被打
    MonsterGiveMoney = "MonsterDead",   //小绿怪被打死了
    MonsterBattle = "MonsterBattle",  //小绿怪开战
    GameEnd = "GameEnd",
}

export enum RobotMoneyEnum {
    CollectMoney = 1,
    DeliveryMoney = 2,
}

export enum RobotMedicineEnum {
    CollectMedicine = 1,
    DeliveryMedicine = 2,
}

export enum UIPropertyEnum {
    Money = "Money",
    Medicament = "Medicament",
    HonorValue = "HonorValue",
}

export enum HeroEnum {
    Batman = "Batman",
    WonderWoman = "WonderWoman"
}