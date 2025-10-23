//prefabs路径枚举
export enum PrefabPathEnum {
    Arrow = 'Prefab/Arrow',
    coinNode = 'Prefab/xiaoPrefab/coinNode',
}

//实体类型枚举
export enum EntityTypeEnum {
    Arrow = "Arrow",
    coinNode = "coinNode",
}

/** 事件名称 */
export enum EventName {
    //引导位置变化
    ArrowTargetVectorUpdate = 'ArrowTargetVectorUpdate',
    //插头状态更新
    PlugStateUpdate = 'PlugStateUpdate',
    //开始触摸屏幕
    TouchSceenStart = "TouchSceenStart",
    //给塔金币
    GiveTowerCoin = "GiveTowerCoin",
    CoinAdd = "CoinAdd",
    //展示塔升级按钮
    TowerUpgradeButtonShow = "TowerUpgradeButtonShow",
    TowerUpgradeBtnClick = "TowerUpgradeBtnClick",
    // 游戏结束
    GameOver = "GameOver",

    coinNumUpLimit = "coinNumUpLimit",//金币数量达到升级界限

    ropeMovePoint = "ropeMovePoint", //绳子移动位置
}

//广告平台
export enum PlatformEnum {
    AppLovin = 'AppLovin',
    Facebook = 'Facebook',
    Google = 'Google',
    IronSource = 'IronSource',
    Liftoff = 'Liftoff',
    Mintegral = 'Mintegral',
    Moloco = 'Moloco',
    Pangle = 'Pangle',
    Rubeex = 'Rubeex',
    Tiktok = 'Tiktok',
    Unity = 'Unity'
}
