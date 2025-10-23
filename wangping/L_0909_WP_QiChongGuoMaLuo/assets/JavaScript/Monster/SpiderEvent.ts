import { _decorator, Component, Node } from 'cc';
import { ItemMonsterManager } from './ItemMonsterManager';
const { ccclass, property } = _decorator;

@ccclass('SpiderEvent')
export class SpiderEvent extends Component {
    start() {

    }


    attack() {
        const itemMonsterManager = this.node?.parent?.parent.getComponent(ItemMonsterManager);
        if (itemMonsterManager) {
            itemMonsterManager.attack();
        }
    }

    update(deltaTime: number) {

    }
}


