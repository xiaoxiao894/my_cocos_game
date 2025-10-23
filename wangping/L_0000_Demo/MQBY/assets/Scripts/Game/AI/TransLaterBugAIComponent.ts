import { _decorator, v3, Vec3 } from 'cc';
import { BaseAIComponent } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { TransLater } from '../Role/TransLater';
import { BuildingType, ObjectType } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

export enum TransLaterBugAIState {
    Idle = 'Idle',
    ToCarryItems = 'ToCarryItems',
    ToTower = 'ToTower',
    /** 等待卸货完成 */
    WaitUnload = 'WaitUnload',
}

/** 单纯的甲虫搬运工AI，只会搬运东西 */
@ccclass('TransLaterBugAIComponent')
export class TransLaterBugAIComponent extends BaseAIComponent {
    protected _character: TransLater = null!;

    private _stateMachine: StateMachine<TransLaterBugAIState> = new StateMachine<TransLaterBugAIState>();

    onLoad() {
        super.onLoad();
        this.reset();
    }

    update(dt: number): void {
        super.update(dt);
        if (!this.aiEnabled) return;
        this._stateMachine.update(dt);
    }

    public reset() {
        this._stateMachine.changeState(TransLaterBugAIState.Idle);
    }

    protected makeDecision(): void {
        switch (this._stateMachine.currentState) {
            case TransLaterBugAIState.Idle:
                if (this.cherkItem()) {
                    this._stateMachine.changeState(TransLaterBugAIState.ToTower);
                } else {
                    this._stateMachine.changeState(TransLaterBugAIState.ToCarryItems);
                }
                break;
            case TransLaterBugAIState.ToTower:
                if (this.cherkArrive(this._getTowerWPos())) {
                    this._stateMachine.changeState(TransLaterBugAIState.WaitUnload);
                }
                // 还未走到指定位置，背包就空了
                else if (this.cherkEmpty()) {
                    this._stateMachine.changeState(TransLaterBugAIState.ToCarryItems);
                }
                break;
            case TransLaterBugAIState.WaitUnload:
                if (this.cherkEmpty()) {
                    this._stateMachine.changeState(TransLaterBugAIState.ToCarryItems);
                }
                break;
            case TransLaterBugAIState.ToCarryItems:
                if (this.cherkItem()) {
                    this._stateMachine.changeState(TransLaterBugAIState.ToTower);
                }
                else {
                    this.character.movementComponent.moveToWorldPosition(this._getCarryItemsWPos());
                }
                break;
        }
    }

    protected setupStateMachine(): void {
        this._stateMachine.registerState(TransLaterBugAIState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        this._stateMachine.registerState(TransLaterBugAIState.ToCarryItems, {
            onEnter: () => this.onToCarryItemsEnter(),
            onUpdate: (dt: number) => this.onToCarryItemsUpdate(dt),
            onExit: () => this.onToCarryItemsExit(),
        });

        this._stateMachine.registerState(TransLaterBugAIState.ToTower, {
            onEnter: () => this.onToTowerEnter(),
            onUpdate: (dt: number) => this.onToTowerUpdate(dt),
            onExit: () => this.onToTowerExit(),
        });

        this._stateMachine.registerState(TransLaterBugAIState.WaitUnload, {
            onEnter: () => this.onWaitUnloadEnter(),
            onUpdate: (dt: number) => this.onWaitUnloadUpdate(dt),
            onExit: () => this.onWaitUnloadExit(),
        });

        this._stateMachine.changeState(TransLaterBugAIState.Idle);
    }

    private _pickUpItemMax = 5;
    public set pickUpItemMax(value: number) {
        this._pickUpItemMax = value;
    }

    private _carryItemType: ObjectType = ObjectType.StackItemSwab;
    public set carryItemType(value: ObjectType) {
        this._carryItemType = value;
    }

    private _getCarryItemsWPos(): Vec3 {
        let nearestItemWPos = manager.game.getCarryItemsWPos(this._carryItemType, this.node.worldPosition).clone();
        // 移动到物品靠后一点的位置
        nearestItemWPos.z -= 2;
        return nearestItemWPos;
    }

    private _getTowerWPos(): Vec3 {
        return manager.game.getTowerWPos(this._carryItemType);
    }

    private cherkItem() {
        let carryItemType = ObjectType.DropItemSwab;
        if (this._carryItemType == ObjectType.StackItemSwab) {
            carryItemType = ObjectType.DropItemSwab;
        }
        else if (this._carryItemType == ObjectType.StackItemExplosionFruit) {
            carryItemType = ObjectType.DropItemExplosionFruit;
        }

        const item = this._character.pickupComponent.getItemCount(carryItemType);
        return item >= this._pickUpItemMax;
    }

    private cherkEmpty() {
        let carryItemType = ObjectType.DropItemSwab;
        if (this._carryItemType == ObjectType.StackItemSwab) {
            carryItemType = ObjectType.DropItemSwab;
        }
        else if (this._carryItemType == ObjectType.StackItemExplosionFruit) {
            carryItemType = ObjectType.DropItemExplosionFruit;
        }
        const item = this._character.pickupComponent.getItemCount(carryItemType);
        return item <= 0;
    }

    private cherkArrive(wpos: Vec3) {
        return this.character.movementComponent.cherkArrive(wpos);
    }

    //#region 状态回调
    private onIdleEnter(): void { }
    private onIdleUpdate(dt: number): void { }
    private onIdleExit(): void { }

    private onToCarryItemsEnter(): void {
        this.character.movementComponent.moveToWorldPosition(this._getCarryItemsWPos());
    }
    private onToCarryItemsUpdate(dt: number): void {
    }
    private onToCarryItemsExit(): void { }

    private onToTowerEnter(): void {
        this.character.movementComponent.moveToWorldPosition(this._getTowerWPos());
    }
    private onToTowerUpdate(dt: number): void {
    }
    private onToTowerExit(): void { }

    private onWaitUnloadEnter(): void {
    }
    private onWaitUnloadUpdate(dt: number): void {
    }
    private onWaitUnloadExit(): void { }
    //#endregion
    //#region 公用方法
    //#endregion
} 