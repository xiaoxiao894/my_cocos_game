import { _decorator, Component, Material, MeshRenderer, Node, SkeletalAnimation, Sprite, Tween, tween, Vec3 } from 'cc';
import { DataManager } from '../../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('PeopleItem')
export class PeopleItem extends Component {

    @property(Node)
    bubbleNode: Node = null;

    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(Node)
    smileNode: Node = null;

    @property(Material)
    mtls: Material[] = [];

    @property(MeshRenderer)
    skin: MeshRenderer = null;

    @property(Sprite)
    green: Sprite = null;

    private _rangeMax: number = 5;
    private _rangeNow: number = 0;

    private _breathTween:Tween<Node> | null = null;
    
    onEnable() {
        this.ani.node.eulerAngles = new Vec3(0, -90, 0);
        this.ani.play("walk");
        this.bubbleNode.active = false;
        this.smileNode.active = false;
        let rand: number = Math.floor(Math.random() * 3);

        this.skin.setMaterial(this.mtls[DataManager.Instance.randomSeed[DataManager.Instance.mtlCount]], 0);
        this.green.fillRange = 0;
        this._rangeNow = 0;
        this._fillNum = 0;
        DataManager.Instance.mtlCount++;
        if (DataManager.Instance.mtlCount >= 4) {
            DataManager.Instance.mtlCount = 0;
        }

    }

    

    //准备接收
    public readyRecieve(): void {
        //转向、tip
        tween(this.ani.node).to(0.3, {
            eulerAngles: new Vec3(0, -180, 0),
            position: new Vec3(0, 0, -2)
        }).call(() => {
            this.bubbleNode.active = true;
            this.ani.play("idle");
        }).start();
    }

    public startWalk() {
        this.ani.play("walk");
    }

    public recieveOver(): void {
        this.bubbleNode.active = false;
    }

    public readyLeave(): void {
        //变成笑脸 播放talk动画 转身播walk动画
        this.ani.play("talk");
        this.smileNode.active = true;
        this.bubbleNode.active = false;
        setTimeout(() => {
            tween(this.ani.node).to(0.1, {
                eulerAngles: new Vec3(0, -90, 0),
                position: new Vec3(0, 0, 0)
            }).call(() => {
                this.ani.play("walk");
            }).start();
        }, 500);

    }

    public walkEnd() {
        this.ani.play("idle");
    }

    public getRealWorldPos(): Vec3 {
        return this.bubbleNode.getWorldPosition().clone();
    }

    private _fillNum:number = 0;
    private _fillInterval:number =0.06;
    private _fillTimer:number = 0;
    public addMedicine() {
        this._rangeNow++;
        if (this._rangeNow > this._rangeMax) {
            this._rangeNow = 0;
        }
        
        //缩放 反馈
        this.playBreathAni();
    }

    update(dt: number) {
        this._fillTimer += dt;
        if (this._fillTimer >= this._fillInterval&&this._fillNum<this._rangeNow) {
            this._fillNum++;
            this.green.fillRange = this._fillNum / this._rangeMax;
            this._fillTimer = 0;
        }
    }

    // 公用呼吸动画方法（防叠加）
    private playBreathAni() {
        if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画
        }

        const tweenAni = tween(this.bubbleNode)
            .to(0.08, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .start();

        this._breathTween = tweenAni;
    }


}


