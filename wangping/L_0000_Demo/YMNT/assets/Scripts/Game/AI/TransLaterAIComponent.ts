import { _decorator, v3, Vec3 } from 'cc';
import { BaseAIComponent } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { TransLater } from '../Role/TransLater';
import { ObjectType } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

export enum TransLaterAIState {
    Idle = 'Idle',
    GoCorn = 'GoCorn',
    AttackCorne = 'AttackCorne',
    GoChuShi = 'GoChuShi',
    WaitChuShi = 'WaitChuShi',
}

@ccclass('TransLaterAIComponent')
export class TransLaterAIComponent extends BaseAIComponent {
    protected _character: TransLater = null!;

    private _stateMachine: StateMachine<TransLaterAIState> = new StateMachine<TransLaterAIState>();

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
        this._currChuShiWPos = manager.game.chuShi.putInCollider.node.getWorldPosition();
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
        this._stateMachine.changeState(TransLaterAIState.Idle);
    }
    
    protected makeDecision(): void {
        switch (this._stateMachine.currentState) {
            case TransLaterAIState.Idle:
                if(this.cherkItem()){
                    this._stateMachine.changeState(TransLaterAIState.GoChuShi);
                }else{
                    this._stateMachine.changeState(TransLaterAIState.GoCorn);
                }
                break;
            case TransLaterAIState.GoCorn:
                if(this.cherkArrive(this.currCornWPos)){
                    this._stateMachine.changeState(TransLaterAIState.AttackCorne);
                }
                break;
            case TransLaterAIState.AttackCorne:
                if(this.cherkItem()){
                    this._stateMachine.changeState(TransLaterAIState.GoChuShi);
                }
                break;
            case TransLaterAIState.GoChuShi:
                if(this.cherkArrive(this.currChuShiWPos)){
                    this._stateMachine.changeState(TransLaterAIState.WaitChuShi);
                }
                break;
            case TransLaterAIState.WaitChuShi:
                if(this.cherkEmpty()){
                    this._stateMachine.changeState(TransLaterAIState.GoCorn);
                }
                break;
        }
    }

    protected setupStateMachine(): void {

        this._stateMachine.registerState(TransLaterAIState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        this._stateMachine.registerState(TransLaterAIState.GoCorn, {
            onEnter: () => this.onGoCornerEnter(),
            onUpdate: (dt: number) => this.onGoCornerUpdate(dt),
            onExit: () => this.onGoCornerExit(),
        });

        this._stateMachine.registerState(TransLaterAIState.AttackCorne, {
            onEnter: () => this.onAttackCorneEnter(),
            onUpdate: (dt: number) => this.onAttackCorneUpdate(dt),
            onExit: () => this.onAttackCorneExit(),
        });

        this._stateMachine.registerState(TransLaterAIState.GoChuShi, {
            onEnter: () => this.onGoChuShiEnter(),
            onUpdate: (dt: number) => this.onGoChuShiUpdate(dt),
            onExit: () => this.onGoChuShiExit(),
        });

        this._stateMachine.registerState(TransLaterAIState.WaitChuShi, {
            onEnter: () => this.onWaitChuShiEnter(),
            onUpdate: (dt: number) => this.onWaitChuShiUpdate(dt),
            onExit: () => this.onWaitChuShiExit(),
        });
        
        this._stateMachine.changeState(TransLaterAIState.Idle);
    }

    private cherkItem(){
        const item = this._character.pickupComponent.getItemCount(ObjectType.DropItemCornKernel);
        return item >= 10;
    }

    private cherkEmpty(){
        const item = this._character.pickupComponent.getItemCount(ObjectType.DropItemCornKernel);
        return item <= 0;
    }

    private cherkArrive(wpos: Vec3){
        return this.character.movementComponent.cherkArrive(wpos);
    }

    //#region 状态回调
    private onIdleEnter(): void { }
    private onIdleUpdate(dt: number): void { }
    private onIdleExit(): void { }
    private onGoCornerEnter(): void {
        this.character.movementComponent.moveToWorldPosition(this.currCornWPos);
    }
    private onGoCornerUpdate(dt: number): void {
        if(!this.character.movementComponent.isMoving && !this.cherkArrive(this.currCornWPos)){
            this.character.movementComponent.moveToWorldPosition(this.currCornWPos);
        }
    }
    private onGoCornerExit(): void { }
    private onAttackCorneEnter(): void { }
    private onAttackCorneUpdate(dt: number): void {
        if(this.character.attackComponent.canAttack()){
            this.character.attack();
        }
    }
    private onAttackCorneExit(): void { }
    private onGoChuShiEnter(): void {
        this.character.movementComponent.moveToWorldPosition(this.currChuShiWPos);
    }
    private onGoChuShiUpdate(dt: number): void {
        if(!this.character.movementComponent.isMoving && !this.cherkArrive(this.currChuShiWPos)){
            this.character.movementComponent.moveToWorldPosition(this.currChuShiWPos);
        }
    }
    private onGoChuShiExit(): void { }
    private onWaitChuShiEnter(): void { }
    private onWaitChuShiUpdate(dt: number): void { }
    private onWaitChuShiExit(): void { }
    //#endregion
    //#region 公用方法
    //#endregion
} 