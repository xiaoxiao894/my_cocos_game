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
        // this._currCornWPos = manager.game.bigCorn.getAttackPoint();
        return this._currCornWPos;
    }

    private get currChuShiWPos(): Vec3 {
        if(this._currChuShiWPos){
            return this._currChuShiWPos;
        }
        // this._currChuShiWPos = manager.game.chuShi.node.getWorldPosition();
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
                if(this.cherkArrive()){
                    this._stateMachine.changeState(SalesclerkAIState.WaitSoup);
                }else{
                    this._stateMachine.changeState(SalesclerkAIState.GoSoupShop);
                }
                break;
            case SalesclerkAIState.GoSoupShop:
                if(this.cherkArrive()){
                    this._stateMachine.changeState(SalesclerkAIState.WaitSoup);
                }
                break;
            case SalesclerkAIState.WaitSoup:
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

        this._stateMachine.changeState(SalesclerkAIState.Idle);
    }

    private cherkArrive(){
        // if(Vec3.distance(this._character.node.getWorldPosition(), manager.game.soupShop.node.getWorldPosition()) < 1){
        //     return true;
        // }
        return false;
    }

    //#region 状态回调
    private onIdleEnter(): void { }
    private onIdleUpdate(dt: number): void { }
    private onIdleExit(): void { }
    private onGoSoupShopEnter(): void { 
        // this._character.movementComponent.moveToWorldPosition(manager.game.soupShop.node.getWorldPosition());
    }
    private onGoSoupShopUpdate(dt: number): void { 
        if(!this._character.movementComponent.isMoving && !this.cherkArrive()){
            // this._character.movementComponent.moveToWorldPosition(manager.game.soupShop.node.getWorldPosition());
        }
    }
    private onGoSoupShopExit(): void { }
    private onWaitSoupEnter(): void { }
    private onWaitSoupUpdate(dt: number): void {
        // const direction = manager.game.soupShop.WaitPos.getWorldPosition().subtract(this._character.node.getWorldPosition()).normalize();
        // this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
    }
    private onWaitSoupExit(): void { }
    //#endregion
    //#region 公用方法
    //#endregion
} 