/**存放所有的事件枚举值
 * 每个枚举需指定起始的Index,防止冲突
*/
// export namespace EventTypes {


// }
export enum GameEvent {
    Index = 0,
    GameInit,
    GameEnd,
    GamePause,

    ShopBagEnd,
    OpenChooseHero,
    CloseChooseHero,

    ShowTip,
    goldUp,
}

export enum UnitEvent {
    Index = 100,
    CreateBullet,
    CreateSkillEffect,

    CreateBoss,
    BossDie,

    CreateAiSolider,

    WallBroken,

}