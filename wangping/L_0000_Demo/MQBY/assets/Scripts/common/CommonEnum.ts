/**
 * 游戏中使用的通用事件类型
 */
export enum CommonEvent{
    /** 相机移动事件 */
    CameraMove = 'camera-move',
    /** 相机移动到指定节点位置 */
    CameraMoveToNode = 'camera-move-to-node',
    /** 相机orthoHeight变化事件 */
    CameraOrthoHeightChange = 'camera-ortho-height-change',
    /** 摇杆输入事件 */
    joystickInput = 'joystick-input',
    /** 英雄移动事件 */
    HerMove = 'hero-move',
    /** 英雄受伤事件 */
    HeroHurt = 'hero-hurt',
    /** 英雄进入家事件 */
    HeroAtHome = 'hero-at-home',
    /** 回收敌人事件 */
    RecycleEnemy = 'recycle-enemy',
    /** 更新英雄物品数量事件 */
    UpdateHeroItemCount = 'update-hero-item-count',
    /** 游戏胜利事件 */
    GameWin = 'game-win',
    /** 游戏失败事件 */
    GameFail = 'game-fail',
    /** 展示胜利UI事件 */
    ShowWinUI = 'show-win-ui',
    /** 展示失败UI事件 */
    ShowFailUI = 'show-fail-ui',
    /** 解锁物品事件 */
    UnlockItem = 'unlock-item',
    /** 解锁完成事件 */
    UnlockFinished = 'unlock-finished',
    /** 设置解锁状态事件 */
    SetUnlockStatue = 'set-unlock-statue',
    /** 更新引导物品位置事件 */
    UpdateGuideItemPosition = 'update-guide-item-position',
    /** 刷新难度事件 */
    RefreshDifficulty = 'refresh-difficulty',
    /** 怪物死亡事件 */
    BossDead = 'boss-dead',
    /** Boss出现事件 */
    BossComming = 'boss-comming',
    /** Boss提前出现事件 */
    BossEarlyComming = 'boss-early-comming',
    /** 波次出现事件 */
    WaveComming = 'wave-comming',
    /** 波次提前出现事件 */
    WaveEarlyComming = 'wave-early-comming',
    /** Boss倒计时更新事件 */
    BossTimerUpdate = 'boss-timer-update',
    /** Boss倒计时结束事件 */
    BossTimerEnd = 'boss-timer-end',
    /** 停止所有敌人生成器 */
    StopAllEnemySpawners = 'stop-all-enemy-spawners',
    /** 家基地生命值变化事件 */
    HomeHealthChanged = 'home-health-changed',
    /** 游戏结束事件 */
    GameOver = 'game-over',
    /** 帧率更新事件 */
    FPSUpdate = 'fps-update',
    /** 选择英雄事件 */
    SelectHero = 'select-hero', 
    /** 显示选择英雄面板事件 */
    ShowSelectHeroPanel = 'show-select-hero-panel',
    /** 结束拾取事件 */
    EndPickOver = 'end-pick-over',
    /** 相机震动事件 */
    ShakeCamera = 'shake-camera',
    /** 拾取金币事件 */
    PickupCoin = "pickup-coin",
    /** 士兵受伤事件 */
    SolderHurt = "solder-hurt",
    /** 出售成功事件 */
    SellSuccess = "sell-success",
    /** 更新提示事件 */
    ShowTips = "show-tips",
    /** 隐藏提示事件 */
    HideTips = "hide-tips",
    /** 更新引导事件 */
    UpdateGuide = "update-guide",
}

/**
 * 角色状态枚举
 */
export enum CharacterState {
    /** 空闲状态 */
    Idle = 'Idle',
    /** 移动状态 */
    Move = 'Move',
    /** 攻击状态 */
    Attack = 'Attack',
    /** 技能状态 */
    Skill = 'Skill',
    /** 死亡状态 */
    Dead = 'Dead'
}

/**
 * 游戏对象类型枚举
 */
export enum ObjectType {
    /** 无类型 */
    None = 'None',
    /** 伤害数字类型 */
    DamageNum = 'DamageNum',
    /** 掉落金币类型 */
    DropItemCoin = 'DropItemCoin',
    // /** 掉落玉米粒类型 */
    // DropItemCornKernel  = 'DropItemCornKernel',
    // /** 掉落玉米汤类型 */
    // DropItemCornSoup = 'DropItemCornSoup',

    /** 掉落物品 棉签 */
    DropItemSwab = 'DropItemSwab',
    /** 掉落物品 爆炸水果 */
    DropItemExplosionFruit = 'DropItemExplosionFruit',
    /** 堆放物品 棉签 */
    StackItemSwab = 'StackItemSwab',
    /** 堆放物品 爆炸水果 */
    StackItemExplosionFruit = 'StackItemExplosionFruit',

    /** 发射子弹 棉签 */
    BulletSwab = 'BulletSwab',
    /** 发射子弹 爆炸水果 */
    BulletExplosionFruit = 'BulletExplosionFruit',
    /** 发射子弹 小石子 */
    BulletSmallStone = 'BulletSmallStone',
}

/**
 * 建筑解锁状态枚举
 */
export enum BuildUnlockState {
    /** 未激活状态 */
    NoActive = 'NoActive',
    /** 已激活状态 */
    Active = 'Active',
    /** 已解锁状态 */
    Unlocked = 'Unlocked'
}

/**
 * 建筑类型枚举
 */
export enum BuildingType {
    /** 无类型 */
    None = 'None',
    /** 棉签防御塔 */
    SwabArcherTower = 'SwabArcherTower',
    /** 棉签堆放区 */
    SwabStack = 'SwabStack',
    /** 棉签搬运工 */
    SwabTransLater = 'SwabTransLater',
    /** 棉签传送带 */
    SwabTransporter = 'SwabTransporter',
    /** 水果炸弹防御塔 */
    ExplosionFruitDefenseTower = 'ExplosionFruitDefenseTower',
    /** 水果炸弹堆放区 */
    ExplosionFruitStack = 'ExplosionFruitStack',
    /** 水果炸弹搬运工 */
    ExplosionFruitTransLater = 'ExplosionFruitTransLater',
    /** 水果炸弹传送带 */
    ExplosionFruitTransporter = 'ExplosionFruitTransporter',
    /** 新区域解锁 */
    NewAreaUnlock = 'NewAreaUnlock',
}

/**
 * 英雄类型枚举
 */
export enum HeroType {
    /** 无类型 */
    None = 'None',
}


/**
 * 特效层级枚举
 */
export enum LayerType {
    /** 地图层级 */
    Map = 1,
    /** 特效层级 */
    Effect = 2
}

/**
 * 特效类型枚举
 */
export enum EffectType {
    /** 无类型 */
    None = 'None',
    /** 英雄攻击特效 */
    Hero_Attack = 'Hero_Attack',
    /** 英雄攻击特效 */
    Hero_Attack1 = 'Hero_Attack1',
    /** Boss攻击特效 */
    Boss_Attack = 'Boss_Attack',
    /** Solder攻击特效 */
    Solder_Attack = 'Solder_Attack',
    /** 英雄升级特效 */
    Hero_Upgrade = 'Hero_Upgrade',
    /** 爆炸特效 */
    Explosion = 'Explosion',
    /** 绿色掉血特效 */
    GreenDamage = 'GreenDamage',
}

/**
 * 颜色效果类型及优先级(数字越大优先级越高)
 */
export enum ColorEffectType {
    NORMAL = 0,     // 正常颜色
    SLOW = 1,       // 减速效果(蓝色)
    HURT = 2        // 受伤效果(红色)
}

/** 
 * 物理组枚举
 */
export enum PHY_GROUP {
    DEFAULT = 1 << 0, // 默认 1
    HERO = 1 << 1, // 英雄 2
    ENEMY = 1 << 2, // 敌人 4
    BULLET = 1 << 3, // 子弹 8
    HOME = 1 << 4, // 家 16
    WALL = 1 << 5, // 墙 32
    GROUND = 1 << 6, // 地面 64
    SOLDER = 1 << 7, // 士兵 128
    BUILDING = 1 << 8, // 建筑 256
};

/**
 * 排序方式枚举
 */
export enum CharacterSortType {
    /** 距离排序 */
    Distance = 'Distance',
    /** 反向距离排序 */
    ReverseDistance = 'ReverseDistance',
    /** 血量排序 */
    HP = 'HP',
    /** Boss精英怪优先排序 */
    BossElite = 'BossElite',
}

/**
 * 游戏结果枚举
 */
export enum GameResult {
    /** 无结果 */
    None = 'None',
    /** 胜利 */
    Win = 'Win',
    /** 失败 */
    Fail = 'Fail',
}

/**
 * 帧事件ID枚举
 */
export enum FrameEventId {
    /** 攻击伤害帧事件 */
    ATTACK_DAMAGE = 'attack_damage',
    /** 攻击音效帧事件 */
    ATTACK_SOUND = 'attack_sound',
    /** 攻击特效帧事件 */
    ATTACK_EFFECT = 'attack_effect',
    /** 移动攻击伤害帧事件 */
    RUN_ATTACK_DAMAGE = 'run_attack_damage',
    /** 移动攻击音效帧事件 */
    RUN_ATTACK_SOUND = 'run_attack_sound',
    /** 技能释放帧事件 */
    SKILL_CAST = 'skill_cast',
    /** 技能音效帧事件 */
    SKILL_SOUND = 'skill_sound',
    /** 技能特效帧事件 */
    SKILL_EFFECT = 'skill_effect',
    /** 死亡音效帧事件 */
    DEATH_SOUND = 'death_sound',
    /** 死亡特效帧事件 */
    DEATH_EFFECT = 'death_effect',
    /** 移动音效帧事件 */
    MOVE_SOUND = 'move_sound',
    /** 受击音效帧事件 */
    HURT_SOUND = 'hurt_sound',
    /** 受击特效帧事件 */
    HURT_EFFECT = 'hurt_effect',
    /** 自定义帧事件1 */
    CUSTOM_1 = 'custom_1',
    /** 自定义帧事件2 */
    CUSTOM_2 = 'custom_2',
    /** 自定义帧事件3 */
    CUSTOM_3 = 'custom_3',
}

