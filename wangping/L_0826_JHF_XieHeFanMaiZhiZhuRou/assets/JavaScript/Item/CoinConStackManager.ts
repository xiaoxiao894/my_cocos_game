import { _decorator, Component, Node } from 'cc';
import { StackManager } from '../StackSlot/StackManager';
const { ccclass, property } = _decorator;

@ccclass('CoinConStackManager')
export class CoinConStackManager extends Component {
    start() {
        const row = 2;
        const col = 2;
        const gapX = 2.1;
        const gapZ = 2.1;
        const gapY = 0.5;
        const maxLayer = 20000;

        if (this.node && !this.node["__stackManager"]) {
            this.node["__stackManager"] = new StackManager(row, col, gapX, gapZ, gapY, maxLayer);
        }
    }

    update(deltaTime: number) {

    }
}


