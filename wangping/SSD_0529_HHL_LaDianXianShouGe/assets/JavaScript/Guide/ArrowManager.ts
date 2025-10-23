import { _decorator, Component, instantiate, math, Node, Quat, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { EventManager } from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ArrowManager')
export class ArrowManager extends Component {

    @property(Node)
    target: Node = null;

    @property
    spacing: number = 2.0;

    arrowNodes: Node[] = [];

    private _targetPos:Vec3;

    start() {

    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ArrowPathCreate,this.createArrowPathTo,this);
        EventManager.inst.on(EventName.ArrowPathRemove,this.removeTargetPos,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ArrowPathCreate,this.createArrowPathTo,this);
        EventManager.inst.on(EventName.ArrowPathRemove,this.removeTargetPos,this);
    }

    update(deltaTime: number) {
        if(this._targetPos){
            this.createArrowPathTo(this._targetPos);
        }

    }

    public createArrowPathTo(targetPos: Vec3) {
        if(!targetPos){
            return;
        }
        this._targetPos = targetPos;

        const player = DataManager.Instance.player;
        if (!player) return;

        let start = player.worldPosition.clone();
        start.y = 1.6;
        const dir = new Vec3();
        Vec3.subtract(dir, targetPos, start);
        const totalLength = dir.length();

        if (totalLength < 0.01) {
            this.setArrowCount(0);
            return;
        }

        const count = Math.floor(totalLength / this.spacing);
        this.setArrowCount(count);

        dir.normalize();

        for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            const pos = new Vec3();
            Vec3.scaleAndAdd(pos, start, dir, this.spacing * (i + 1)); // 避免从脚下起始
            arrow.setWorldPosition(pos);

            const rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
        }
    }

    setArrowCount(targetCount: number = 0) {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.PathArrow);
        if (!prefab) return;

        while (this.arrowNodes.length < targetCount) {
            const arrow = instantiate(prefab);
            arrow.setParent(this.node);
            this.arrowNodes.push(arrow);
        }

        while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop()!;
            arrow.destroy();
        }
    }

    private removeTargetPos(){
        this._targetPos = null;
        this.setArrowCount(0);
    }

}

