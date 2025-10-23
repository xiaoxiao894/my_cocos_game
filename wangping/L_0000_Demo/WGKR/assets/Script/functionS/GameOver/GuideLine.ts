import { _decorator, Component, Line, Node, v2, v3, v4, Vec3 } from 'cc';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
const { ccclass, property } = _decorator;

@ccclass('GuideLine')
export class GuideLine extends UnityUpComponent {

    public static instance: GuideLine;


    private line: Line;
    private moHandle: number;
    private _startNode: Node;
    private _endNode: Node;

    private temp1: Vec3 = v3();
    private temp2: Vec3 = v3();


    protected onLoad(): void {
        GuideLine.instance = this;
        this.line = this.getComponent(Line);
        this.node.active = false;
        this.moHandle = this.line.material.passes[0].getHandle("mainTiling_Offset");
    }


    public setLineNode(start?: Node, end?: Node) {
        this._startNode = start;
        this._endNode = end;
        if (!start) {
            this.node.active = false;
        } else {
            this.node.active = true;
        }
    }

    protected _update(dt: number): void {
        if (this._startNode) {
            let startPos = this._startNode.worldPosition;
            let endPos = this._endNode.worldPosition;
            this.temp1.set(startPos);
            this.temp1.y += 0.5;
            this.temp2.set(endPos);
            this.temp2.y += 0.1;
            let dis = Vec3.distance(startPos, endPos);
            // let count = Math.ceil(dis);
            this.line.material.passes[0].setUniform(this.moHandle, v4(dis, 1, 0, 0));
            this.line.positions = [this.temp1, this.temp2];
            if (dis <= 2.5) {
                this.setLineNode();
            }
        }
    }







}


