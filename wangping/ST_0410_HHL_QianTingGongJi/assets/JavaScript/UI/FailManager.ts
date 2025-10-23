import { _decorator, Component, instantiate, Node, Prefab, randomRange, tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { DataManager } from '../Globel/DataManager';
import super_html_playable from '../Common/super_html_playable';
//import Platform from '../Common/Platform';
const { ccclass, property } = _decorator;

const minScale = 0.46;
const maxScale = 0.54;
const duration = 1;

const failStartPos = new Vec2(-208, 130)
const failStartOpacity = 0;

@ccclass('FailManager')
export class FailManager extends Component {
    @property(Node)
    uiRoot: Node = null;

    @property(Node)
    bg: Node = null;

    @property(Node)
    failButtonNode: Node = null;

    @property(Node)
    failTitle: Node = null;

    @property(Node)
    failNode: Node = null;

    @property(Node)
    snowflakeCon: Node = null;

    @property(Prefab)
    nowflakePrefab: Prefab = null;

    @property
    spawnInterval: number = 0.2; // 雪花生成间隔（秒）

    @property
    snowFallDuration: number = 1.5; // 雪花从上到下时间（秒）

    private _timer: number = 0;

    start() {
        if (this.snowflakeCon.children.length > 0) this.snowflakeCon.removeAllChildren();
        DataManager.Instacne.failManager = this;

        this.node.active = false;

        this.bg.active = false;


        this.failButtonNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.failTitle.setScale(0, 0.7, 0.7);

        this.failNode.setPosition(failStartPos.x, failStartPos.y);
        const failNodeOpacity = this.failNode.getComponent(UIOpacity)
        failNodeOpacity.opacity = failStartOpacity;

        this.failButtonNode.setScale(0, 0.7, 0.7);
    }

    // 点击失败按钮
    onTouchEnd() {
        if (DataManager.Instacne.failCount > DataManager.Instacne.targetFailCount) {

            super_html_playable.download();

            return;
        }

        this.node.active = false;
        this.bg.active = false;

        this.failTitle.setScale(0, 0.7, 0.7);

        this.failNode.setPosition(failStartPos.x, failStartPos.y);
        const failNodeOpacity = this.failNode.getComponent(UIOpacity)
        failNodeOpacity.opacity = 90;

        this.failButtonNode.setScale(0, 0.7, 0.7);

        DataManager.Instacne.resetPage();
    }

    // 显示成功页面
    displayFailPage() {
        DataManager.Instacne.failCount += 1

        this.uiRoot.active = false;
        this.node.active = true;
        this.bg.active = true;

        if (DataManager.Instacne.isTurnSound) {
            DataManager.Instacne.soundManager.failSoundPlay();
        } else {
            DataManager.Instacne.soundManager.failSoundPause();
        }

        tween(this.failTitle)
            .to(0.3, { scale: new Vec3(0.8, 0.8, 0.8) })
            .to(0.1, { scale: new Vec3(0.7, 0.7, 0.7) })
            .start();

        const failNodeOpacity = this.failNode.getComponent(UIOpacity)
        tween(this.failNode)
            .to(0.5, { position: new Vec3(-10, -40, 0) })
            .start();
        tween(failNodeOpacity)
            .to(0.5, { opacity: 255 })
            .start();

        tween(this.failButtonNode)
            .to(0.4, { scale: new Vec3(0.5, 0.5, 0.5) })
            .call(() => {
                this.buttonBreathingAni(this.failButtonNode);
            })
            .start();
    }

    // 隐藏成功页面
    hideSourcePage() {
        this.uiRoot.active = false;
        this.node.active = false;
        this.bg.active = false;
    }

    // 按钮呼吸动画
    buttonBreathingAni(buttonNode) {
        tween(buttonNode)
            .to(duration, { scale: new Vec3(minScale, minScale, minScale) }, { easing: 'sineInOut' })
            .to(duration, { scale: new Vec3(maxScale, maxScale, maxScale) }, { easing: 'sineInOut' })
            .call(() => {
                this.buttonBreathingAni(buttonNode);
            })
            .start();
    }

    update(dt: number) {
        this._timer += dt;

        if (this._timer >= this.spawnInterval) {
            this._timer = 0;

            this.spawnSnow();
        }
    }

    spawnSnow() {
        if (!this.nowflakePrefab) {
            return;
        }

        const snow = instantiate(this.nowflakePrefab);
        const snowA = snow.addComponent(UIOpacity);
        this.snowflakeCon.addChild(snow);

        const canvasWidth = this.node.getComponent(UITransform).width;
        const canvasHeight = this.node.getComponent(UITransform).height;

        const startX = randomRange(-canvasWidth / 2, canvasWidth / 2);
        const startY = canvasHeight / 2 + 100; // 稍微高一点，藏出界
        snow.setPosition(startX, startY, 0);

        const randomScale = randomRange(0.1, 0.3);
        snow.setScale(new Vec3(randomScale, randomScale, 1));

        const randomA = randomRange(120, 255)
        snowA.opacity = randomA;

        // 目标位置：底部随机x
        const endX = startX + randomRange(-50, 50); // 落下过程中稍微偏移
        const endY = -canvasHeight / 2 - 50;

        const duration = (this.snowFallDuration * 0.5) + randomRange(-0.5, 0.5);

        tween(snow)
            .to(duration, { position: new Vec3(endX, endY, 0) }, {
                easing: 'linear',
                onUpdate(target: Node, ratio: number) {
                    // 加点摆动效果
                    const offsetX = Math.sin(ratio * Math.PI * 2) * 20; // 左右摆动幅度
                    target.setPosition(target.position.x + offsetX * 0.01, target.position.y, 0);
                }
            })
            .call(() => {
                snow.destroy(); // 落地后销毁
            })
            .start();
    }
}

