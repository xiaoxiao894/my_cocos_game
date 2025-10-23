import { _decorator, Camera, Component, instantiate, Label, Node, Quat, Tween, tween, UITransform, Vec3, view } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('CoinComponent')
export class CoinComponent extends Component {

    @property(Label)
    coinNum: Label = null;

    @property(Node)
    effectNode: Node = null;

    @property(Node)
    coinNode: Node = null;

    @property(Node)
    breathNode: Node = null;


    private isCoinMessagee: boolean = false;

    private _coins: Node[] = [];

    private _upgraded: boolean = false;

    private _breathTween: Tween<Node> | null = null;

    start() {
        this.coinNum.string = "0";
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.TowerUpgradeBtnClick, this.towerUpgrade, this);
        EventManager.inst.on(EventName.CoinAdd, this.coinAdd, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.TowerUpgradeBtnClick, this.towerUpgrade, this);
        EventManager.inst.off(EventName.CoinAdd, this.coinAdd, this);
    }

    private coinAdd() {
        this.updateCoinNum();
        this.playBreathAni();
    }

    private updateCoinNum() {
        if (Number(this.coinNum.string) >= 900) {
            if (this.isCoinMessagee == false) {
                EventManager.inst.emit(EventName.coinNumUpLimit)
                this.isCoinMessagee = true;
            }

        }
        // this.scheduleOnce(() => {

        //  }, 0.3)


        this.coinNum.string = String(DataManager.Instance.coinNum);
    }

    //点击金币
    private towerUpgrade() {
        DataManager.Instance.upgradeAnimationType = 3;
        DataManager.Instance.upgradeTween.stop();
        DataManager.Instance.upgradeNode.rotation = new Quat(0, 0, 0, 1);
        DataManager.Instance.upgradeTween = tween(DataManager.Instance.upgradeNode)
            .to(0.05, { scale: new Vec3(0.95, 0.95, 0.95) }, { easing: "quadOut" })
            .to(0.05, { scale: new Vec3(0.85, 0.85, 0.85) }, { easing: "quadIn" })
            .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: "quadIn" })
            .call(() => {
                DataManager.Instance.upgradeTween = tween(DataManager.Instance.upgradeNode)
                    .to(0.5, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: "quadOut" })
                    .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: "quadIn" })
                    .union()
                    .repeatForever()
                    .start()
            })
            .union()
            .start()
        if (this._upgraded) {
            return;
        }
        if (DataManager.Instance.coinNum <= 0) {
            return;

        }



        //摄像机移动
        tween(DataManager.Instance.mainCamera.node)
            .to(0.8, { worldPosition: new Vec3(0.014142, 34.1, 37.250385) })
            .call(() => {
                this._upgraded = true;
            })
            .start();




    }
    private _remainingCoinBatches: number | undefined = undefined;
    private num = 0;
    private tiem = 0.3;
    private isFrister = false;
    private isFrister1 = false;
    protected update(dt: number): void {

        // 初始化计数器（如果未设置）
        if (this._upgraded && this._remainingCoinBatches === undefined) {
            this._remainingCoinBatches = Math.ceil(DataManager.Instance.coinNum / 10);
            this.num = this._remainingCoinBatches;
            // if(this.num > 50 ){
            //     this.num = 50;
            // }
        }
        if (this.num > 0) {
            this.scheduleOnce(() => {
                DataManager.Instance.soundManager.playResourceSound();
            }, 0.3)
            this.num--;
        }
        if (this._upgraded === true && DataManager.Instance.coinNum > 0 && DataManager.Instance.towerCoinNum < DataManager.Instance.upgradeCoinNum) {
            if (this.isFrister == false && this.isFrister1 == false) {
                this.isFrister = true;
            }
            let startPos: Vec3 = new Vec3(0, 0, 0);
            let endPos: Vec3 = DataManager.Instance.coinEndNode.worldPosition.clone();
            let camera: Camera = DataManager.Instance.mainCamera.camera;
            camera.convertToUINode(endPos, this.node, endPos);

            // 飞钱
            DataManager.Instance.coinNum -= 10;
            let tesTiem = 0.5
            if (DataManager.Instance.coinNum < 100) {
                tesTiem = 0.1
            } else {
                tesTiem = 0.5
            }
            this.updateCoinNum();
            if (this.isFrister == true) {
                this.isFrister = false;
                this.isFrister1 = true;
                this.scheduleOnce(() => {
                    let teim = dt



                    if (DataManager.Instance.coinNum >= 100) {
                        teim = dt

                    } else if (DataManager.Instance.coinNum > 30 && DataManager.Instance.coinNum < 100) {
                        teim = 0.05
                    }
                    else {
                        teim = 0.2
                    }

                    console.log("this._remainingCoinBatches == " + this._remainingCoinBatches)

                    if (DataManager.Instance.upgradeAnimationType == 3) {
                        DataManager.Instance.upgradeTween.stop();
                        DataManager.Instance.upgradeTween = tween(DataManager.Instance.upgradeNode)
                            .to(teim, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: "quadOut" })
                            .to(teim, { scale: new Vec3(1, 1, 1) }, { easing: "quadIn" })
                            .union()
                            .repeatForever()
                            .start()

                    }

                }, tesTiem)

            }

            // 减少剩余批次计数
            if (this._remainingCoinBatches !== undefined) {
                this._remainingCoinBatches--;

            }

            let coinNode: Node = this._coins.pop() || instantiate(this.coinNode);
            coinNode.active = true;
            coinNode.parent = this.effectNode;
            coinNode.setPosition(startPos);
            coinNode.setScale(new Vec3(0.8, 0.8, 1));


            const controlPoint = new Vec3(
                startPos.x - Math.abs(endPos.x - startPos.x) * 0.5,
                (startPos.y + endPos.y) * 0.5 + 100,
                startPos.z
            );

            tween(coinNode).to(0.5, {

                position: endPos,
                scale: new Vec3(0.6, 0.6, 1)
            }, {
                easing: 'cubicOut',
                onUpdate: (target, ratio) => {

                    const t = ratio;
                    const x = (1 - t) * (1 - t) * startPos.x +
                        2 * t * (1 - t) * controlPoint.x +
                        t * t * endPos.x;
                    const y = (1 - t) * (1 - t) * startPos.y +
                        2 * t * (1 - t) * controlPoint.y +
                        t * t * endPos.y;

                    coinNode.position = new Vec3(x, y, startPos.z);
                }
            })
                .call(() => {

                    coinNode.active = false;
                    coinNode.removeFromParent();
                    this._coins.push(coinNode);
                    if (DataManager.Instance.towerCoinNum < DataManager.Instance.upgradeCoinNum) {
                        DataManager.Instance.towerCoinNum += 10;

                        EventManager.inst.emit(EventName.GiveTowerCoin);

                    }

                    // 仅当所有批次都完成且金币处理完毕时才重置_upgraded
                    if (this._remainingCoinBatches !== undefined && this._remainingCoinBatches <= 0 &&
                        DataManager.Instance.coinNum < 10) {
                        this._upgraded = false;
                        this._remainingCoinBatches = undefined; // 重置计数器
                        this.isFrister = false;
                        this.isFrister1 = false;
                        if (this._remainingCoinBatches > 2) {
                            this.tiem = 0.5

                        }
                        else if (this._remainingCoinBatches < 1) {
                            this.tiem = 0.2
                        } else {
                            this.tiem = 0.3
                        }
                        this.scheduleOnce(() => {
                            DataManager.Instance.upgradeAnimationType = 1;
                            DataManager.Instance.upgradeTween.stop();
                            DataManager.Instance.upgradeNode.scale = new Vec3(1, 1, 1);
                            if (DataManager.Instance.upgradeAnimationType == 1) {
                                DataManager.Instance.upgradeTween = tween(DataManager.Instance.upgradeNode)
                                    .to(0.5, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: "quadOut" })
                                    .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: "quadIn" })
                                    .union()
                                    .repeatForever()
                                    .start()

                            }
                        }, this.tiem)


                    }
                }).start();
        }
    }

    // 公用呼吸动画方法（防叠加）
    private playBreathAni() {
        if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画
        }

        const tweenAni = tween(this.breathNode)
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'quadIn' })
            .start();

        this._breathTween = tweenAni;
    }

}


