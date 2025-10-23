import { _decorator, Animation, BoxCollider, Collider, Component, find, ICollisionEvent, ITriggerEvent, Mat4, Node, Quat, RigidBody, tween, v3, Vec3 } from 'cc';
import Entity from './Entity';
import { VirtualInput } from '../UI/VirtuallInput';
import { PlayerTrigger } from './PlayerTrigger';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { EventManager } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Entity {

    @property(Animation)
    attackAni: Animation = null;

    entityName: string = GlobeVariable.entifyName.player;

    // 移动速度
    moveSpeed = 18;
    // 旋转平滑系数
    private rotateSpeed = 14.0;

    attack: number = 1;

    //初始给的金币数量
    public coinNum = GlobeVariable.coinStartNum;

    private backpack: Node = null;

    //碰撞触发事件管理
    private triggerNode: PlayerTrigger = new PlayerTrigger();

    // 新增：保存金币动画的引用，用于取消
    private coinTween: any = null;

    subtractCoin(num: number) {
        this.coinNum -= num;
        EventManager.instance.emit(EventType.CoinSub, num);
        this.calibrateCoinsPosition()
    }

    onLoad(): void {
        super.onLoad();
        this.backpack = this.node.getChildByName("backpack");
    }

    // 新增：节点销毁时停止所有动画
    onDestroy() {
        if (this.coinTween) {
            this.coinTween.stop();
        }
    }

    protected start(): void {
        this.triggerNode.initTrigger(this);
    }

    jumpAni(){
        console.log('jumpAni 11111111');
        this.characterSkeletalAnimation.play("Jump");
    }
    continue() {
        this.backpack.children.forEach((item) => {
            item.removeFromParent();
            item.destroy();
        })
        this.backpack.removeAllChildren();
        this.coinNum = GlobeVariable.coinStartNum;
        for (let i = 0; i < GlobeVariable.coinStartNum; i++) {
            let node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);
            node.getComponent(BoxCollider).enabled = false;
            node.getComponent(RigidBody).enabled = false;
            node.parent = this.backpack;
            node.setPosition(v3(0, i * 0.45, 0));
        }
    }

    update(dt: number): void {
        super.update(dt);
        this.collectCoin();
    }

    //收集金币
    private collectCoin() {
        if (!GlobeVariable.isStartGame) {
            return;
        }
        if (App.dropController && App.dropController.getAroundDrop) {
            let coin: Node = App.dropController.getAroundDrop(this.node.worldPosition);
            if (coin) {
                coin.getComponent(BoxCollider).enabled = false;
                coin.getComponent(RigidBody).enabled = false;
                this.coinFly(coin);
            }

        }
    }

    /** 从金矿收集金币 */
    public getGoldMineCoin(coin: Node, pos: Vec3) {
        if (!coin) return; // 新增空值检查

        coin.parent = App.sceneNode.effectParent;
        coin.setWorldPosition(pos);
        this.coinFly(coin);
    }

    private coinFly(coin: Node) {
        if (!coin) return; // 新增空值检查

        SoundManager.Instance.playAudio("jinbi_shiqu");

        const start = coin.getWorldPosition().clone();
        const duration = 0.2;
        const controller = { t: 0 };

        coin.setParent(App.sceneNode.effectParent);
        coin.setWorldPosition(start);

        const startRot: Quat = coin.worldRotation.clone();
        const endRot: Quat = this.backpack.worldRotation;

        // 保存tween引用以便后续取消
        this.coinTween = tween(controller)
            .to(duration, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    // 关键修复：检查coin是否存在
                    if (!coin || !coin.isValid) return;

                    const t = controller.t;
                    const oneMinusT = 1 - t;

                    let maxY = this.backpack.children.length * 0.45;
                    const localTarget = new Vec3(0, maxY, 0);

                    const worldPos = this.backpack.getWorldPosition();
                    const worldRot = this.backpack.getWorldRotation();
                    const worldScale = this.backpack.getWorldScale();
                    const worldMat = new Mat4();
                    Mat4.fromSRT(worldMat, worldRot, worldPos, worldScale);
                    const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);

                    const control = new Vec3(
                        (start.x + worldTarget.x) / 2,
                        Math.max(start.y, worldTarget.y) + 2,
                        (start.z + worldTarget.z) / 2
                    );

                    const pos = new Vec3(
                        oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x,
                        oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y,
                        oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z
                    );

                    // 只在coin有效时设置位置
                    coin.setWorldPosition(pos);

                    const lerpedEuler = new Quat(
                        startRot.x * oneMinusT + endRot.x * t,
                        startRot.y * oneMinusT + endRot.y * t,
                        startRot.z * oneMinusT + endRot.z * t,
                        startRot.w * oneMinusT + endRot.w * t
                    );

                    // 只在coin有效时设置旋转
                    coin.setWorldRotation(lerpedEuler);
                }
            })
            .call(() => {
                // 检查coin是否仍然有效
                if (!coin || !coin.isValid) return;

                const finalWorldPos = coin.getWorldPosition().clone();
                coin.setParent(this.backpack);
                coin.setWorldPosition(finalWorldPos);
                coin.setWorldRotation(endRot);

                tween(coin)
                    .to(0.15, { scale: new Vec3(8.6, 8.6, 8.6) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(8, 8, 8) }, { easing: 'quadOut' })
                    .start();

                this.coinNum++;
                EventManager.instance.emit(EventType.CoinAdd, 1);
                this.calibrateCoinsPosition();
            })
            .start();
    }

    private coinHeightInterval: number = 0.45;
    /**
     * 校准所有金币的位置，解决堆叠断层问题
     * 循环遍历背包中的所有金币，按索引重新设置高度
     */
    private calibrateCoinsPosition(): void {
        // if (!this.backpack) return;

        // // 获取所有金币子节点
        // const coins = this.backpack.children;

        // // 遍历并重新设置每个金币的高度
        // coins.forEach((coin: Node, index: number) => {
        //     // 保持x和z坐标不变，只调整y坐标
        //     const localPos = coin.getPosition();
        //     const targetY = index * this.coinHeightInterval;

        //     // 如果当前高度与目标高度差距较大，使用动画平滑过渡
        //     if (Math.abs(localPos.y - targetY) > 0.01) {
        //         tween(coin)
        //             .to(0.1, { position: new Vec3(localPos.x, targetY, localPos.z) })
        //             .start();
        //     } else {
        //         // 差距小时直接设置，避免不必要的动画
        //         coin.setPosition(localPos.x, targetY, localPos.z);
        //     }
        // });
    }
    // private playAttackSound() {
    //     SoundManager.Instance.playAudio("gongji");
    // }

    // private playAttackAni() {
    //     this.attackAni.node.active = true;
    //     this.attackAni.play();
    // }

}


