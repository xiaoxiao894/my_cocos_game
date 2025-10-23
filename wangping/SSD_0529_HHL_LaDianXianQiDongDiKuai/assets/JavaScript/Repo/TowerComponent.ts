import { _decorator, Component, Label, Node, Sprite, tween, Vec3, Animation, Tween, Quat } from 'cc';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('TowerComponent')
export class TowerComponent extends Component {

    @property(Node)
    upGradeBtn: Node = null;
    @property(Sprite)
    progressBar: Sprite = null;
    @property(Label)
    progressLabel: Label = null;

    @property(Label)
    progressLabelaMax: Label = null;

    @property(Node)
    coinFlyEndNode: Node = null;

    @property(Node)
    upgradeEffectNode: Node = null; //塔升级效果

    @property(Animation)
    EffectNode: Animation = null; //未升级效果

    @property(Animation)
    mapAnimation: Animation = null; //升级动画

    @property(Animation)
    mapParticleAnimation: Animation = null; //升级动画

    @property(Node)
    hand_sprite: Node = null;

    @property(Node)
    endNode: Node = null;

    @property(Node)
    endNode1: Node = null;

    @property(Node)
    upgradeNode: Node = null;

    @property(Node)
    ropeParent: Node = null;

    private animationTime:number = 0.5

    private upgradeAnimationType = 1; // 1 缩放 2 左右旋转抖动 3 

    private upgradeTween: Tween<Node> = null;

    private _rotationProgress: number = 0;
    private _rotateSpeed: number = 90; // 每秒旋转角度



    private _nowNum: number = 0;
    private _updateNum: boolean = false;
    private _delayTime: number = 0.5;
    private _timeCount: number = 0;

    private isOkUp = false;

    protected onEnable(): void {
        EventManager.inst.on(EventName.GiveTowerCoin, this.onGiveTowerCoin, this);
        EventManager.inst.on(EventName.TowerUpgradeButtonShow, this.showProgress, this);
        EventManager.inst.on(EventName.coinNumUpLimit, this.coinNumUpLimitCallBack, this);
    }
    coinNumUpLimitCallBack() {
        if(this.isOkUp)return
        this.isOkUp = true;
        this.hand_sprite.active = true;
        this.hand_sprite.getComponent(Animation).play();
       // this.upgradeAnimationType = 2;
       DataManager.Instance.upgradeAnimationType = 2
       
        if (DataManager.Instance.upgradeTween) {
            DataManager.Instance.upgradeTween.stop();  // 停止动画
            DataManager.Instance.upgradeTween = null;  // 释放引用，方便GC回收
        }
        // this.scheduleOnce(() => {

        // }, 0.2)

        // tween(this.hand_sprite)
        //     .repeatForever(
        //         tween()
        //             .to(0.3, { position: new Vec3(-1.953, 21.117, 4.964) })  // 修改 pos 为 position
        //             .to(0.3, { position: new Vec3(-1.953, 21.117, 3.964) })  // 修改 pos 为 position
        //             .to(0.3, { scale: new Vec3(0.01, 0.01, 0.01) })
        //             .to(0.3, { scale: new Vec3(0.012, 0.012, 0.012) })

        //     )
        //     .start();
        if (DataManager.Instance.upgradeAnimationType == 2) {
            DataManager.Instance.upgradeTween = tween(this.upgradeNode)
                .to(0.25, { eulerAngles: new Vec3(0, 15, 0) }, { easing: "linear" })  // 绕Y轴向右旋转15度
                .to(0.5, { eulerAngles: new Vec3(0, -15, 0) }, { easing: "linear" })  // 绕Y轴向左旋转15度
                .to(0.25, { eulerAngles: new Vec3(0, 0, 0) }, { easing: "linear" })  // 回到初始角度
                .union()
                .repeatForever()
                .start();
        }

        // let rotateAxis: Vec3 = new Vec3(0, 1, 0); // 默认绕Y轴旋转
        // let _rotationProgress: number = 0; // 当前旋转角度（度）
        // // 创建旋转四元数
        // const rotationQuat = new Quat();

        // Quat.fromEuler(rotationQuat,
        //     rotateAxis.x * _rotationProgress,
        //     rotateAxis.y * _rotationProgress,
        //     rotateAxis.z * _rotationProgress
        // );

        // // 应用旋转
        // this.node.setRotation(rotationQuat);
    }
    protected onDisable(): void {
        EventManager.inst.on(EventName.GiveTowerCoin, this.onGiveTowerCoin, this);
        EventManager.inst.off(EventName.TowerUpgradeButtonShow, this.showProgress, this);
    }

    start() {
        DataManager.Instance.upgradeNode = this.upgradeNode
        this.hand_sprite.active = false;
        if (DataManager.Instance.upgradeAnimationType == 1) {
            DataManager.Instance.upgradeTween = tween(this.upgradeNode)
                .to(this.animationTime, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: "quadOut" })
                .to(this.animationTime, { scale: new Vec3(1, 1, 1) }, { easing: "quadIn" })
                .union()
                .repeatForever()
                .start()

        }

        this.updateProgress();
        //this.upGradeBtn.active = false;
        DataManager.Instance.coinEndNode = this.coinFlyEndNode;
    }

    private addTime: number = 0;
    update(deltaTime: number) {
        // if (this.upgradeAnimationType == 2) {
        //     // 累加旋转角度
        //     this._rotationProgress += this._rotateSpeed * deltaTime;
        //     if (this._rotationProgress >= 360) {
        //         this._rotationProgress -= 360;
        //     }

        //     let rotateAxis: Vec3 = new Vec3(1, 0, 1); // 默认绕Y轴旋转
        //     const rotationQuat = new Quat();

        //     Quat.fromEuler(rotationQuat,
        //         rotateAxis.x * this._rotationProgress,
        //         rotateAxis.y * this._rotationProgress,
        //         rotateAxis.z * this._rotationProgress
        //     );

        //     // 应用旋转
        //     this.upgradeNode.setRotation(rotationQuat);
        // }
        if(DataManager.Instance.coinNum + Number(this.progressLabel.string) >= DataManager.Instance.upgradeCoinNum){
            this.coinNumUpLimitCallBack()
        }

        if (this._updateNum) {
            // this.addTime += deltaTime;
            //if (this.addTime >= 0.02) {
            this.addTime = 0;
            if (this._nowNum < DataManager.Instance.towerCoinNum) {
                this._nowNum += 10;
                this.updateProgress();
               
            } else {
                this._updateNum = false;
          
                if (this._nowNum >= DataManager.Instance.upgradeCoinNum) {
                    //游戏结束
                    this.scheduleOnce(() => {
                        DataManager.Instance.isGameOver = true;
                        EventManager.inst.emit(EventName.GameOver);
                        this.upGradeBtn.active = false;
                        this.upgradeEffect();
                    }, 0.5)

                }
            }
            // }

        }
    }

    private updateProgress() {

        this.progressLabelaMax.string = "/ " + DataManager.Instance.upgradeCoinNum;
        this.progressLabel.string = String(DataManager.Instance.towerCoinNum);
        let need: number = DataManager.Instance.upgradeCoinNum;
        // if(need - this._nowNum < 0){
        //     this._nowNum = need; 
        // }
        // this.progressLabel.string = String(need - this._nowNum);
        this.progressBar.fillRange = this._nowNum / need;


    }

    private onGiveTowerCoin(): void {
        this._updateNum = true;
        this._timeCount = 0;
    }

    private showProgress(): void {
        if (!this.upGradeBtn.active) {
            // this.upGradeBtn.active = true;
            this.upGradeBtn.setScale(0, 0, 0);
            tween(this.upGradeBtn)
                .delay(5)
                .to(0.1, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
                .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
                .start();
        }
    }

    private upgradeEffect(): void {

        this.hand_sprite.active = false;
        this.scheduleOnce(() => {
            if (this.upgradeTween) {
                this.upgradeTween.stop();  // 停止动画
                this.upgradeTween = null;  // 释放引用，方便GC回收
            }
            this.mapAnimation.play();
            // let nodes: Node[] = [];
            // console.log("DataManager.Instance.leftSocket.length == " + DataManager.Instance.leftSocket.length);
            // for (let i = 0; i < DataManager.Instance.leftSocket.length; i++) {

            //     console.log("i == " + i);

            //     console.log("ChaTou == " + DataManager.Instance.leftSocket[i] );
            //     let str = "ChaTou" + (DataManager.Instance.leftSocket[i]) ;
            //      console.log(str );
            //     nodes[i] = this.endNode.getChildByName(str);
            //     console.log(nodes)
            //     nodes[i].active = false;
            // }

            // this.endNode.active = false;
            this.endNode1.active = true;
            this.scheduleOnce(() => {
                EventManager.inst.emit(EventName.ropeMovePoint);
            }, 0.8)
            this.mapAnimation.once(Animation.EventType.FINISHED, () => {
                // for (let i = 0; i < nodes.length; i++) {
                //     // nodes[i] = this.endNode.getChildByName("ChaTou"+DataManager.Instance.leftSocket[i]+1);
                //     nodes[i].active = true;
                // }
                // EventManager.inst.emit(EventName.ropeMovePoint);
                // this.ropeParent.setPosition(this.ropeParent.position.add(new Vec3(0,1,0)));
                // for(let i = 0; i < this.startNodes.length;i++){
                //     this.startNodes[i].active = true;
                // }
                //this.endNode1.active = false;
            }, this);
            //欠塔升级的动画
            this.upGradeBtn.active = false;

            //升级的动画
            this.scheduleOnce(() => {
                this.mapParticleAnimation.node.active = true;
                this.mapParticleAnimation.play();
                this.mapParticleAnimation.once(Animation.EventType.FINISHED, () => {
                    this.mapParticleAnimation.node.active = false;
                }, this);
            }, 0.6)

        }, 0.5)

        // this.scheduleOnce(() => {
        //     this.mapParticleAnimation.node.active = true;
        //     this.mapParticleAnimation.play();
        //     this.mapParticleAnimation.once(Animation.EventType.FINISHED, () => {
        //         this.mapParticleAnimation.node.active = false;
        //     }, this);
        //     this.mapAnimation.play();
        //     //欠塔升级的动画
        //     this.upGradeBtn.active = false;
        //     //升级的动画
        //     //this.scheduleOnce(() => {
        //     this.EffectNode.node.active = false;
        //     this.upgradeEffectNode.active = true;
        //     this.upgradeEffectNode.getComponent(Animation).play();
        //     //}, 1);
        // }, 0.5)

    }

}


