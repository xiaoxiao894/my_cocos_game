import { _decorator, CCFloat, Component, EventTouch, Input, math, Node, Sprite, UIOpacity, UITransform, v3, Vec2, Vec3, Widget } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIJoyStickManager')
export class UIJoyStickManager extends Component {
    input: Vec2 = Vec2.ZERO;

    @property(Node)
    bodyNode: Node = null

    @property(Node)
    stickNode: Node = null;

    @property(Node)
    mouseNode:Node = null;

    @property(CCFloat)
    raiuds: number = 130;

    @property
    amplitudeX: number = 50;

    @property
    amplitudeY: number = 80;

    @property
    speed: number = 0.3;

    @property
    pauseDuration: number = 1.0; // 停顿时间（秒）

    @property(Node)
    hand: Node | null = null;

    @property(Node)
    textNode:Node = null;


    private defaultPos: Vec2 = new Vec2(0, 0);
    opacityCom = null;

    private t = 0;
    private loopCount = 0;
    private isPaused = false;
    private pauseTimer = 0;
    private handStartPos: Vec3 = new Vec3();

    private _showGuideDuration:number = 3;
    private _showGuideTimer:number = 3;
    private _showingGuide:boolean = false;

    private _isTouching = false;

    init() {
        this.opacityCom = this.node.getComponent(UIOpacity);
        this.opacityCom.opacity = 0;
        this.bodyNode.getComponent(Widget).updateAlignment();
        this.defaultPos.x = this.bodyNode.position.x;
        this.defaultPos.y = this.bodyNode.position.y;
        this.mouseNode.active = false;

        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);;
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(eventTouch: EventTouch) {
        if (DataManager.Instance.cameraGuiding) return;
        this.hand.active = false;
        this.textNode.active = false;
        this._showingGuide = false;
        this._showGuideTimer =  0;
        this._isTouching = true;
        const touchPos = eventTouch.getUILocation();
        this.bodyNode.setPosition(touchPos.x, touchPos.y);

        this.opacityCom.opacity = 255;
        this.mouseNode.active = false;
    }

    onTouchMove(touchEvent: EventTouch) {
        if (DataManager.Instance.cameraGuiding) return;

        const touchPos = touchEvent.getUILocation();
        const offset = new Vec2(touchPos.x - this.bodyNode.position.x, touchPos.y - this.bodyNode.position.y);

        if (offset.length() > this.raiuds) {
            this.mouseNode.active = true;
            this.mouseNode.setPosition(offset.x, offset.y);
            offset.multiplyScalar(this.raiuds / offset.length());
        }else{
            this.mouseNode.active = false;
        }

        this.stickNode.setPosition(offset.x, offset.y);
        this.input = offset.clone().normalize();
    }

    onTouchEnd(touchEvent: EventTouch) {
        if (DataManager.Instance.cameraGuiding) return;
        this._isTouching = false;
        this.opacityCom.opacity = 0;

        this.bodyNode.setPosition(this.defaultPos.x, this.defaultPos.y);
        this.stickNode.setPosition(Vec3.ZERO);

        this.input = Vec2.ZERO;
    }

    update(dt: number) {
        if (this._isTouching||DataManager.Instance.cameraGuiding||DataManager.Instance.sceneManager.gameEndParent.children.length>0) return;

        if(!this._showingGuide){
            this._showGuideTimer +=dt;
            if(this._showGuideTimer>=this._showGuideDuration){
                this._showGuideTimer = 0;
                this._showingGuide = true;
                this.opacityCom.opacity = 255;
                this.hand.active = true;
                this.textNode.active = true;
                this.bodyNode.setPosition(this.defaultPos.x, this.defaultPos.y);
            }else{
                return;
            }
            
        }
        this.mouseNode.active = false;
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
        this.stickNode.setPosition(offset);

        if (this.hand) {
            const handPos = this.handStartPos.clone().add(offset);
            this.hand.setPosition(handPos);
        }


        if (this.t >= Math.PI * 2) {
            this.loopCount += 1;
            this.t = 0;

            if (this.loopCount >= 2) {
                this.loopCount = 0;
                this.stickNode.setPosition(Vec3.ZERO);
                if (this.hand) this.hand.setPosition(this.handStartPos);
                this.isPaused = true;
            }
        }
    }
}

