import { _decorator, Animation } from 'cc';
import Entity, { CharacterType } from './Entity';

const { ccclass } = _decorator;

@ccclass('EnemyTree')
export class EnemyTree extends Entity {


    //是否是可以被寻找的状态
    isFind: boolean = false;

    dropNum: number = 3;

    type: string = CharacterType.ENEMY_TREE;

    hp: number = 3;

    animationNum: number = null;
    //当前的砍伐次数
    curCutNum: number = 1;
    curCollectNum: number = 0;

    playAnimtion(name?: string) {
        this.node.getComponent(Animation).play(name);
    }

    showArrowTarger() {
        this.node.getChildByName("UI_famuzhiyin").active = true;
    }
    hideArrowTarger() {
        this.node.getChildByName("UI_famuzhiyin").active = false;
    }

    setFindState(isFind: boolean) {
        this.isFind = isFind;
    }
    getFindState() {
        return this.isFind;
    }

    die() {
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 1)

    }
    getDropNum() {
        return this.dropNum;
    }
    // onLoad() {

    // }

    // start() {

    // }


}