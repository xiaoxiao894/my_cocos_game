import { _decorator, Component, Node, Vec3 } from 'cc';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { PropEnum } from '../../Base/EnumIndex';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import { RotationVector } from '../Rotation/RotationVector';
const { ccclass, property } = _decorator;

@ccclass('Prop')
export class Prop extends UnityUpComponent {

    private _rotatonDrive: RotationVector = null;

    private isRot: boolean = false;

    @property(Node)
    public subNode: Node;

    private get rotationDrive() {
        if (!this._rotatonDrive) {
            this._rotatonDrive = this.getComponent(RotationVector);
        }
        return this._rotatonDrive;
    }

    protected _update(dt: number): void {
        if (this.isRot) {
            this.rotationDrive.rotate(dt);
        }
    }

    public set rotVector(vector: Vec3) {
        if (!vector) {
            this.isRot = false;
        } else {
            this.rotationDrive.setVector(vector);
            this.isRot = true;
        }
    }


    @property({ type: PropEnum })
    public propID: PropEnum = PropEnum.gold;


    public subVisible(visible: boolean) {
        if (this.subNode) {
            this.subNode.active = visible;
        }
    }



    public remove() {
        PoolManager.instance.setPool(PoolEnum.Prop + this.propID, this);
        this.rotVector = null;
        this.node.active = false;
    }


}


