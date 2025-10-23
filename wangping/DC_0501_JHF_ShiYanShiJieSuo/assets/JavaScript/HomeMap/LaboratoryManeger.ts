import { _decorator, CCInteger, Collider, Component, ERigidBodyType, instantiate, math, Node, Prefab, RigidBody, SkeletalAnimation, Tween, tween, Vec3 } from "cc";
import Singleton from "../Base/Singleton";
import ItemPool from "../Common/ItemPool";
import { DataManager } from "../Global/DataManager";
import { EntityTypeEnum, EventNames } from "../Enum/Index";
import { EventManager } from "../Global/EventManager";
import { MeraItem } from "./Items/MeraItem";
import { MathUtil } from "../Utils/MathUtil";
import { MedicineItem } from "./Items/MedicineItem";

const { ccclass, property } = _decorator;

@ccclass('LaboratoryManeger')
export default class LaboratoryManeger extends Component {

    //药剂父节点
    @property(Node)
    medicineParent: Node;
    //操作员节点
    @property(Node)
    operatorNode: Node;
    // 生产药剂节点
    @property(Node)
    productNode: Node;

    @property(Node)
    meraParent:Node = null;

    //药剂飞出参数
    //纵向角度
    // @property(CCInteger)
    // medicineYAngle:number = 45;
    // //药剂速度
    // @property(CCInteger)
    // medicineSpeed:number = 20;
    // //药剂范围
    // @property(CCInteger)
    // medicineXAngle:number = 90;



    //药剂缓存池
    private _medicinePool: ItemPool;

    //待生产数量
    private _waitProductNum: number = 0;
    //生产时间间隔
    private _productTimer: number = 0.2;
    //生产计时
    private _productTime: number = 0;

    //地面上的药剂
    private _landMedicines:Node[]=[];
    private _medicineEndPos:Vec3 = new Vec3(25,1.5,-3);
    private _medicineScope:number = 6;

    private _meraItem:MeraItem = null;

    private _lastDeliveryCompletedTime:number = 0;
    

    onLoad() {
        DataManager.Instance.LaboratoryManeger = this;
        
    }

    public init():void{
        this._medicinePool = new ItemPool(EntityTypeEnum.Medicine); //药剂池
        let mera:Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Mera);
        let node :Node =instantiate(mera);
        this._meraItem = node.getComponent(MeraItem);
        this.meraParent.addChild(node);
        DataManager.Instance.canDeliverMoney=true;
        Vec3.add(this._medicineEndPos,this.medicineParent.getWorldPosition().clone(),this._medicineEndPos);
    }

    public getMedicineEndPos(){
        return this._medicineEndPos.clone();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventNames.MedicineCanPick,this.onMedicineCanPick,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventNames.MedicineCanPick,this.onMedicineCanPick,this);
    }

    //药剂落地
    private onMedicineCanPick(node:Node){
        this._landMedicines.push(node);
    }

    //捡起药剂
    public pickUpMedicine(node:Node){
        for(let i=0;i<this._landMedicines.length;i++){
            if(this._landMedicines[i]===node){
                this._landMedicines.splice(i,1);
                break;
            }
        }
    }

    /**
     * 
     * @returns 掉落在地上的药剂节点数组
     */
    public getLandMedicines():Node[]{
        return this._landMedicines;
    }


    /**
     * 
     * @returns 返回交付的世界坐标
     */
    public getDeliverWorldPos(): Vec3 {
        let node = this.meraParent.getChildByPath("Mera/qipao/qipaoNode");
        if(node){
            return node.getWorldPosition().clone();
        }
        return this.meraParent.getWorldPosition().clone();
    }

    public playerDeliverMoney(): void {
        //交付钱
        DataManager.Instance.canDeliverMoney=false;
        this._waitProductNum++;
        this._meraItem.addMoney();
    }

    /** 生产药剂 */
    private productMedicine(): void {
        let medicineItem: Node = this._medicinePool.getItem();
        medicineItem.setParent(this.medicineParent);
        let rigidBody: RigidBody = medicineItem.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.type = ERigidBodyType.KINEMATIC;
            rigidBody.setGroup(1 << 6);
            rigidBody.enabled = true; //启用刚体
        }
        let collider: Collider = medicineItem.getComponent(Collider);
        if (collider) {
            collider.enabled = true; //启用碰撞器
            collider.setMask( 1 << 2 | 1 << 6 | 1 << 7 | 1<<9);
            collider.isTrigger = false;
        }

        
        //药剂位置
        let pos = this.productNode.getWorldPosition().clone();
        medicineItem.setWorldPosition(pos);
        medicineItem.eulerAngles = new Vec3(0, 90, 0); //设置药剂的旋转角度
        //药剂飞出
        // 1. 随机水平方向（X-Z平面）
        // const radHorizonta:number = this.medicineXAngle * Math.PI / 180;
        // const horizontalAngle = math.random() * radHorizonta - radHorizonta / 2; // 随机

        // const xDir = Math.cos(horizontalAngle);
        // const zDir = Math.sin(horizontalAngle);
        // console.log(`horizontalAngle:${horizontalAngle} xDir:${xDir} zDir:${zDir}`);
        // // 2. 计算斜向上45度的速度分量（Y固定，X-Z随机）
        // const rad = this.medicineYAngle * Math.PI / 180; // 角度转弧度
        // const vy = this.medicineSpeed * Math.sin(rad);  // Y轴速度（向上）
        // const vHorizontal = this.medicineSpeed * Math.cos(rad); // 水平面总速度
        // const vx = vHorizontal * xDir; // X轴分量
        // const vz = vHorizontal * zDir; // Z轴分量
        
        // medicineItem.getComponent(RigidBody).setLinearVelocity(new Vec3(vx, vy, vz));
        // medicineItem.getComponent(RigidBody).applyForce(new Vec3(vx, vy, vz));
        let targetPos: Vec3 = new Vec3(0,0,0);
        Vec3.add(targetPos,this._medicineEndPos,new Vec3(Math.random()*this._medicineScope-this._medicineScope/2,0,Math.random()*this._medicineScope-this._medicineScope/2));
        const centerPosX = (pos.x + targetPos.x) / 2;
        const centerPosY = 18;
        const centerPosZ = (pos.z + targetPos.z) / 2;
        const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ);
        let tweenItem:Tween<Node> = tween(medicineItem)
            .to(0.4, { position: targetPos }, {
                easing: `cubicInOut`,
                onUpdate: (target, ratio) => {
                    const targetNode = target as Node;
                    const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio);
                    targetNode.worldPosition = position;
                }
            })
            .call(() => {
                medicineItem.getComponent(RigidBody).type = ERigidBodyType.DYNAMIC;

            })
            .start();
        medicineItem?.getComponent(MedicineItem)?.setTweenItem(tweenItem);
    }

    update(dt: number): void {
        if(!this._meraItem){
            return ;
        }
        this._productTime += dt;
        let time:number = Date.now() - this._lastDeliveryCompletedTime;
        if(this._waitProductNum > 0 && (DataManager.Instance.isDeliveryMoneyCompleted||time<3000)){
            this._lastDeliveryCompletedTime = Date.now();
            if (this._productTime >= this._productTimer) {
                this._productTime = 0;
                this.productMedicine();
                this._waitProductNum--;
            }
            this._meraItem?.playOperate();
            
        }else{
            this._meraItem?.playIdle();
        }

        if(this._waitProductNum <= 0 ){
            DataManager.Instance.canDeliverMoney=true;
        }
        
    }

    ///回收药剂
    public recycleMedicine(medicine: Node): void {
        this._medicinePool.putItem(medicine);
    }
}