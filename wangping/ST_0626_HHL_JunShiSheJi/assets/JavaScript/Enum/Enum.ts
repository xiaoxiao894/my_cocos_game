export enum PrefabPathEnum {
    Bullet = "Prefab/Bullet",
    Enemy1 = "Prefab/Enemy1",
    Enemy2 = "Prefab/Enemy2",
}

export enum EntityTypeEnum {
    Enemy1 = "Enemy1",
    Enemy2 = "Enemy2",
    Bullet = "Bullet",
}

export enum EnemyState {
    /** 开始 */
    Start,
    /** 走 */
    Walk, 
    /** 准备 */
    Ready, 
    /** 射击 */
    Attack,
    /** 躲避 */
    Escape,
    /** 死亡 */
    Dead
}

/** 事件名称 */
export enum EventName {
    // 游戏结束
    GameOver = "GameOver",
    // 敌人死亡
    EnemyDead = "EnemyDead",
    //展示引导
    ShowGuide = "ShowGuide",
    // 隐藏引导
    HideGuide = "HideGuide",
    // 玩家起来
    PlayerUp = "PlayerUp",
    // 玩家蹲下
    PlayerDown = "PlayerDown",
    //开始触摸
    TouchStart = "TouchStart",
}