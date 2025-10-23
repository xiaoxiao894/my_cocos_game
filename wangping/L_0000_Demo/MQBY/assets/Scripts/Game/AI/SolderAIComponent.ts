import { _decorator, Label, v3, Vec3, Node, tween } from 'cc';
import { BaseAIComponent } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { Solder } from '../Role/Solder';
import { ComponentEvent } from '../../common/ComponentEvents';

const { ccclass, property } = _decorator;

export enum SolderAIState {
    Idle = 'idle',
    GoSoupShop = 'goSoupShop',
    WaitSoup = 'waitSoup',
    GoMove = 'goMove',
}

@ccclass('SolderAIComponent')
export class SolderAIComponent extends BaseAIComponent {

    @property({
        type: Label,
        displayName: '需要汤数量标签',
        tooltip: '显示士兵需要汤数量的Label组件'
    })
    public needSoupNumLabel: Label = null!;

    @property({
        type: Node,
        displayName: '汤数量节点',
        tooltip: '显示士兵汤数量的节点'
    })
    public soupNumNode: Node = null!;

    @property({
        type: Node,
        displayName: '开心节点',
        tooltip: '显示士兵开心的节点'
    })
    public happyNode: Node = null!;

    protected _character: Solder = null!;

    private _stateMachine: StateMachine<SolderAIState> = new StateMachine<SolderAIState>();

    public needSoupNum: number = 3;
    public soupNum: number = 0;
    public waitSoup: number = 0;
    public waitIndex: number = -1;

    private _currWaitWPos: Vec3 = v3(0,0,0);

    private get _arriveDistance(): number {
        return this.character.movementComponent.ArriveDistance + 0.2 || 0.5;
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
        this.soupNum = 0;
        this.waitSoup = 0;
        this.waitIndex = 0;
        this.needSoupNum = Math.floor(Math.random() * 3) + 1;
        this.updateSoupNumLabel();
        this.happyNode.active = false;
        this.soupNumNode.active = false;
        this._stateMachine.changeState(SolderAIState.Idle);
    }
    
    protected makeDecision(): void {
        switch (this._stateMachine.currentState) {
            case SolderAIState.Idle:
                const shop = manager.game.soupShop;
                if (this.soupNum < this.needSoupNum && shop) {
                    manager.game.soupShop.AddWaitSolder(this.node);
                    this._stateMachine.changeState(SolderAIState.GoSoupShop);
                }
                break;
            case SolderAIState.GoSoupShop:
                if(this.getWaitDistance() <= this._arriveDistance){
                    this._stateMachine.changeState(SolderAIState.WaitSoup);
                }
                break;
            case SolderAIState.WaitSoup:
                if(this.getWaitDistance() > this._arriveDistance){
                    this._stateMachine.changeState(SolderAIState.GoSoupShop);
                }
                break;
        }
    }
    protected setupStateMachine(): void {

        this._stateMachine.registerState(SolderAIState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        this._stateMachine.registerState(SolderAIState.GoSoupShop, {
            onEnter: () => this.onGoSoupShopEnter(),
            onUpdate: (dt: number) => this.onGoSoupShopUpdate(dt),
            onExit: () => this.onGoSoupShopExit(),
        });

        this._stateMachine.registerState(SolderAIState.WaitSoup, {
            onEnter: () => this.onWaitSoupEnter(),
            onUpdate: (dt: number) => this.onWaitSoupUpdate(dt),
            onExit: () => this.onWaitSoupExit(),
        });
        
        this._stateMachine.changeState(SolderAIState.Idle);
    }

    private getWaitDistance(): number {
        return Vec3.distance(this.node.getWorldPosition(), this._currWaitWPos);
    }

    private showHappy(): void {
        // 如果已经在显示状态，不重复播放动画
        this.soupNumNode.active = false;
        if (this.happyNode.active) {
            return;
        }
        
        this.happyNode.active = true;
        this.happyNode.setScale(0,0,0);
        tween(this.happyNode)
        .to(0.5, {scale:v3(1,1,1)},{easing:'backOut'})
        .start();
    }

    private showSoupNum(): void {
        // 如果已经在显示状态，不重复播放动画
        this.happyNode.active = false;
        if (this.soupNumNode.active) {
            return;
        }
        
        this.soupNumNode.active = true;
        this.soupNumNode.setScale(0,0,0);
        tween(this.soupNumNode)
        .to(0.5, {scale:v3(1,1,1)},{easing:'backOut'})
        .start();
    }

    //#region 状态回调
    private onIdleEnter(): void {

    }
    private onIdleUpdate(dt: number): void {
        
    }
    private onIdleExit(): void {
        
    }
    private onGoSoupShopEnter(): void {
        this.character.movementComponent.moveToWorldPosition(this._currWaitWPos);
    }
    private onGoSoupShopUpdate(dt: number): void {
        // 检查移动是否被打断，如果距离还比较远但没有在移动，则重新开始移动
        const distance = this.getWaitDistance();
        if (distance > this._arriveDistance && !this.character.movementComponent.isMoving) {
            this.character.movementComponent.moveToWorldPosition(this._currWaitWPos);
        }
    }
    private onGoSoupShopExit(): void {
        
    }
    private onWaitSoupEnter(): void {
        this.showSoupNum();
    }
    private onWaitSoupUpdate(dt: number): void {
        const direction = manager.game.soupShop.attackPos.getWorldPosition().subtract(this._character.node.getWorldPosition()).normalize();
        this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
    }
    private onWaitSoupExit(): void {

    }
    //#endregion
    //#region 公用方法
    public isCanAddSoup(): boolean {
        return this.soupNum + this.waitSoup < this.needSoupNum && this._stateMachine.currentState === SolderAIState.WaitSoup;
    }
    public setWaitPos(pos: Vec3, index: number){
        this._currWaitWPos = pos;
        this.waitIndex = index;
    }
    public waitAddSoup(){
        this.waitSoup += 1;
    }
    public addSoup(){
        this.soupNum += 1;
        this.waitSoup -= 1;
        this.updateSoupNumLabel();
        if(this.soupNum >= this.needSoupNum){
            this._stateMachine.changeState(SolderAIState.Idle);
            this.showHappy();
            app.audio.playEffect('resources/audio/生产小兵');
            const random =  Math.random()
            const movePos = manager.game.soupShop.MovePos.add(v3(-10 * random, 0, 10 * random));
            // this.character.animationComponent.MoveAnimName = 'run1';
            this.character.movementComponent.moveToWorldPosition(movePos, ()=>{
                this._character.switchAIMode(true);
                this.happyNode.active = false;
                this.soupNumNode.active = false;
            });
            return true;
        }
        return false;
    }

    private updateSoupNumLabel(): void {
        if (this.needSoupNumLabel) {
            this.needSoupNumLabel.string = `${this.needSoupNum - this.soupNum}`;
        }
    }
    //#endregion
} 