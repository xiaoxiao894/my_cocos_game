import { _decorator, Vec3,Node, Quat, tween, Mat4, CCInteger, MeshRenderer, Material} from "cc";
import BackPack from "./BackPack";
import Entity from "../Common/Entity";
import { EntityTypeEnum, EventName, PlayerState } from "../Common/Enum";
import { IdleState } from "./PlayerState/IdleState";
import { MoveState } from "./PlayerState/MoveState";
import { MoveAttackState } from "./PlayerState/MoveAttackState";
import { AttackState } from "./PlayerState/AttackState";
import { DataManager } from "../Global/DataManager";
import { NodePoolManager } from "../Common/NodePoolManager";
import DropController from "../Map/DropController";
import { Monster } from "../Monster/Monster";
import { SoundManager } from "../Global/SoundManager";
import { EventManager } from "../Global/EventManager";
import Blood from "../Common/Blood";
const { ccclass, property } = _decorator;

@ccclass("Player")
export default class Player extends Entity {

    @property(BackPack)
    backPacks:BackPack[] = [];

    @property({type:CCInteger,displayName:"击退距离"})
    backDistance: number = 2;

    //血条初始位置
    @property({displayName:"血条位置"})
    private bloodOffset: Vec3 = new Vec3(0, 6, 0);

    @property({displayName:"血量"})
    maxHp:number = 200;

    @property(MeshRenderer)
    meshs: MeshRenderer[] = [];

    private _blood: Blood = null;

    protected entityName: EntityTypeEnum = EntityTypeEnum.Player;
    public destForward: Vec3 = new Vec3();
    // 移动速度
    moveSpeed = 20;
    // 旋转平滑系数
    public rotateSpeed = 14.0;

    public attackTargetList: Monster[] = [];

    // 闪红时间间隔
    private _redTimeLimit:number = 0.3;
    private _redTime:number = 0;

    protected onEnable(): void {
        DataManager.Instance.player = this.node;
        this.hp = this.maxHp;
    }

    protected onDisable(): void {

    }

    private creatBlood():void{
        //创建血条
        let bloodNode: Node = NodePoolManager.Instance.getNode(EntityTypeEnum.HP)
        bloodNode.parent = DataManager.Instance.sceneManager.bloodParent;
        bloodNode.active = true;
        this._blood = bloodNode.getComponent(Blood);
        this._blood?.init(EntityTypeEnum.Player,this.maxHp,this.maxHp,10);
        this.updateBloodPos();
    }

    protected startStateMachines(): void {
        super.startStateMachines();
        // 初始化状态机
         this.stateMachine.addState(PlayerState.Idle, new IdleState(this));
         this.stateMachine.addState(PlayerState.Move, new MoveState(this));
         this.stateMachine.addState(PlayerState.MoveAttack, new MoveAttackState(this));
         this.stateMachine.addState(PlayerState.Attack, new AttackState(this));
    }

    /** 移动 */
    public move(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState(PlayerState.Move,callback);
    }
    /** 移动攻击 */
    public moveAttack(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState(PlayerState.MoveAttack,callback);
    }
    /** 待机 */
    public idle() {
     
        this.stateMachine.setState(PlayerState.Idle);
    }
    /** 攻击 */
    public attack(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState(PlayerState.Attack,callback);
    }

    update(dt: number): void {
        super.update(dt);
        this._redTime+=dt;
        this.collectItems();
        if(!this._blood&&DataManager.Instance.isGameStart){
            this.creatBlood();
        }
        // 维护血条位置
        this.updateBloodPos();
    }

    /** 收集地面上的东西们(玉米粒、金币) */
    private collectItems():void{
        if(!DataManager.Instance.isGameStart){
            return;
        }
        // 一开始散落的玉米粒
        if(DataManager.Instance.cornController){
            let cornPos:Vec3 = DataManager.Instance.cornController.getAroundStartCorn(this.node.worldPosition);
            if(cornPos){
                // 收集玉米粒
                this.cornFly(cornPos);
            }
        }
        //金币
        let coin:Node = DropController.Instance.getAroundDrop(this.node.worldPosition);
        if(coin){
            this.itemFlyToMe(coin,EntityTypeEnum.Coin,coin.worldPosition);
        }
    }

    /** 飞玉米 */
    public cornFly(pos:Vec3,scaleBig:boolean = true):void{
        let corn:Node = NodePoolManager.Instance.getNode(EntityTypeEnum.Corn);
        if(scaleBig){
            corn.setScale(2,2,2);
        }else{
            corn.setScale(1,1,1);
        }
        
        this.itemFlyToMe(corn,EntityTypeEnum.Corn,pos);
    }



    /** 飞物品 */
    public itemFlyToMe(item:Node,type:EntityTypeEnum,start:Vec3){
        if(item){
             // === 贝塞尔飞行动画 ===
            const controller = { t: 0 };

            item.setParent(DataManager.Instance.sceneManager.effectNode);
            item.setWorldPosition(start);

            const startRot:Quat = item.worldRotation.clone(); // 初始角度
            let backpack:BackPack = this.getBackPack(type,true);
            if(!backpack){
                return;
            }
            const endRot:Quat = backpack.node.worldRotation;           // 最终角度
            const startScale = item.scale.clone();
            const endScale = new Vec3(1,1,1);

            let distance = Math.abs(backpack.node.getWorldPosition().y - start.y);
            // 使用指数衰减函数，提升高处下落速度（体验更利落）
            let runTime = 1.2 * (1 - Math.exp(-distance / 50));
            // 限定时间边界
            runTime = Math.min(Math.max(runTime, 0.3), 1.0);
            let localTarget = new Vec3();
            let worldPos;
            const worldRot = backpack.node.getWorldRotation();
            const worldScale = backpack.node.getWorldScale();
            const worldMat = new Mat4();
            let worldTarget = new Vec3();
            let control = new Vec3();
            let pos = new Vec3();
            let lerpedEuler = new Quat();

            tween(controller)
                .to(runTime, { t: 1 }, {
                    easing: 'quadOut',
                    onUpdate: () => {
                        const t = controller.t;
                        const oneMinusT = 1 - t;

                        // 当前背包堆叠高度
                        localTarget.y = backpack.getMaxY();

                        worldPos = backpack.node.getWorldPosition();
                        Mat4.fromSRT(worldMat, worldRot, worldPos, worldScale);
                        Vec3.transformMat4(worldTarget, localTarget, worldMat);
                        control.set((start.x + worldTarget.x) / 2,
                            Math.max(start.y, worldTarget.y) + 5,
                            (start.z + worldTarget.z) / 2);

                        pos.set(
                            oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x,
                            oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y,
                            oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z
                        );

                        item.setWorldPosition(pos);

                        // === 插值角度 ===
                        lerpedEuler.set(
                            startRot.x * oneMinusT + endRot.x * t,
                            startRot.y * oneMinusT + endRot.y * t,
                            startRot.z * oneMinusT + endRot.z * t,
                            startRot.w * oneMinusT + endRot.w * t
                        );
                        item.setWorldRotation(lerpedEuler);

                        if(startScale.x!==endScale.x){
                            //缩放
                            const lerpedScale = new Vec3(
                                startScale.x * oneMinusT + endScale.x * t,
                                startScale.y * oneMinusT + endScale.y * t,
                                startScale.z * oneMinusT + endScale.z * t
                            );
                            item.setWorldScale(lerpedScale);
                        }
                        
                    }
                })
                .call(() => {
                    const finalWorldPos = item.getWorldPosition().clone();
                    const addSuccess = backpack.addItem(item,type);
                    if(addSuccess){
                        item.setWorldPosition(finalWorldPos);
                        item.setWorldRotation(endRot);

                        tween(item)
                            .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                            .start();
                    }else{
                        NodePoolManager.Instance.returnNode(item,type);
                    }
                })
                .start();

            //音效
            if(type === EntityTypeEnum.Coin){
                SoundManager.inst.playAudio("jinbi_shiqu");
            }else{
                SoundManager.inst.playAudio("yumi_shiqu");
            }
        }
    }

    /** 获取背包 */
    private getBackPack(type:EntityTypeEnum,setType:boolean = false):BackPack{
        for(let i = 0;i<this.backPacks.length;i++){
            if(this.backPacks[i].Type === type){
                return this.backPacks[i];
            }
        }
        for(let i = 0;i<this.backPacks.length;i++){
            if(this.backPacks[i].Count === 0 && this.backPacks[i].Type === EntityTypeEnum.NONE){
                if(setType){
                    //顺便设置类型
                    this.backPacks[i].Type = type;
                }
                return this.backPacks[i];
            }
        }
    }

    /** 获得道具 */
    public getItemByType(type:EntityTypeEnum):Node{
        const backpack:BackPack = this.getBackPack(type);
        if(backpack){
            return backpack.returnOneItem();
        }
        return null;
    }

    /** 获取身上 */
    public getItemNumByType(type:EntityTypeEnum):number{
        const backpack:BackPack = this.getBackPack(type);
        if(backpack){
            return backpack.Count;
        }
        return 0;
    }

    //真实攻击事件
    public realAttackMonster():void{
        if(this.attackTargetList.length <= 0){
            return;
        }

        console.log("攻击回调，当前攻击目标数量:", this.attackTargetList.length);
        // 从后向前遍历并删除元素，避免索引问题
        for (let i = this.attackTargetList.length - 1; i >= 0; i--) {
            const target = this.attackTargetList[i];
            if (target) {
                target.hit(this,this.backDistance,this.node.worldPosition.clone());
                this.attackTargetList.splice(i, 1);
            }
        }
    }

    private updateBloodPos(){
        //同步更新血条位置
        if (this._blood) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this.bloodOffset);
            this._blood.node.setWorldPosition(bloodPos);
        }
    }

    hit(play:Entity) {

        if(this._redTime>=this._redTimeLimit){
            //闪红
            this.changeColor(1);
            setTimeout(() => {
                //恢复
                this.changeColor(0);
            }, 140);
            this._redTime = 0;
        }
        
        this.takeDamage(play.attackNum);
        this.setShowHp(play.attackNum);
    }

    private setShowHp(attack:number) {
        if (!this._blood) {
            return;
        }
        this._blood.node.active = true;
        if(this.hp <50){
            attack = 0.05;
        }
        this._blood.injuryAni(attack);
    }

    private changeColor( matIndex: number) {
        this.meshs.forEach((mesh: MeshRenderer) => {
            let matInstance: Material = mesh.getMaterialInstance(0);
            if(matIndex === 1){
                matInstance.setProperty('showType', 1.0);
            }else{
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
            }
        });
        
    }
}