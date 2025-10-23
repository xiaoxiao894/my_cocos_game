import { _decorator, Component, Node } from 'cc';
import { MonsterItem } from './MonsterItem';
const { ccclass, property } = _decorator;

@ccclass('AttackEventManager')
export class AttackEventManager extends Component {
    start() {

    }

    attack() {
        let monsterItem = this.node.parent.parent.getComponent(MonsterItem);
        if (!monsterItem) {
            monsterItem = this.node.parent.getComponent(MonsterItem);
        }
        if (!monsterItem) return;

        monsterItem.attack();
    }

    update(deltaTime: number) {

    }
}


