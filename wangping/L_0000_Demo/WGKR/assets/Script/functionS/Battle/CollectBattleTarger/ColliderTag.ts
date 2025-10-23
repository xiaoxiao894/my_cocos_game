import { _decorator, ccenum, Component } from "cc";

export enum COLLIDE_TYPE {
    HERO = 10,
    WALL,
    SHOP,
    MONSTER,
    BAG,
    MOONWALK,
    TOWER,
    SPACECRAFT,
    PLAYERATTACK,
}
ccenum(COLLIDE_TYPE)

const { ccclass, property } = _decorator;

/**
 * 战斗目标 收集器  
 */
@ccclass('ColliderTag')
export default class ColliderTag extends Component {
    @property({ type: COLLIDE_TYPE })
    public tag: COLLIDE_TYPE = COLLIDE_TYPE.HERO;
}