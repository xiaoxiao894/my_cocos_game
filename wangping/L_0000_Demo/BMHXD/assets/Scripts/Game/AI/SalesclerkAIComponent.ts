import { _decorator, v3, Vec3 } from 'cc';
import { BaseAIComponent } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { Salesclerk } from '../Role/Salesclerk';
import { ObjectType } from '../../common/CommonEnum';
import { ComponentEvent } from '../../common/ComponentEvents';

const { ccclass, property } = _decorator;

export enum SalesclerkAIState {
    Idle = 'Idle',
    GoSoupShop = 'GoSoupShop',
    WaitSoup = 'WaitSoup',
    GoKitchen = 'GoKitchen',
    WaitInKitchen = 'WaitInKitchen',
    GoBackToSoup = 'GoBackToSoup',
}

@ccclass('SalesclerkAIComponent')
export class SalesclerkAIComponent extends BaseAIComponent {
    protected _character: Salesclerk = null!;

    private _stateMachine: StateMachine<SalesclerkAIState> = new StateMachine<SalesclerkAIState>();

    private _currCornWPos: Vec3 = null!;
    private _currChuShiWPos: Vec3 = null!;

    private get currCornWPos(): Vec3 {
        if(this._currCornWPos){
            return this._currCornWPos;
        }
        this._currCornWPos = manager.game.bigCorn.getAttackPoint();
        return this._currCornWPos;
    }

    private get currChuShiWPos(): Vec3 {
        if(this._currChuShiWPos){
            return this._currChuShiWPos;
        }
        this._currChuShiWPos = manager.game.kaoLu.putOutCollider.node.getWorldPosition();
        return this._currChuShiWPos;
    }

    onLoad() {
        super.onLoad();
        this.reset();
    }

    update(dt: number): void {
        super.update(dt);
        if(!this.aiEnabled) return;
        this._stateMachine.update(dt);
    }

    public reset(){
        this._stateMachine.changeState(SalesclerkAIState.Idle);
    }
    
    protected makeDecision(): void {
        switch (this._stateMachine.currentState) {
            case SalesclerkAIState.Idle:
                // 检查汤店是否有汤或者自己身上是否有汤
                if (this.hasSoupInShop() || this.hasSoupToSell()) {
                    // 有汤就去汤店
                    if (this.checkArrive()) {
                        this._stateMachine.changeState(SalesclerkAIState.WaitSoup);
                    } else {
                        this._stateMachine.changeState(SalesclerkAIState.GoSoupShop);
                    }
                } else {
                    // 没汤就去厨房
                    if (this.checkArriveKitchen()) {
                        this._stateMachine.changeState(SalesclerkAIState.WaitInKitchen);
                    } else {
                        this._stateMachine.changeState(SalesclerkAIState.GoKitchen);
                    }
                }
                break;

            case SalesclerkAIState.GoSoupShop:
                if (this.checkArrive()) {
                    this._stateMachine.changeState(SalesclerkAIState.WaitSoup);
                }
                break;

            case SalesclerkAIState.WaitSoup:
                // 等待汤店的汤卖完且身上的汤也没有了
                // 注意：hasSoupInShop() 已经包含了飞行中的汤检测
                if (!this.hasSoupInShop() && !this.hasSoupToSell()) {
                    this._stateMachine.changeState(SalesclerkAIState.GoKitchen);
                }
                break;

            case SalesclerkAIState.GoKitchen:
                if (this.checkArriveKitchen()) {
                    this._stateMachine.changeState(SalesclerkAIState.WaitInKitchen);
                }
                break;

            case SalesclerkAIState.WaitInKitchen:
                // 等身上有10个soup后去汤店
                if (this.getSoupCount() >= 10) {
                    this._stateMachine.changeState(SalesclerkAIState.GoBackToSoup);
                }
                break;

            case SalesclerkAIState.GoBackToSoup:
                if (this.checkArrive()) {
                    this._stateMachine.changeState(SalesclerkAIState.WaitSoup);
                }
                break;
        }
    }

    protected setupStateMachine(): void {

        this._stateMachine.registerState(SalesclerkAIState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        this._stateMachine.registerState(SalesclerkAIState.GoSoupShop, {
            onEnter: () => this.onGoSoupShopEnter(),
            onUpdate: (dt: number) => this.onGoSoupShopUpdate(dt),
            onExit: () => this.onGoSoupShopExit(),
        });

        this._stateMachine.registerState(SalesclerkAIState.WaitSoup, {
            onEnter: () => this.onWaitSoupEnter(),
            onUpdate: (dt: number) => this.onWaitSoupUpdate(dt),
            onExit: () => this.onWaitSoupExit(),
        });

        this._stateMachine.registerState(SalesclerkAIState.GoKitchen, {
            onEnter: () => this.onGoKitchenEnter(),
            onUpdate: (dt: number) => this.onGoKitchenUpdate(dt),
            onExit: () => this.onGoKitchenExit(),
        });

        this._stateMachine.registerState(SalesclerkAIState.WaitInKitchen, {
            onEnter: () => this.onWaitInKitchenEnter(),
            onUpdate: (dt: number) => this.onWaitInKitchenUpdate(dt),
            onExit: () => this.onWaitInKitchenExit(),
        });

        this._stateMachine.registerState(SalesclerkAIState.GoBackToSoup, {
            onEnter: () => this.onGoBackToSoupEnter(),
            onUpdate: (dt: number) => this.onGoBackToSoupUpdate(dt),
            onExit: () => this.onGoBackToSoupExit(),
        });

        this._stateMachine.changeState(SalesclerkAIState.Idle);
    }

    private checkArrive(){
        if(Vec3.distance(this._character.node.getWorldPosition(), manager.game.soupShop.salesclerkTarget.getWorldPosition()) < 0.3){
            return true;
        }
        return false;
    }

    private checkArriveKitchen(){
        if(Vec3.distance(this._character.node.getWorldPosition(), this.currChuShiWPos) < 0.3){
            return true;
        }
        return false;
    }

    // 检查汤店是否有汤（包括飞行中的汤）
    private hasSoupInShop(): boolean {
        const soupShop = manager.game.soupShop;
        if (!soupShop) {
            return false;
        }
        
        // 使用汤店的公共方法获取总汤数（包括飞行中的汤）
        return soupShop.getTotalSoupCount() > 0;
    }

    // 检查身上的汤数量
    private getSoupCount(): number {
        return this._character.pickupComponent.getItemCount(ObjectType.DropItemCornSoup);
    }

    // 检查身上是否有足够的汤去汤店
    private hasSoupToSell(): boolean {
        return this.getSoupCount() > 0;
    }

    // 检查是否需要去厨房拿汤
    private needToGoKitchen(): boolean {
        return this.getSoupCount() < 10;
    }

    //#region 状态回调
    private onIdleEnter(): void { }
    private onIdleUpdate(dt: number): void { }
    private onIdleExit(): void { }
    
    private onGoSoupShopEnter(): void { 
        this._character.movementComponent.moveToWorldPosition(manager.game.soupShop.salesclerkTarget.getWorldPosition());
    }
    private onGoSoupShopUpdate(dt: number): void { 
        if(!this._character.movementComponent.isMoving && !this.checkArrive()){
            this._character.movementComponent.moveToWorldPosition(manager.game.soupShop.salesclerkTarget.getWorldPosition());
        }
    }
    private onGoSoupShopExit(): void { }
    
    private onWaitSoupEnter(): void { }
    private onWaitSoupUpdate(dt: number): void {
        const direction = v3(1, 0, 1).normalize();
        this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
    }
    private onWaitSoupExit(): void { }
    
    private onGoKitchenEnter(): void {
        this._character.movementComponent.moveToWorldPosition(this.currChuShiWPos);
    }
    private onGoKitchenUpdate(dt: number): void {
        if(!this._character.movementComponent.isMoving && !this.checkArriveKitchen()){
            this._character.movementComponent.moveToWorldPosition(this.currChuShiWPos);
        }
    }
    private onGoKitchenExit(): void { }
    
    private onWaitInKitchenEnter(): void {
        // 开启自动拾取功能，让店员在厨房等待时自动拾取汤
        if (this._character.pickupComponent) {
            this._character.pickupComponent.autoPickup = true;
        }
    }
    private onWaitInKitchenUpdate(dt: number): void {
        // 保持面向厨房方向或者保持不动
        const direction = v3(-1, 0, -1).normalize();
        this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
    }
    private onWaitInKitchenExit(): void { }
    
    private onGoBackToSoupEnter(): void {
        this._character.movementComponent.moveToWorldPosition(manager.game.soupShop.salesclerkTarget.getWorldPosition());
    }
    private onGoBackToSoupUpdate(dt: number): void {
        if(!this._character.movementComponent.isMoving && !this.checkArrive()){
            this._character.movementComponent.moveToWorldPosition(manager.game.soupShop.salesclerkTarget.getWorldPosition());
        }
    }
    private onGoBackToSoupExit(): void { }
    //#endregion
    
    //#region 公用方法
    //#endregion
} 