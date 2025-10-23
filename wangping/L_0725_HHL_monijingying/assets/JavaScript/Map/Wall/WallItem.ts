import { _decorator, Animation, CCInteger, Color, Component, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { DataManager } from '../../Global/DataManager';
import { EventName } from '../../Common/Enum';
import RVOObstacles from '../../RVO/RVOObstacles';
import { Simulator } from '../../RVO/Simulator';
import { SoundManager } from '../../Global/SoundManager';
import JPSController from '../../JPS/JPSController';
import { EventManager } from '../../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('WallItem')
export class WallItem extends Component {

    @property(Sprite)
    green:Sprite = null;
    @property(Node)
    coinIconNode: Node = null;

    @property(Label)
    numberLabel: Label = null;

    @property(CCInteger)
    needNum:number = 0;

    @property(Node)
    landNode:Node = null;

    @property(Node)
    wallNode:Node = null;

    @property(Node)
    doorNode:Node = null;

    @property(Node)
    wallObstacleNode:Node = null;

    @property(Node)
    wallPhysicsNode1:Node = null;

    @property(Node)
    wallPhysicsNode2:Node = null;

    @property(Node)
    deliverPosNode:Node = null;

    @property(Node)
    wallAniNode:Node = null;

    private _originalScale: Vec3 = null; // ✅ 添加：记录原始 scale
    private _leftNum:number = 0;

    start() {
        this._originalScale = this.coinIconNode.scale.clone();
        this._leftNum = this.needNum;
        this.numberLabel.string = this._leftNum.toString();
        this.green.fillRange = 0;
        this.wallNode.active = false;
        if(this.doorNode){
            this.doorNode.active = false;
        }
        this.wallAniNode.active = false;
    }

     stopBreathingAnimation() {

        // ✅ 停止时强制还原原始缩放
        this.coinIconNode.setScale(this._originalScale);
    }

    private playScaleOnce() {
        this.stopBreathingAnimation();

        const largerScale = new Vec3(
            this._originalScale.x * 1.1,
            this._originalScale.y * 1.1,
            this._originalScale.z * 1.1
        );
        tween(this.coinIconNode)
            .to(0.1, { scale: largerScale }, { easing: 'quadOut' })
            .to(0.1, { scale: this._originalScale }, { easing: 'quadIn' })
            .call(() => {
            })
            .start();
    }

    // 气泡减少数量
    public reduceNumber() {
        this._leftNum--;
        this.numberLabel.string = this._leftNum.toString();
        this.green.fillRange = (this.needNum-this._leftNum) / this.needNum;
        if (this._leftNum <= 0) {
            this.unlockWall();
        }
        this.playScaleOnce();
    }
    
    public getNeedNum():number{
        return this._leftNum;
    }

    //解锁
    private unlockWall(){
        this.landNode.active = false;
        this.wallNode.active = true;
        if(this.doorNode){
            this.doorNode.active = true;
        }
        if(DataManager.Instance.wallController.isWallAllUnlocked()){
            EventManager.inst.emit(EventName.AllWallUnlock);
        }

        //添加静态障碍物
        this.scheduleOnce(()=>{
            if(this.wallObstacleNode){
                RVOObstacles.addOneObstacle(this.wallObstacleNode);
            }
            if(this.wallPhysicsNode1){
                JPSController.instance.addOneObstacle(this.wallPhysicsNode1);
            }
            if(this.wallPhysicsNode2){
                JPSController.instance.addOneObstacle(this.wallPhysicsNode2);
            }
            Simulator.instance.processObstacles();
        },0.5);
        

        //动画
        this.wallNode.getComponent(Animation)?.play();
        SoundManager.inst.playAudio("jiesuo");
        this.wallAniNode.active = true;
    }
}


