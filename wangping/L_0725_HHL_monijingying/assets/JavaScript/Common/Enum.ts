export enum PrefabPathEnum {
    /** 引导线 */
    PathArrow = "Prefab/PathArrow",
    /** 金币 */
    Coin = "Prefab/item/Coin",
    /** 玉米 */
    Corn = "Prefab/item/Corn",
    /** 伙伴 */
    Partner = "Prefab/Partner",
    /** 血条 */
    HP = "Prefab/HP",
    /** 怪 */
    Monster = "Prefab/Monster",
    /** 子弹 */
    Bullet1 = "Prefab/Bullet1",
    Bullet2 = "Prefab/Bullet2",

    // 炮塔攻击
    TX_fashe= "Prefab/TX/TX_fashe",
    // 炮塔攻击
    TX_jizhong_10= "Prefab/TX/TX_jizhong_10",
    // 炮塔攻击2
    TX_jizhong_11= "Prefab/TX/TX_jizhong_11",
    // ArrowTX= "Prefab/TX/TX_jizhong_08",
    // BeetleCollideTx= "Prefab/TX/TX_jizhong_12",
}

export enum EntityTypeEnum {
    NONE = "",
    /** 小箭头 */
    PathArrow = "PathArrow",
    /** 金币 */
    Coin = "Coin",
    /** 草片 */
    Grass = "Grass",
    /** 玉米粒 */
    Corn = "Corn",
    /** 大玉米 物理节点 */
    BigCorn = "BigCorn",
    /** 玩家 */
    Player = "Player",
    /** 伙伴 */
    Partner = "Partner",
    /** 伙伴需要玉米 */
    partnerNeedCorn = "partnerNeedCorn",
    //地上堆放的玉米
    groundCornArea = "groundCornArea",
    //地上堆放的草片
    groundGrassArea = "groundGrassArea",
    //解锁割草机地块
    UnlockLawnMowerArea = "UnlockLawnMowerArea",
    //割草机启动地块
    LawnMowerStartArea = "LawnMowerStartArea",
    /** 血条 */
    HP = "HP",
    /**怪 */
    Monster = "Monster",
    /** 攻击墙 */
    AttackWall = "AttackWall",
    /** 子弹 */
    Bullet1 = "Bullet1",
    Bullet2 = "Bullet2",
    //炮塔
    Turret = "Turret",
    // 炮塔攻击
    TX_fashe= "TX_fashe",
    // 炮塔攻击
    TX_jizhong_10= "TX_jizhong_10",
    // 炮塔二级
    TX_jizhong_11= "TX_jizhong_11",
    // ArrowTX= "TX_jizhong_08",
    // BeetleCollideTx= "TX_jizhong_12",
}

/** 摄像机状态 */
export enum CameraState {
    // 正常移动  
    Nomal,
    // 移动到怪偏移  
    LookMonster,
    //移回初始偏移 
    LookBack
}

/**
 *   角色状态
 */
export enum PlayerState {
    Idle = "Idle_M",    // 待机
    Move = "run_M",    // 移动
    MoveAttack = "Run+Attack_zy",  //移动攻击
    Attack = "Attack_zy",    // 静止攻击
}

/** 伙伴状态 */
export enum PartnerState {
    Idle = "JZ_idle",    // 待机
    Move = "JZ_run",    // 移动
    Attack = "JZ_attack",    // 攻击
    Hunger = "JZ_hunger",    // 饿死
    Cheer = "JZ_cheer",    // 欢呼
}

export enum EmojiType{
    /** 饥饿 */
    Hungry,
    /** 开心 */
    Happy,
    /** 惊讶 */
    Surprise,
    /** 生气 */
    Anger,
    /** 欢呼 */
    Cheer
}

/**
 *   敌人状态用类型限时状态
 *   没有太复杂逻辑 在本类做处理即可
 */
export enum EnemyStateType {
    Move = "walk_f_1",    // 移动
    Attack = "attack01_1",    // 攻击
    Die = "die_1" //死亡
}


export enum GuideType {
    NoGuide, //没引导
    UpgradeTurret,  // 升级炮塔
    UnlockTurret,  //解锁炮塔
    UnlockWall,  // 解锁墙
    PickGrass,  // 拾取草
    DeliverCoin,  // 交付金币
    UnlockLawnMower,  // 解锁割草机
    PickCoin,  // 拾取金币
    AttackMonster,  // 攻击怪物
    UnlockPartner,  // 解锁伙伴
    PickCorn,  // 拾取玉米粒
    AttackCorn,  // 攻击玉米
    PickStartCorn,  // 拾取起始玉米
}


/** 事件名称 */
export enum EventName {

    //引导位置变化
    ArrowTargetVectorUpdate = 'ArrowTargetVectorUpdate',
    //箭头路径创建
    ArrowPathCreate = 'ArrowPathCreate',
    // 箭头路径消除
    ArrowPathRemove = 'ArrowPathRemove',
    // 开始触摸屏幕
    TouchScreenStart = 'TouchScreenStart',
    // 结束触摸屏幕
    TouchScreenEnd = 'TouchScreenEnd',
    //出现怪
    ShowMonster = 'ShowMonster',
    //第一个怪死亡
    FirstMonsterDie = 'FirstMonsterDie',
    /** 解锁第一个伙伴 */
    UnlockFirstPartner = 'UnlockFirstPartner',
    /** rvo移动 */
    MoveByRVO = "MoveByRVO",
    //交付金币解锁割草机
    DeliverCoinUnlockLawnMower = "DeliverCoinUnlockLawnMower",
    //割草机解锁
    UnlockLawnMower = "UnlockLawnMower",
    //游戏结束
    GameOver = "GameOver",
    //重新寻路
    ReFindPath = "ReFindPath",
    //所有墙解锁
    AllWallUnlock = "AllWallUnlock",
    //显示墙解锁地贴
    ShowWallArea = "ShowWallArea",
    //炮塔数据变化
    TurretDataUpdate = "TurretDataUpdate",
    //停止攻击特效
    StopAttackEffect = "StopAttackEffect",
}