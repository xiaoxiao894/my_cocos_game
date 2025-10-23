import { _decorator, Component, Node, Vec3 } from 'cc';
import { Partner } from './Partner';
import { DataManager } from '../Global/DataManager';
import { NodePoolManager } from '../Common/NodePoolManager';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { EventManager } from '../Global/EventManager';
import { Monster } from '../Monster/Monster';
const { ccclass, property } = _decorator;

@ccclass('PartnerControler')
export class PartnerControler extends Component {

    @property(Node)
    partnerPos: Node[] = [];

    @property(Node)
    cornPosNode: Node[] = [];

    @property(Node)
    parentNode:Node = null;

    private _partners:Partner[] = [];

    private _targetMonsters: Monster[] = [];


    start() {
        DataManager.Instance.partnerController = this;
    }

    protected onEnable(): void {
        //EventManager.inst.on(EventName.UnlockFirstPartner, this.partnerToNeedCorn, this);
    }

    protected onDisable(): void {
        //EventManager.inst.off(EventName.UnlockFirstPartner, this.partnerToNeedCorn, this);
    }

    /** 初始化城内伙伴 */
    public init():void{
        for(let i = 0; i < this.partnerPos.length; i++){
            let node = NodePoolManager.Instance.getNode(EntityTypeEnum.Partner);
            if(node){
                node.setParent(this.parentNode);
                node.setWorldPosition(this.partnerPos[i].worldPosition);
                let partner = node.getComponent(Partner);
                if(partner){
                    partner.init(i, this.cornPosNode[i],this.partnerPos[i].worldRotation.clone());
                    this._partners.push(partner);
                }
            }
        }
    }

    /** 还需要多少玉米 */
    public getNeedNumByIndex(index:number):number{
        let partner = this._partners[index];
        if(partner){
            const needNum = partner.getNeedNum();
            if(needNum<=0&&partner.unlocked){
                this.partnerPos[index].active = false;
            }
            return needNum;
        }
        return 0;
    }

    /** 添加玉米 */
    public addCornByIndex(index:number){
        let partner = this._partners[index];
        if(partner){
            partner.addCorn(1);
        }
    }

    /** 获取可被攻击的伙伴节点 */
    public getPartners():Partner[]{
        let partners:Partner[] = [];
        for(let i = 0; i < this._partners.length; i++){
            if(this._partners[i].unlocked){
                partners.push(this._partners[i]);
            }
        }
        return partners;
    }



    /** 其他伙伴到带解锁阶段 */
    private _partnerToNeedCorn:boolean = false;
    private partnerToNeedCorn():void{
        if(this._partnerToNeedCorn){
            return;
        }
        this._partnerToNeedCorn = true;
        
        for(let i = 1; i < this._partners.length; i++){
            if(!this._partners[i].unlocked){
                this._partners[i].needCorn();
            }
        }
    }

    /** 获取伙伴已解锁数量 */
    public getUnlockedNum():number{
        let count = 0;
        for(let i = 0; i < this._partners.length; i++){
            if(this._partners[i].unlocked){
                count++;
            }
        }
        return count;
    }

    /** 获取下一个待解锁的index */
    public getNextNeedUnlockIndex():number{
        for(let i = 0; i < this._partners.length; i++){
            if(!this._partners[i].unlocked){
                return i;
            }
        }
        return -1;
    }

    /** 获取伙伴位置 */
    public getPartnerPosByIndex(index:number):Vec3{
        const partner = this._partners[index];
        if(partner){
            return partner.node.worldPosition.clone();
        }
        return null;
    }

    public addMonsterTarget(monster: Monster) {
        this._targetMonsters.push(monster);
        //console.log(`增加目标 ${node.uuid}`);
    }

    public removeMonsterTarget(monster: Monster) {
        let index: number = this._targetMonsters.indexOf(monster);
        if (index >= 0) {
            this._targetMonsters.splice(index, 1);
            //console.log(`移除目标 ${node.uuid}`);
        } else {
            if (monster) {
                // console.log(`目标 ${node.uuid} 不存在`);
            } else {
                // console.log(`目标为空`);
            }
        }

    }
    public hasTarget(monster: Monster) {
        return this._targetMonsters.indexOf(monster) !== -1;
    }
}