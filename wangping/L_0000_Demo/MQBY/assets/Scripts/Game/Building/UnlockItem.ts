import { _decorator, CCInteger, Component, Enum, Label, Node, tween, v3, Vec3, Sprite, Material, resources, Color, Collider, ITriggerEvent, Tween } from 'cc';
import { BuildUnlockState, CommonEvent, ObjectType, BuildingType } from '../../common/CommonEnum';
import { DropItemCom } from '../Drop/DropItemCom';
import { Config } from '../../common/Config';
import { PickupComponent } from '../Components/PickupComponent';
const { ccclass, property } = _decorator;

@ccclass('UnlockItem')
export class UnlockItem extends Component {

    @property({type: Enum(BuildUnlockState), displayName: '初始解锁状态'})
    private initUnlockState: BuildUnlockState = BuildUnlockState.NoActive;

    @property({type: Enum(BuildingType), displayName: '解锁建筑类型'})
    private itemType: BuildingType = BuildingType.None;
    
    @property({type: Enum(ObjectType), displayName: '消耗资源类型'})
    private consumptionType: ObjectType = ObjectType.DropItemCoin;

    @property({type: Label, displayName: '剩余所需资源数'})
    private remainGoldLbl: Label = null!;

    @property({type: CCInteger, displayName: '解锁所需资源数量'})
    private unlockCostValue: number = 0;

    @property({type: Collider, displayName: '触发器'})
    private trigger: Collider = null!;

    @property({type: Node, displayName: '资源Icon'})
    private goldIcon: Node = null!;

    @property({type: Sprite, displayName: '百分比'})
    private percent: Sprite = null!;

    private _unlockState: BuildUnlockState = BuildUnlockState.NoActive;
    private reservedGold: number = 0;
    private remainGold: number = 0;
    private isShowUnlockTip: boolean = false;
    private pickupComponents: Map<string, PickupComponent> = new Map(); // 存储在触发器内的PickupComponent
    private checkTimer: number = 0; // 用于在update中控制检查频率
    
    public get ItemType(): BuildingType {
        return this.itemType;
    }

    public get UnlockState(): BuildUnlockState {
        return this.unlockState;
    }
    
    public get ConsumptionType(): ObjectType {
        return this.consumptionType;
    }

    /**
     * 预留资源数量，在资源飞过来的过程中先减少所需资源
     * @param amount 预留的资源数量
     */
    reserveGold(amount: number) {
        if (this.unlockState !== BuildUnlockState.Active) return;
        
        this.reservedGold += amount;
        // 更新显示的剩余资源数量
        const displayRemainGold = this.getDisplayRemainGold();
        
        // 如果预留的资源足够解锁，可以在这里触发相关事件
        if (displayRemainGold <= 0) {
            // 可以在这里添加预解锁的视觉效果或其他逻辑
        }
    }
    
    get unlockState(): BuildUnlockState {
        return this._unlockState;
    }

    set unlockState(value: BuildUnlockState) {
        switch (value) {
            case BuildUnlockState.Active:
                this.node.active = true;
                break;
            case BuildUnlockState.Unlocked:
                this.node.active = false;
                break;
            case BuildUnlockState.NoActive:
                this.node.active = false;
                break;
        }
        this._unlockState = value;
    }
    
    onLoad() {
        this.trigger.on('onTriggerEnter', this._onCollisionEnter, this);
        this.trigger.on('onTriggerExit', this._onCollisionExit, this);
        
        this.reset();
        
        if(this.initUnlockState === BuildUnlockState.Unlocked){
            // 这里可以添加解锁成功的事件通知
            this.scheduleOnce(() => {
                app.event.emit(CommonEvent.UnlockItem, this.itemType);
            });
        }

        app.event.on(CommonEvent.SetUnlockStatue, this.onSetUnlockStatue, this);

        app.event.emit(CommonEvent.UpdateGuideItemPosition, {
            type: this.itemType, 
            position: this.node.getWorldPosition(),
            consumptionType: this.consumptionType
        });
        
        // 使用update方法替代schedule
        this.checkTimer = 0;

        manager.game.unlockItemMap.set(this.itemType, this);
    }

    onDestroy() {
        app.event.off(CommonEvent.SetUnlockStatue, this.onSetUnlockStatue);
        this.trigger.off('onTriggerEnter', this._onCollisionEnter, this);
        this.trigger.off('onTriggerExit', this._onCollisionExit, this);
    }

    onSetUnlockStatue(data: {type: BuildingType, state: BuildUnlockState}) {
        if(data.type === this.itemType){
            this.unlockState = data.state;
        }
    }

    reset() {
        this.unlockState = this.initUnlockState;
        this.remainGold = this.unlockCostValue;
        // this.remainGold = 1;
        this.reservedGold = 0;
        
        // 根据消耗类型设置不同的前缀
        this.remainGoldLbl.string = 'x' + this.remainGold.toString();
        this.percent.fillRange = 1 - (this.remainGold / this.unlockCostValue);

        this.isShowUnlockTip = false;
        this.pickupComponents.clear();
    }

    CostGold(cost: number) {
        // 从预留的资源中扣除实际到达的资源
        const actualCost = Math.min(cost, this.reservedGold);
        this.reservedGold -= actualCost;
        this.remainGold -= cost;

        // 清除原本tween
        tween(this.goldIcon).stop();
        this.goldIcon.scale = v3(1, 1, 1);
        // 播放图标动画
        tween(this.goldIcon)
            .to(0.01, {scale: v3(1.2, 1.2, 1.2)})
            .call(() => {
                this.remainGoldLbl.string = 'x' + this.remainGold.toString();
                this.percent.fillRange = 1 - (this.remainGold / this.unlockCostValue);
                
                // 检查是否已经解锁
                if (this.remainGold <= 0 && this.unlockState === BuildUnlockState.Active) {
                    this.unlockState = BuildUnlockState.Unlocked;
                    // 这里可以添加解锁成功的事件通知
                    app.event.emit(CommonEvent.UnlockItem, this.itemType);
                }
            })
            .to(0.01, {scale: v3(1, 1, 1)})
            .start();
    }

    private _onCollisionEnter(event: ITriggerEvent) {
        const node = event.otherCollider.node;
        const pickupComponent = node.getComponent(PickupComponent);
        if(pickupComponent){
            // 添加到Map中跟踪
            this.pickupComponents.set(node.uuid, pickupComponent);
            // console.log('添加到Map中跟踪', node.uuid, pickupComponent);
        }
    }
    
    private _onCollisionExit(event: ITriggerEvent) {
        const node = event.otherCollider.node;
        if(node && this.pickupComponents.has(node.uuid)){
            // 从Map中移除
            this.pickupComponents.delete(node.uuid);
            // console.log('从Map中移除', node.uuid);
        }
    }
    
    private _checkPickupComponents() {
        // 如果不是激活状态，直接返回
        if(this.unlockState !== BuildUnlockState.Active) return;
        
        // 遍历所有触发器内的PickupComponent
        this.pickupComponents.forEach((pickupComponent, uuid) => {
            if(pickupComponent && pickupComponent.isValid){
                this.OnCost(pickupComponent, pickupComponent.node.getWorldPosition());
            } else {
                // 如果组件不再有效，从Map中移除
                this.pickupComponents.delete(uuid);
            }
        });
    }

    public OnCost(pickupComponent: PickupComponent, wpos: Vec3){
        
        if(this.unlockState === BuildUnlockState.Active 
            && pickupComponent.getItemInContainerCount(this.consumptionType) > 0
            && this.getDisplayRemainGold() > 0
        ){
            this.reserveGold(1);
            const consumeList = pickupComponent.consumeItem(this.consumptionType, 1);

            let item = null;
            if(consumeList.length > 0){
                item = consumeList[0];
                Tween.stopAllByTarget(item);
            }else{
                const position = wpos;
                item = manager.pool.getNode(this.consumptionType, manager.effect.node)!;
                item.setWorldPosition(position);
            }

            const parent = manager.effect.node;
            item.setParent(parent, true);

            item.setRotationFromEuler(new Vec3(0, 0, 0));

            manager.effect.flyNodeInParabola(item, this.goldIcon, () => {
                app.audio.playEffect('resources/MQBY/投入资源');
                this.CostGold(1);
                manager.pool.putNode(item);
            });
        }
    }
    
    getRemainGold() {
        return this.remainGold;
    }
    
    /**
     * 获取显示的剩余资源数量（考虑预留资源）
     */
    getDisplayRemainGold() {
        return Math.max(0, this.remainGold - this.reservedGold);
    }
    
    /**
     * 获取预留的资源数量
     */
    getReservedGold() {
        return this.reservedGold;
    }

    /**
     * 显示解锁提示
     */
    ShowUnlockTip() {
        if(this.isShowUnlockTip) return;
        this.isShowUnlockTip = true;
        
        const iconNode = this.node.getChildByName('icon');
        const squareNode = this.node.getChildByName('square')!;
        
        // 保存原始颜色和缩放
        const originalScale = squareNode.scale.clone();
        
        // 设置呼吸动画 - 缩放效果
        tween(squareNode)
            .to(0.5, { scale: v3(originalScale.x * 1.1, originalScale.y * 1.1, originalScale.z) }, { easing: 'sineInOut' })
            .to(0.5, { scale: originalScale }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
            
        // 呼吸变色效果 - 节点本身
        const nodeSprite = squareNode.getComponent(Sprite);
        if (nodeSprite) {
            // 使用颜色变化代替材质
            tween(nodeSprite)
                .to(0.5, { color: new Color(100, 255, 100, 255) }, { easing: 'sineInOut' })
                .to(0.5, { color: new Color(255, 255, 255, 255) }, { easing: 'sineInOut' })
                .union()
                .repeatForever()
                .start();
        }
        
        // 呼吸变色效果 - icon子节点
        if (iconNode) {
            const iconSprite = iconNode.getComponent(Sprite);
            if (iconSprite) {
                // 使用颜色变化代替材质
                tween(iconSprite)
                    .to(0.5, { color: new Color(100, 255, 100, 255) }, { easing: 'sineInOut' })
                    .to(0.5, { color: new Color(255, 255, 255, 255) }, { easing: 'sineInOut' })
                    .union()
                    .repeatForever()
                    .start();
            }
        }
        
        // 呼吸变色效果 - 数字标签
        if (this.remainGoldLbl) {
            tween(this.remainGoldLbl)
                .to(0.5, { color: new Color(100, 255, 100, 255) }, { easing: 'sineInOut' })
                .to(0.5, { color: new Color(255, 255, 255, 255) }, { easing: 'sineInOut' })
                .union()
                .repeatForever()
                .start();
        }
    }

    /**
     * 隐藏解锁提示
     */
    HideUnlockTip() {
        tween(this.node).stop();
        // 获取icon子节点（假设goldIcon就是要变色的icon）
        const iconNode = this.node.getChildByName('icon');
        if (iconNode) tween(iconNode).stop();

        // 停止数字标签动画
        if (this.remainGoldLbl) {
            tween(this.remainGoldLbl).stop();
            this.remainGoldLbl.color = new Color(255, 255, 255, 255);
        }

        this.node.scale = v3(1, 1, 1);
        this.node.getComponent(Sprite)!.color = new Color(255, 255, 255, 255);
        this.node.getChildByName('icon')!.getComponent(Sprite)!.color = new Color(255, 255, 255, 255);
        
        this.isShowUnlockTip = false;
    }

    update(dt: number) {
        // 累加时间
        this.checkTimer += dt;
        // 当累加时间达到检查间隔时执行检查，确保低帧率时不会漏掉检查次数
        while (this.checkTimer >= Config.UNLOCK_CHECK_INTERVAL) {
            this._checkPickupComponents();
            this.checkTimer -= Config.UNLOCK_CHECK_INTERVAL; // 减去一个间隔时间而不是重置为0
        }
    }
}
