//prefabs路径枚举
export enum PrefabPathEnum {
    Wood = 'Prefab/Wood',
    PathArrow = "Prefab/PathArrow",
}

//实体类型枚举
export enum EntityTypeEnum {
    Player = "Player", //玩家
    Plug = "Plug",  //插头
    Wood = "Wood", //木头
    PlugInArea = "PlugInArea", //插座区域
    PlugGetArea = "PlugGetArea", //插头取出区域
    DeliverWoodArea = "DeliverWoodArea", //木头交付区域
    PlayerHideNode = "PlayerHideNode", //玩家隐藏区域
    PathArrow = "PathArrow",
}

/** 事件名称 */
export enum EventName {
    /** 插头变X光效果 */
    XrayEffect = 'XrayEffect',
    /** 插头普通效果 */
    XrayEffectOver = 'XrayEffectOver',
    /** 插完插座 */
    PlugInOver = 'PlugInOver',
    /** 通电结束 */
    PlugPowerOver = 'PlugPowerOver',
    /** 隐藏柱子和插座的电流效果 */
    ElectricityHide = "ElectricityHide",
    //给塔木头
    GiveTowerWood = "GiveTowerWood",
    /** 树播倒的动画 */
    TreeFallAniPlay = 'TreeFallAniPlay',
    /** 人可以移动 */
    PeoPleCanMove = "PeoPleCanMove",
    //引导位置变化
    ArrowTargetVectorUpdate = 'ArrowTargetVectorUpdate',
    //箭头路径创建
    ArrowPathCreate = 'ArrowPathCreate',
    // 箭头路径消除
    ArrowPathRemove = 'ArrowPathRemove',
    //四个地块提前初始化
    FourBlockInit = 'FourBlockInit',
    //地块落下动画播放
    BlockFallAniPlay = 'BlockFallAniPlay',
    //通知绳子变长
    RopeTotalLenChange = 'RopeTotalLenChange',
    /** 树处理完 */
    TreeToWoodInited = 'TreeToWoodInited',

    /** 隐藏绳子长度变化提示 */
    HideRopeLenChangeTip = 'HideRopeLenChangeTip',


    //插头状态更新
    PlugStateUpdate = 'PlugStateUpdate',
    
    // 游戏结束
    GameOver = "GameOver",
    //最终操纵杆展示
    ShowJoyStickFinal = "ShowJoyStickFinal",
}

export enum StateDefine {
    Idle = "kugongnanidel",  //站立
    Run = "kugongnanpao",    // 跑
    Lift = "judongxi",        //举起
    LiftIdle = "judongxiidel",        //举东西待机
    LiftRun = "judongxipao", //举东西跑
    LiftNoPull = "judongxiliangqiang", //举着插头拉不动
    LinkPlug = "judongxijiechazuo",  //连接插座
    
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

export enum CameraState {
    // 正常移动  
    Nomal, 
    // 移动到塔偏移  
    LookTower,
    // 移动到树偏移  
    LookTree,
    //移回初始偏移 
    LookBack
}

export enum GuideType {
    NoGuide, //没引导
    DeliverWood,  // 交付木头
    PickWood,  // 拾取木头
    PlugIn,   // 插插头
    CircleTree,  //圈树
    PickPlug   // 拾取插头
}
