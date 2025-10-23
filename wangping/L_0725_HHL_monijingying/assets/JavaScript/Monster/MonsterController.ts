import { _decorator,  CCFloat,  CCInteger,  Component,  Node, tween, Vec3 } from 'cc';
import { Simulator } from '../RVO/Simulator';
import RVOUtils from '../RVO/RVOUtils';
import { Monster } from './Monster';
import { NodePoolManager } from '../Common/NodePoolManager';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { Partner } from '../Partner/Partner';

const { ccclass, property } = _decorator;

@ccclass('MonsterController')
export class MonsterController extends Component{

    @property(Node)
    monsterParent: Node = null;

    @property(Node)
    posParentNode: Node = null;

    @property(Node)
    dropParent:Node = null;

    @property({displayName:"移动速度"})
    moveSpeed:number = 6;

    @property({displayName:"怪出现时间间隔",type:CCFloat})
    monsterDelayedTime:number = 0.2;

    @property(CCInteger)
    maxNumList:number[] = [];

    private monsterList: Monster[] = [];//怪物列表
    private _radius: number = 3; //怪半径
    /** 目标 */
    //private _targetNodes: Node[] = [];

    private _startMonster:boolean = false;
    private 
    private _addTime:number = 0;
    /** 第一个怪死了 */
    private _firstMonsterDie:boolean = false;

    private _nowMaxNum:number = 0;

    public get firstMonsterDie(): boolean {
        return this._firstMonsterDie;
    }

    public set firstMonsterDie(value: boolean) {
        this._firstMonsterDie = value;
    }

    protected start(): void {
        DataManager.Instance.monsterController = this;
        this._nowMaxNum = this.maxNumList[0];
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ShowMonster,this.showFirstMonster,this);
        EventManager.inst.on(EventName.TurretDataUpdate,this.updateMaxNum,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ShowMonster,this.showFirstMonster,this);
        EventManager.inst.off(EventName.TurretDataUpdate,this.updateMaxNum,this);
    }

    private updateMaxNum():void{
        const unlockNum = DataManager.Instance.turretController.getUnlockedTurretNum();
        this._nowMaxNum = this.maxNumList[unlockNum];
    }

    /** 展示第一个怪 */
    private showFirstMonster() {
        if(!this._startMonster){
            this.creatMonster();
            this._startMonster = true;
        }
    }

    public monsterStarted():boolean{
        return this._startMonster;
    }

    public getFirstMonsterPos():Vec3{
        if(this.monsterList.length > 0){
            return this.monsterList[0].node.worldPosition.clone();
        }
        return null;
    }

    /** 获取第一个怪 */
    public getFirstMonster():Monster{
        if(this.monsterList.length > 0){
            return this.monsterList[0];
        }
        return null;
    }

    //怪随机出现的位置
    private creatMonster() {

        if (this.posParentNode) {
            const randomIndex = Math.floor(Math.random() * this.posParentNode.children.length);
            // 设置 prefab 的位置为随机选择的位置
            this.realCreatMonster(this.posParentNode.children[randomIndex].worldPosition.clone());
        } else {
            console.error(`怪出生位置数组不存在或为空！`);
        }
    }

    /** 怪列表  */
    getMonsterList() {
        return this.monsterList;
    }

    /** 移除怪 */
    public removeMonster(monster: Monster) {
        const index = this.monsterList.indexOf(monster);
        if (index !== -1) {
            this.monsterList.splice(index, 1); // 从列表中移除
        }
        //console.log(`remove enemy ,num ${this.monsterList.length}`);
    }

    /** 真正创建怪 */
    private realCreatMonster(pos: Vec3) {
        let prefab = NodePoolManager.Instance.getNode(EntityTypeEnum.Monster)
        prefab.parent = this.monsterParent;
        prefab.setWorldPosition(pos);//init里用到了位置，放init前边
        prefab.active = true;
        let monster = prefab.getComponent(Monster);
        monster.init();
        this.monsterList.push(monster);
        //console.log(`push enemy ,num ${this.monsterList.length}`);
        


        //出现动画
        tween(prefab)
            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .call(() => {
                const mass = 1;
                const agentId = Simulator.instance.addAgent(
                    RVOUtils.v3t2(pos),
                    this._radius,
                    this.moveSpeed,
                    null,
                    mass
                );

                const agentObj = Simulator.instance.getAgentByAid(agentId);
                agentObj.neighborDist = this._radius * 5;
                monster.agentHandleId = agentId;
            })
            .start();
    }

    protected update(dt: number) {
        //rvo 更新
        Simulator.instance.run(dt);
        for (let index = 0; index < this.monsterList.length; index++) {
            const enemy = this.monsterList[index];
            enemy?.getComponent(Monster)?.moveByRvo(dt);
        }
        //血量刷新怪物逻辑
        this._addTime += dt;
        //间隔多少秒创建一波怪
        if (this._addTime >= this.monsterDelayedTime) {
            this._addTime = 0;
            if(this.canAddMonster()){
                this.creatMonster();
            }
        }
        EventManager.inst.emit(EventName.MoveByRVO,dt);
    }

    private canAddMonster():boolean{
        if(!this._startMonster){
            return false;
        }
        if(this.monsterList.length < this._nowMaxNum ){
            return true;
        }
    }

    /** 增加被攻击的人 */
    // public addPartnerTarget(node: Node) {
    //     this._targetNodes.push(node);
    // }

    // /** 移除被攻击的人 */
    // public removePartnerTarget(node: Node) {
    //     let index: number = this._targetNodes.indexOf(node);
    //     if (index >= 0) {
    //         this._targetNodes.splice(index, 1);
    //         //console.log(`移除目标 ${node.uuid}`);
    //     }

    // }

    // /** 是否在攻击列表 */
    // public hasTarget(node: Node) {
    //     return this._targetNodes.indexOf(node) !== -1;
    // }



}


