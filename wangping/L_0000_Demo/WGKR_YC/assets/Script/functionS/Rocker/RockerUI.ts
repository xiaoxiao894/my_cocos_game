import { _decorator, Component, Event, EventTouch, log, Node, Sprite, UITransform, Vec2 } from 'cc';
import RockerManager from './RockerManager';
const { ccclass, property } = _decorator;

@ccclass('RockerUI')
export class RockerUI extends Component {

    public r_node: Node;
    private _tran: UITransform;
    start() {
        this._tran = this.node.getComponent(UITransform);
        this.enabled = false;
    }

    public get tran() {
        if (this._tran == null) {
            this._tran = this.node.getComponent(UITransform);
        }
        return this._tran;
    }

    public set pos(v2: Vec2) {
        this.node.setPosition(v2.x, v2.y, 0);
    }

    public set rPos(v2: Vec2) {
        if (!this.r_node) {
            this.r_node = this.node.getChildByName("Rocker_");
        }
        this.r_node.setPosition(v2.x, v2.y, 0);
    }

}


