import { _decorator, CCBoolean, ccenum, CCFloat, CCInteger, Component, Node, NodeSpace, UITransform, v3, Vec3 } from 'cc';
import LayerManager, { SceneType } from './LayerManager';
import RockerManager from '../functionS/Rocker/RockerManager';
import { vectorMoveSpeed, vectorPower, vectorPower2 } from '../Tool/Index';
import { RotationDrive } from '../functionS/Rotation/RotationDrive';
import { UnityUpComponent } from './UnityUpComponent';
const { ccclass, property } = _decorator;
export enum MoveModEnum {
    RockerMove,
    PosMove,
    vectorMove,
    targetMove,
    aStar,
    forwardMove,
}
ccenum(MoveModEnum)

@ccclass('MoveDrive')
export class MoveDrive extends UnityUpComponent {

    @property({ type: MoveModEnum })
    public moveMod: MoveModEnum = MoveModEnum.PosMove;

    @property(CCInteger)
    public speed = 200;

    public sceneType: SceneType = SceneType.D2;
    @property({
        visible(this: MoveDrive) {
            return this.moveMod == MoveModEnum.vectorMove;
        }
    })
    public vector: Vec3 = v3();



    private rotationV3: Vec3 = new Vec3();

    @property(Vec3)
    private _pos: Vec3 = new Vec3();
    @property({
        visible(this: MoveDrive) {
            return this.moveMod == MoveModEnum.PosMove;
        }
    })
    public set pos(pos: Vec3) {
        this._pos.set(pos);
        this._isPos = false;
    }
    public get pos() {
        return this._pos;
    }
    private _isPos: boolean = false;

    @property({
        type: Node, visible(this: MoveDrive) {
            return this.moveMod == MoveModEnum.targetMove;
        }
    })
    public target: Node;

    private _faceVector: number = 0;

    private _isMove: boolean = false;

    private tran: UITransform;


    public path: Vec3[];


    @property(CCBoolean)
    public autoMove: boolean = false;

    @property(CCBoolean)
    public isRot: boolean = false;
    @property({
        type: RotationDrive, visible(this: MoveDrive) {
            return this.isRot;
        }
    })
    public rotDrive: RotationDrive;

    public static isMoveOk: boolean = true;

    @property({
        type: CCFloat, visible(this: MoveDrive) {
            return this.moveMod != MoveModEnum.RockerMove;
        }
    })
    public dis: number = 64;
    protected onLoad(): void {
        this.sceneType = LayerManager.instance.SceneType;
        // if (this.sceneType == SceneType.D2) {
        //     this.dis = 16;
        // } else {
        //     this.dis = 0.2;
        // }
    }

    protected start(): void {
        this.tran = this.node.getComponent(UITransform);
    }


    private _moonWalkOff: boolean = false;

    public get moonWalkOff() {
        return this._moonWalkOff;
    }
    public set moonWalkOff(value: boolean) {
        this._moonWalkOff = value;
        // if (value) {

        //     if (RockerManager.instance.isMove) {
        //         let rocker = RockerManager.instance.rockerDirection;
        //         this._moonwalk.set(rocker.x, 0, rocker.y);
        //     }
        // } else {
        //     this._moonwalk.set(0, 0, 0);
        // }
    }

    private _moonwalk: Vec3 = new Vec3(0, 0, 0);

    protected onEnable(): void {
        this.init();
    }

    public init() {
        this._isMove = false;
        this._isPos = true;
    }


    protected _update(dt: number): void {
        if (this.autoMove) {
            this.MoveEvent(dt);
        }
    }

    /**需要自己去调用 */
    public MoveEvent(deltaTime: number) {
        if (!MoveDrive.isMoveOk) {
            return;
        }
        switch (this.moveMod) {
            case MoveModEnum.RockerMove: {
                // if (this._moonWalkOff) {
                //     this.moonWalkMove(deltaTime);
                // } else {
                this.rockerMove(deltaTime);
                // }
                break;
            }
            case MoveModEnum.PosMove: {
                if (!this._isPos) {

                    this.PosMove(deltaTime);
                }
                break;
            }
            case MoveModEnum.vectorMove: {
                this.vectroMove(this.vector, deltaTime);
                break;
            }
            case MoveModEnum.targetMove: {
                this.targetMove(deltaTime);
                break;
            }
            case MoveModEnum.aStar: {
                this.aStarMove(deltaTime);
                break;
            }
            case MoveModEnum.forwardMove: {
                this.forwardMove(deltaTime);
            }
        }
    }

    private rockerMove(dt: number) {
        if (RockerManager.instance.isMove) {
            let rocker = RockerManager.instance.rockerDirection;
            this.V2Move(rocker.x, rocker.y, dt);
        } else {
            this._isMove = false;
        }
    }

    private PosMove(dt: number) {
        let vector = vectorMoveSpeed(this.node.worldPosition, this._pos);
        let dis = Vec3.distance(this.node.worldPosition, this._pos);
        if (dis < this.dis) {
            this._isPos = true;
            this._isMove = false;
            this.triggerCall();
        } else {
            this.vectroMove(vector, dt);
        }
    }
    private moonWalkMove(dt: number) {
        if (RockerManager.instance.isMove) {
            let rocker = RockerManager.instance.rockerDirection;
            let x = (rocker.x - this._moonwalk.x) * 0.025;
            let y = (rocker.y - this._moonwalk.z) * 0.025;
            this._moonwalk.set(this._moonwalk.x + x, 0, this._moonwalk.z + y);
            this.V2Move(this._moonwalk.x, this._moonwalk.z, dt);

        } else if (this._moonwalk != Vec3.ZERO) {
            this._moonwalk.x -= this._moonwalk.x * 0.025;
            this._moonwalk.z -= this._moonwalk.z * 0.025;
            if (Math.abs(this._moonwalk.x) < 0.01) {
                this._moonwalk.x = 0;
            }
            if (Math.abs(this._moonwalk.z) < 0.01) {
                this._moonwalk.z = 0;
            }
            if (this._moonwalk.x == 0 && this._moonwalk.z == 0) {
                this._isMove = false;
            } else {
                this.V2Move(this._moonwalk.x, this._moonwalk.z, dt);
            }
        } else {
            this._isMove = false;
        }
    }



    private targetMove(dt: number) {
        if (this.target == null) {
            this._isMove = false;
        } else {
            let dis = Vec3.distance(this.node.worldPosition, this.target.worldPosition);
            if (dis < this.dis) {
                this._isMove = false;
            } else {
                let vector = vectorPower(this.node, this.target);
                this.vectroMove(vector, dt);
            }
        }
    }


    private V2Move(x: number, y: number, dt: number) {
        let pos = this.node.position;
        let sp = this.speed * dt;
        if (this.sceneType == SceneType.D2) {
            this._faceVector = x / Math.abs(x);
            this.node.setPosition(pos.x + x * sp, pos.y + y * sp);
            this.tran.priority = -this.node.position.y;
        } else {
            this._faceVector = -x / Math.abs(x);
            if (this.tran) {
                this.tran.priority = -this.node.position.z;
            }
            this.node.setPosition(pos.x - x * sp, this.node.y, pos.z + y * sp);
            if (this.isRot && this.rotDrive) {
                this.rotationV3.set(-x, 0, y);
                this.rotDrive.vector = this.rotationV3;
                this.rotDrive.rotatLerpLookVector(dt);
            }
        }
        this._isMove = true;
    }



    private vectroMove(vector: Vec3, dt: number) {
        let pos = this.node.position;
        let sp = this.speed * dt;
        if (this.sceneType == SceneType.D2) {
            this._faceVector = vector.x / Math.abs(vector.x);
            this.node.setPosition(pos.x + vector.x * sp, pos.y + vector.y * sp);
            this.tran.priority = -this.node.position.y;
        } else {
            this._faceVector = -vector.x / Math.abs(vector.x);
            if (this.tran) {
                this.tran.priority = -this.node.position.z;
            }
            this.node.setPosition(pos.x + vector.x * sp, pos.y + vector.y * sp, pos.z + vector.z * sp);
            if (this.isRot && this.rotDrive) {
                this.rotDrive.vector = vector;
                this.rotDrive.rotatLerpLookVector(dt);
            }
        }
        this._isMove = true;
    }


    private aStarMove(deltaTime: number): void {
        if (!this.path) {
            this._isMove = true;
            return;
        }
        let currentNode: Vec3 = this.path[0];
        let vector = vectorPower2(currentNode, this.node.worldPosition)
        this.vectroMove(vector, deltaTime);
        // 检查是否到达下一个节点
        let dis = Vec3.distance(this.node.worldPosition, currentNode);
        if (dis < this.dis) { // 没有到达下一个节点
            this.path.splice(0, 1);
            if (!this.path.length) {
                this.path = null;
            }
        }

    }


    private forwardMove(dt: number) {
        let vector = this.node.forward;
        Vec3.multiplyScalar(this.vector, vector, this.speed * dt);
        this.node.translate(this.vector, NodeSpace.WORLD);

    }


    public get faceVector() {
        return this._faceVector;
    }

    public get isMove() {
        return this._isMove;
    }


    public get isPos() {
        return this._isPos;
    }


    private _call: Function;
    private _xany: any;

    public setMoveOverCall(call: Function, xany: any) {
        this._call = call;
        this._xany = xany;
    }


    private triggerCall() {
        this._call && this._call.apply(this._xany);
        this._call = null;
        this._xany = null;
    }
}


