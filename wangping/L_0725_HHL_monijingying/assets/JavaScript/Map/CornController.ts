import { _decorator, Component, math, Node, Quat, tween, Vec2, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { NodePoolManager } from '../Common/NodePoolManager';
import { EntityTypeEnum } from '../Common/Enum';
import { MathUtils } from '../Util/MathUtils';
import { GroundItems } from './GroundItems';
import { SoundManager } from '../Global/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('CornController')
export class CornController extends Component {

    /** 整个大玉米 */
    @property(Node)
    wholeCorn:Node = null;

    /** 地上玉米粒父节点 */
    @property(GroundItems)
    groudCorn:GroundItems = null;

    /** 玉米上玉米粒父节点 */
    @property(Node)
    cornParent:Node = null;

    /** 起始散落玉米粒父节点 */
    @property(Node)
    startCornParent:Node = null;

    @property(Node)
    downCornPosNode:Node = null;

    /** 可收取玉米粒列表 */
    private _canAttackCorns:Node[] = [];
    /** 隐藏的玉米粒 */
    private _hideCorns:Node[] = [];
    /** 玉米粒生产计时 */
    private _cornTime:number = 0;
    /** 玉米粒生产间隔时间 */
    private _cornInterval:number = 1.5;
    private _cornIntervalMax:number = 0.5;
    private _cornIntervalNumChange:number = 10;
    /** 玉米粒生产数量 */
    private _productNum:number = 2;

    protected onLoad(): void {
        DataManager.Instance.cornController = this;
        this.init();
    }

    start() {

    }

    private init():void {
        let parents:Node[] = this.cornParent.children;
        for(let i=0;i<parents.length;i++){
            for(let j=0;j<parents[i].children.length;j++){
                this._canAttackCorns.push(parents[i].children[j].children[0]);
            }
        }
        this.groudCorn.init(EntityTypeEnum.Corn,DataManager.cornHeight);
    }

    update(dt: number) {
        if(this._hideCorns.length > 0){
            this._cornTime+=dt;
            if((this._hideCorns.length>=this._cornIntervalNumChange&&this._cornTime >= this._cornIntervalMax)||this._cornTime >= this._cornInterval){
                this._cornTime = 0;
                const productNum:number = Math.min(this._productNum, this._hideCorns.length);
                for(let i=0;i<productNum;i++){
                    this.showOneCorn();
                }
            }
        }
    }

    /** 出现玉米粒 */
    private showOneCorn(){
        if(this._hideCorns.length <= 0){
            return;
        }

        //随机出现一个玉米粒
        const rotat:number = Math.floor(math.random() * this._hideCorns.length);
        const corn:Node = this._hideCorns.splice(rotat,1)[0];
        corn.active = true;
        tween(corn)
        .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
        .call(()=>{
            this._canAttackCorns.push(corn);
        })
        .start();
    }

    /** 攻击大玉米 */
    public attackCorn(pos:Vec3,isPlayer:boolean = false):Vec3[]{
        if(isPlayer||DataManager.Instance.partnerAttackCornNum<3){
            SoundManager.inst.playAudio("yumishouji");
        }
        if(!isPlayer){
            DataManager.Instance.partnerAttackCornNum++;
        }

        tween(this.wholeCorn)
        .to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) }, { easing: 'quadOut' })
        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
        .start();
        if(this._canAttackCorns.length <= 0){
            console.log('没有可攻击的玉米粒');
            return null;
        }

        //获取最近的2粒玉米粒
        let minDist = Infinity;
        let minIndex:number = -1;
        let min2Dist = Infinity;
        let min2Index:number = -1;
        const v2Pos:Vec2 = new Vec2(pos.x,pos.z);
        let cornPos:Vec2 = new Vec2();
        for(let i=0;i<this._canAttackCorns.length;i++){
            cornPos.set(this._canAttackCorns[i].worldPosition.x,this._canAttackCorns[i].worldPosition.z);
            const dist = Vec2.squaredDistance(cornPos,v2Pos);
            if(dist < minDist){
                min2Dist = minDist;
                min2Index = minIndex;
                minDist = dist;
                minIndex = i;
            }else if(dist < min2Dist){
                min2Dist = dist;
                min2Index = i;
            }
        }
        let minCorn:Node;
        [minCorn] = this._canAttackCorns.splice(minIndex,1);
        this.dropCornKernel(minCorn,isPlayer);
        if(min2Index>minIndex){
            min2Index--;
        }
        if(min2Index<0){
            return;
        }
        if(isPlayer){
            let min2Corn:Node;
            [min2Corn] = this._canAttackCorns.splice(min2Index,1);
            this.dropCornKernel(min2Corn,isPlayer);
        } 
    }

    /** 掉落玉米粒 */
    private dropCornKernel(node:Node,isPlayer:boolean){
        node.active = false;
        this._hideCorns.push(node);

        //玉米飞到地上
        let corn:Node = NodePoolManager.Instance.getNode(EntityTypeEnum.Corn);
        corn.setParent(DataManager.Instance.sceneManager.effectNode);
        corn.setWorldPosition(node.worldPosition.clone());
        corn.worldRotation = node.worldRotation.clone();
        let targetPos = this.randomPos();
        let pos: Vec3 = corn.worldPosition.clone();
        const centerPosX = (pos.x + targetPos.x) / 2;
        const centerPosY = 25;
        const centerPosZ = (pos.z + targetPos.z) / 2;
        const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ);
        const startRot = corn.worldRotation.clone();
        const endRot = this.randomRotation();

        corn.scale = new Vec3(2,2,2);
        tween(corn)
        .to(0.45, { worldPosition: targetPos }, {
            easing: `cubicInOut`,
            onUpdate: (target, ratio) => {
                const targetNode = target as Node;
                //pos
                const position = MathUtils.bezierCurve(pos, controlPoint, targetPos, ratio);
                targetNode.worldPosition = position;
                //rotation
                const lerpedEuler = new Quat(
                    startRot.x * (1-ratio) + endRot.x * ratio,
                    startRot.y * (1-ratio) + endRot.y * ratio,
                    startRot.z * (1-ratio) + endRot.z * ratio,
                    startRot.w * (1-ratio) + endRot.w * ratio
                );
                targetNode.setWorldRotation(lerpedEuler);
            }
        })
        .call(() => {
            this.startCornParent.addChild(corn);
            corn.setWorldScale(new Vec3(2, 2, 2));
            corn.setWorldRotation(endRot);
            corn.setWorldPosition(targetPos);
        })
        .start();
    }

    /** 玉米随机散落位置 */
    private randomPos():Vec3{
        const angle:number = Math.random() * Math.PI;
        const radius:number = Math.random()*13+2;
        const pos:Vec3 = new Vec3(-Math.sin(angle)*radius,0, Math.cos(angle)*radius);
        pos.add(this.downCornPosNode.worldPosition);
        return pos;
    }

    /** 玉米随机散落角度 */
    private randomRotation():Quat{
        const y:number = math.random() * 360;
        const rotation:Quat = new Quat();
        Quat.fromEuler(rotation, 0, y, 0);
        return rotation;
    }

    /** 获取起始散落玉米粒 */
    public getAroundStartCorn(pos:Vec3):Vec3 {
        for(let i = this.startCornParent.children.length-1;i>=0;i--){
            let drop = this.startCornParent.children[i];
            const dropPos = drop.worldPosition.clone();
            const dx = dropPos.x - pos.x;
            const dz = dropPos.z - pos.z;
            const distSqrXZ = dx * dx + dz * dz;

            // 范围内
            if (distSqrXZ <= DataManager.maxCornSquareDis) {
                let pos:Vec3 = drop.worldPosition.clone();
                drop.removeFromParent();
                drop.destroy();
                return pos;
            }
        }
        return null;
    }

    //获取初始玉米剩余量
    public getStartCornNum():number{
        return this.startCornParent.children.length;
    }

    //获取初始玉米最近的位置
    public getStartCornNearestNode(pos:Vec3):Node{
        let nearestNode:Node = null;
        let minDistSqr = Infinity;
        for(let i = this.startCornParent.children.length-1;i>=0;i--){
            let corn = this.startCornParent.children[i];
            const dropPos = corn.worldPosition.clone();
            const dx = dropPos.x - pos.x;
            const dz = dropPos.z - pos.z;
            const distSqrXZ = dx * dx + dz * dz;

            if (distSqrXZ < minDistSqr) {
                minDistSqr = distSqrXZ;
                nearestNode = corn;
            }
        }
        return nearestNode;
    }

    //地面玉米相关
    public getGroundCornNum(){
        return this.groudCorn.getGroundItemNum();
    }

    public getGroundCorn(): Vec3 {
        return this.groudCorn.playerGetItem();
    }

    /** 地上的玉米的位置 */
    public getGuideGroundCornPos(): Vec3 {
        return this.groudCorn.getGuidePos();
    }

    
    /** 大玉米是否在攻击角度内 */
    public isBigCornInAngle(node:Node,maxAngle:number = 90):boolean{
        const forward = node.forward.clone().normalize();
        forward.negative();
        let toCorn = new Vec3();
        Vec3.subtract(toCorn, this.wholeCorn.worldPosition, node.worldPosition);
        toCorn.y = 0;
        toCorn.normalize();
        const angle = Math.acos(Vec3.dot(forward, toCorn)) * 180 / Math.PI;
        if (angle <= maxAngle) {
            return true;
        }
        return false;
    }

}


