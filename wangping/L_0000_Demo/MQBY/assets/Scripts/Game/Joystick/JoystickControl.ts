// JoystickControl.ts
import { _decorator, Component, Node, EventTouch, Vec2, v2, v3, UITransform } from 'cc';
import { CommonEvent } from '../../common/CommonEnum';
import { PrintComponent } from 'db://playable_packager/PrintComponent';
const { ccclass, property } = _decorator;

@ccclass('JoystickControl')
export class JoystickControl extends Component {
    @property({type: Node, displayName: '摇杆底座节点'})
    private baseNode: Node = null!;

    @property({type: Node, displayName: '摇杆节点'})
    private stick: Node = null!;

    @property({displayName: '摇杆移动限制'})
    private stickLimit = 80;

    @property({displayName: '摇杆死区'})
    private deadZone = 0; // 添加死区配置

    @property({displayName: '触摸结束时是否重置摇杆位置'})
    private resetStickOnEnd = true; // 控制触摸结束时是否重置摇杆位置

    @property({type: Node, displayName: '引导节点'})
    private guideNode: Node = null!;

    @property({displayName: '无操作多长时间显示引导(秒)'})
    private inactivityTimeToShowGuide = 5; // 无操作多长时间显示引导(秒)

    private readonly _originPos = v3();
    private readonly _tempOffset = v2(); // 复用 Vec2 对象
    private readonly _inputVector = v2();
    private inactivityTimer = 0; // 无操作计时器
    
    protected onLoad(): void {
        this.initializeJoystick();
        this.registerTouchEvents();
    }

    protected onDestroy(): void {
        this.unregisterTouchEvents();
    }

    private initializeJoystick(): void {
        this.baseNode.active = false;
        this.stick.setPosition(0, 0, 0);
        
        // 初始化引导节点
        if (this.guideNode) {
            this.guideNode.active = true;
        }
    }

    private registerTouchEvents(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private unregisterTouchEvents(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        const touchPos = event.getUIStartLocation();
        this._originPos.set(touchPos.x, touchPos.y);
        
        this.baseNode.active = true;
        this.baseNode.setWorldPosition(this._originPos);
        
        this.updateJoystickPosition(event.getUILocation());

        PrintComponent.game_interaction('touch-start');
        
        // 重置无操作计时器并隐藏引导
        this.resetInactivityTimer();
        this.hideGuide();
    }

    private onTouchMove(event: EventTouch): void {
        this.updateJoystickPosition(event.getUILocation());
        
        // 重置无操作计时器
        this.resetInactivityTimer();
    }

    private updateJoystickPosition(currentPos: Vec2): void {
        this._tempOffset.set(
            currentPos.x - this._originPos.x,
            currentPos.y - this._originPos.y
        );

        const distance = this._tempOffset.length();
        
        // 应用死区
        if (distance < this.deadZone) {
            this._inputVector.set(Vec2.ZERO);
            this.stick.setPosition(0, 0);
            return;
        }

        // 限制摇杆移动范围
        const clampedDistance = Math.min(distance, this.stickLimit);
        const normalizedOffset = this._tempOffset.normalize();
        
        const stickX = normalizedOffset.x * clampedDistance;
        const stickY = normalizedOffset.y * clampedDistance;
        
        this.stick.setPosition(stickX, stickY);
        this._inputVector.set(normalizedOffset);
        
        this.emitJoystickInput();
    }

    private onTouchEnd(): void {
        this.baseNode.active = false;
        
        if (this.resetStickOnEnd) {
            this.stick.setPosition(0, 0);
        }
        
        this._inputVector.set(Vec2.ZERO);
        this.emitJoystickInput();
        
        PrintComponent.game_interaction('touch-end');
        
        // 重置无操作计时器
        this.resetInactivityTimer();
    }

    private emitJoystickInput(): void {
        app.event.emit(CommonEvent.joystickInput, this._inputVector);
    }

    private resetInactivityTimer(): void {
        this.inactivityTimer = 0;
    }

    private hideGuide(): void {
        if (this.guideNode) {
            this.guideNode.active = false;
        }
    }

    private showGuide(): void {
        if (this.guideNode) {
            this.guideNode.active = true;
        }
    }

    protected update(dt: number): void {
        if (this.isActive) {
            this.emitJoystickInput();
        }
        
        // 更新无操作计时器
        if (!this.isActive) {
            this.inactivityTimer += dt;
            
            // 如果无操作时间达到阈值，显示引导
            if (this.inactivityTimer >= this.inactivityTimeToShowGuide) {
                this.showGuide();
            }
        }
    }

    // 公共访问器
    public get inputVector(): Readonly<Vec2> {
        return this._inputVector;
    }

    public get isActive(): boolean {
        return this.baseNode.active;
    }
}
