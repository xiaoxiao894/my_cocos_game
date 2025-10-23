import { _decorator, CCFloat, Component, EventTouch, Input, math, Node, Sprite, UIOpacity, v3, Vec3 } from 'cc';


import { VirtualInput } from './VirtuallInput';
import { GlobeVariable } from '../core/GlobeVariable';
import { App } from '../App';

const { ccclass, property } = _decorator;

@ccclass('UIJoyStick')
export class UIJoyStick extends Component {
    @property(Sprite)
    thumbnail: Sprite | null = null;

    @property(Sprite)
    joyStickBg: Sprite | null = null;

    @property(Node)
    hand: Node | null = null;

    @property(CCFloat)
    radius: number = 130;

    initJoyStickBgPosition: Vec3 = v3();

    uiOpacity = null;

    @property
    amplitudeX: number = 50;

    @property
    amplitudeY: number = 80;

    @property
    speed: number = 0.3;

    @property
    pauseDuration: number = 1.0; // 停顿时间（秒）

    // 添加平滑系数和缓存变量
    @property
    smoothFactor: number = 0.2; // 平滑系数，值越小平滑效果越明显（范围0-1）

    private lastHorizontal: number = 0;
    private lastVertical: number = 0;

    private t = 0;
    private loopCount = 0;
    private isPaused = false;
    private pauseTimer = 0;
    private handStartPos: Vec3 = new Vec3();

    start() {
        if (GlobeVariable.isTouching) {
            this.uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
            this.uiOpacity.opacity = 0;
        }



        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.initJoyStickBgPosition = this.joyStickBg.node.worldPosition;

        if (this.hand) {
            this.handStartPos = this.hand.getPosition().clone();
        }
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        //  GlobeVariable.isStartGame = true;
        //  App.sceneNode.enemyParent.active = true;
        if (App.playerController?.playMove)
            App.playerController.playMove();
        if (GlobeVariable.isDeactivateVirtualJoystick || GlobeVariable.isGameEnd || !GlobeVariable.isCameraMoveEnd) return;
        GlobeVariable.isTouching = true;
        if (this.hand) this.hand.active = false;

        let x = event.touch.getUILocationX();
        let y = event.touch.getUILocationY();

        this.joyStickBg.node.setWorldPosition(x, y, 0)

        if (this.uiOpacity) this.uiOpacity.opacity = 255;
    }

    onTouchMove(event: EventTouch) {
        if (GlobeVariable.isDeactivateVirtualJoystick || GlobeVariable.isGameEnd || GlobeVariable.isJoyStickBan || !GlobeVariable.isCameraMoveEnd) return;

        let x = event.touch.getUILocationX();
        let y = event.touch.getUILocationY();

        let worldPos = new Vec3(x, y, 0);
        let localPos = v3();

        this.joyStickBg.node.inverseTransformPoint(localPos, worldPos);
        let thumbnailPos = v3();
        let len = localPos.length();
        localPos.normalize();
        Vec3.scaleAndAdd(thumbnailPos, v3(), localPos, math.clamp(len, 0, this.radius));

        this.thumbnail.node.setPosition(thumbnailPos);


        // 计算目标值
        const targetHorizontal = this.thumbnail.node.position.x / this.radius;
        const targetVertical = this.thumbnail.node.position.y / this.radius;

        // 使用线性插值进行平滑处理
        this.lastHorizontal = this.lastHorizontal + (targetHorizontal - this.lastHorizontal) * this.smoothFactor;
        this.lastVertical = this.lastVertical + (targetVertical - this.lastVertical) * this.smoothFactor;

        // 设置平滑后的值
        VirtualInput.horizontal = this.lastHorizontal;
        VirtualInput.vertical = this.lastVertical;
    }

    onTouchEnd(event: EventTouch) {
        // if (DataManager.Instance.isDeactivateVirtualJoystick) return;
        App.playerController.playIdle();
        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;
        // 重置缓存值
        this.lastHorizontal = 0;
        this.lastVertical = 0;

        this.thumbnail.node.setPosition(Vec3.ZERO);
        this.joyStickBg.node.setWorldPosition(this.initJoyStickBgPosition);

        if (GlobeVariable.isTouching) {
            this.uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
            this.uiOpacity.opacity = 0;
        }
    }

    update(dt: number) {
        if (GlobeVariable.isTouching) return;

        if (this.isPaused) {
            this.pauseTimer += dt;
            if (this.pauseTimer >= this.pauseDuration) {
                this.pauseTimer = 0;
                this.isPaused = false;
                this.t = 0;
            }
            return;
        }

        this.t += dt * this.speed;

        const xRaw = this.amplitudeX * Math.sin(this.t);
        const yRaw = this.amplitudeY * Math.sin(this.t) * Math.cos(this.t);

        const x = yRaw;
        const y = -xRaw;

        const offset = new Vec3(x, y, 0);
        this.thumbnail.node.setPosition(offset);

        if (this.hand) {
            const handPos = this.handStartPos.clone().add(offset);
            this.hand.setPosition(handPos);
        }


        if (this.t >= Math.PI * 2) {
            this.loopCount += 1;
            this.t = 0;

            if (this.loopCount >= 2) {
                this.loopCount = 0;
                this.thumbnail.node.setPosition(Vec3.ZERO);
                if (this.hand) this.hand.setPosition(this.handStartPos);
                this.isPaused = true;
            }
        }
    }

}


