import { _decorator, Camera, Collider, Color, color, Component, EventTouch, geometry, Input, input,  Label,  Node,  PhysicsSystem,  Sprite,  tween, UIOpacity, UITransform, Vec2, Vec3, view} from 'cc';
import { DataManager } from '../Globel/DataManager';
import { EnemyItem } from '../Enemy/EnemyItem';
import { EventManager } from '../Globel/EventManager';
import { EventName } from '../Enum/Enum';
import GameUtils from '../Utils/GameUtils';
import { SoundManager } from '../Globel/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    /** 瞄准镜 */
    @property(Node)
    lensNode:Node = null;

    /** 打开8倍镜、射击 按钮 */
    @property(Node)
    armBtnNode:Node = null;

    @property(Node)
    fireBtnNode:Node = null;

    @property(Node)
    armImageNode:Node = null;

    /** 小圆点 */
    @property(Sprite)
    point:Sprite = null;

    @property(Node)
    touchNode:Node = null;

    @property(Label)
    bullteNum:Label = null;

    @property(Node)
    resetNode:Node = null;

    @property(Node)
    gameEndNode:Node = null;

    /** 正在触摸 */
    private _isTouching: boolean = false;
    /** 正在瞄准 */
    private _isFireTouching:boolean = false;
    /** 正在射击 */
    private _firing:boolean = false;
    private _lastTouchPos: Vec2 = new Vec2();

    private _grideShow:boolean = true;

    start() {
        DataManager.Instance.UIManager = this;
        this.resetNode.active = false;
        //this.gameEndNode.active = false;
        this.initGame();
        
        
    }

    protected onEnable(): void {
        this.touchNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.armBtnNode.on(Node.EventType.TOUCH_START, this.onAimTouchStart, this);
        this.fireBtnNode.on(Node.EventType.TOUCH_END,this.onFireBtnClick,this);

    }

    protected onDisable(): void {
        this.touchNode.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.off(Node.EventType.TOUCH_START, this.onTouchEnd, this);
        this.touchNode.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.armBtnNode.off(Node.EventType.TOUCH_START, this.onAimTouchStart, this);
        this.fireBtnNode.on(Node.EventType.TOUCH_END,this.onFireBtnClick,this);
    }

    onTouchStart(event: EventTouch) {
        if(DataManager.Instance.isGameEnd){
            return;
        }
        console.log("onTouchStart");
        const touch = event.getTouches()[0];
        this._lastTouchPos.set(touch.getLocation().x, touch.getLocation().y);
        this._isTouching = true;
        EventManager.inst.emit(EventName.TouchStart);
    }

    // 初始化变量
    onTouchMove(event: EventTouch) {
        if (!this._isTouching||DataManager.Instance.isGameEnd) return;
        //console.log("onTouchMove");
        const touch = event.getTouches()[0];

        DataManager.Instance.cameraMain?.updateTouchPos(touch.getLocation().clone());
        this._lastTouchPos.set(touch.getLocation());
        this.updatePointColor();
        //console.log("touchpos",touch.getLocation());
    }


    onTouchEnd(event: EventTouch) {
        if(DataManager.Instance.isGameEnd){
            return;
        }
        this._isTouching = false;
        DataManager.Instance.cameraMain.touchEnd();
    }

    private onAimTouchStart(event: EventTouch){
        if(this._firing||DataManager.Instance.isGameEnd){
            return;
        }
        if(!this.isInCircle(this.armImageNode,event)){
            return;
        }
        console.log("onAimTouchStart");
        EventManager.inst.emit(EventName.HideGuide,1);
        if(!this._isFireTouching){
            this.lensNode.active = true;
            this._isFireTouching = true;
            //镜头推进
            DataManager.Instance.cameraMain.radiusIn();
            EventManager.inst.emit(EventName.PlayerUp);
        }
        this.fireBtnNode.active = true;
        this.armImageNode.active = false;
    }

    

    
    /** 更新瞄准颜色 */
    private updatePointColor(){
        //console.log("_isFireTouching",this._isFireTouching);
        if((this._isFireTouching||this._firing)&&!DataManager.Instance.isGameEnd){
            this.point.node.active = true;

            //有瞄准到人 用红色，没有用黑色
            // let cameraMain: Camera = DataManager.Instance.cameraMain.camera;
            // let ray: geometry.Ray = new geometry.Ray();
            // cameraMain.screenPointToRay(view.getViewportRect().width/2, view.getViewportRect().height/2, ray);
            // // 以下参数可选
            // const mask = 1 << 1;
            // const maxDistance = 10000000;
            // const queryTrigger = true;

            // if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
                this.point.color = new Color().fromHEX('#ff0000');
            // } else {
            //     this.point.color = new Color().fromHEX('#000000');
            // }
        }else{
            this.point.node.active = false;
        }
    }

    private onFireBtnClick(event:EventTouch){
        if(!this._isFireTouching||this._firing||DataManager.Instance.isGameEnd){
            return;
        }
        if(!this.isInCircle(this.fireBtnNode,event)){
            return;
        }
        console.log("onFireBtnClick");
        EventManager.inst.emit(EventName.HideGuide,0);
        this._firing = true;
        DataManager.Instance.bulletNum--;
        this.bullteNum.string = DataManager.Instance.bulletNum.toString();
        this._isFireTouching = false;
        //敌人死掉
        let cameraMain: Camera = DataManager.Instance.cameraMain.camera;
        let ray: geometry.Ray = new geometry.Ray();
        cameraMain.screenPointToRay(view.getViewportRect().width/2, view.getViewportRect().height/2, ray);
        const mask = 1 << 1;
        const maxDistance = 10000000;
        const queryTrigger = true;

        let lastShoted:boolean = false;
        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const enemy: Collider = raycastClosestResult.collider;
            let enemyItem:EnemyItem =  GameUtils.getComponentInParent(enemy.node, EnemyItem);
            if(enemyItem){
                let headShot:boolean = false;
                //判断爆头
                if(raycastClosestResult.hitPoint.y>enemyItem.neckNode.worldPosition.y){
                    console.log("爆头");
                    headShot = true;
                }
                if(!enemyItem.isLastOne()){
                    enemyItem.dead(headShot,raycastClosestResult.hitPoint);
                }else{
                    enemyItem.stopAni();
                    this.lensNode.active = false;
                    DataManager.Instance.isGameEnd = true;
                    DataManager.Instance.lastEnemyPos = raycastClosestResult.hitPoint.clone();
                    //慢动作子弹
                    DataManager.Instance.sceneMananger.fireBullet(raycastClosestResult.hitPoint);
                    DataManager.Instance.cameraMain.gameEnd();
                    lastShoted = true;
                    this.point.node.active = false;
                }
                
            }
        }
        if(!lastShoted){
            //后坐力
            DataManager.Instance.cameraMain.triggerRecoil();
            
            this.scheduleOnce(()=>{
                //镜头拉远
                this.lensNode.active = false;
                DataManager.Instance.cameraMain.radiusOut();
                this.updatePointColor();
                if(DataManager.Instance.bulletNum ===0&&!DataManager.Instance.isGameEnd){
                    console.log("重新开始");
                    this.resetGame();
                }
                this._firing = false;
                if(this._grideShow){
                    this._grideShow = false;
                    EventManager.inst.emit(EventName.ShowGuide,1);
                }
                EventManager.inst.emit(EventName.PlayerDown);
            },0.85);
        }

        this.fireBtnNode.active = false;
        this.armImageNode.active = true;
        
        SoundManager.inst.playAudio("YX_M416");
    }

    private resetGame(){
        this.resetNode.active = true;
        let ope:UIOpacity = this.resetNode.getComponent(UIOpacity);
        ope.opacity = 0;
        tween(ope)
        .to(0.5, {opacity: 255})
        .call(()=>{
            this.initGame();
            DataManager.Instance.cameraMain.resetGame();
            DataManager.Instance.enemyManger.resetGame();
        })
        .delay(0.2)
        .to(0.5, {opacity: 0})
        .call(()=>{
            this.resetNode.active = false;
        })
        .start();
    }

    private initGame(){
        this._grideShow = true;
        DataManager.Instance.bulletNum = DataManager.Instance.bulletTotalNum;
        this.bullteNum.string = DataManager.Instance.bulletNum.toString();
        this._isFireTouching = true;
        this.lensNode.active = true;
        this.fireBtnNode.active = true;
        this.armImageNode.active = false;
        this.updatePointColor();
        
        this.scheduleOnce(()=>{
            EventManager.inst.emit(EventName.ShowGuide,0);
        })
    }

    protected update(dt: number): void {
        this.updatePointColor();
    }

    public showGameEnd(){
        this.gameEndNode.active = true;
    }

    private isInCircle(centerNode:Node,event:EventTouch){
        // 获取触摸点
        const touches = event.getTouches();
        if(touches.length === 0) return false;
        const touchPos = touches[0].getUILocation().clone();
        
        // 计算圆形区域检测
        const center = new Vec2(
            centerNode.worldPosition.x,
            centerNode.worldPosition.y
        );
        const radius = centerNode.getComponent(UITransform).width*centerNode.scale.x / 2;
        const distance = Vec2.distance(touchPos, center);
        
        return distance <= radius;
    }

}


