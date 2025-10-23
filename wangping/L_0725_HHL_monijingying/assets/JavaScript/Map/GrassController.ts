import { _decorator, Component, Node, Quat, tween, Vec3} from 'cc';
import { GroundItems } from './GroundItems';
import { LawnMower } from './LawnMower';
import { NodePoolManager } from '../Common/NodePoolManager';
import { EntityTypeEnum } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { MathUtils } from '../Util/MathUtils';
const { ccclass, property } = _decorator;

/** 割草机 */
@ccclass('GrassController')
export class GrassController extends Component {

    @property(Node)
    productGrassNode:Node = null;

    @property(GroundItems)
    groundGrass:GroundItems = null;

    @property(LawnMower)
    lawnMower:LawnMower = null;

    @property(Node)
    deliverNode:Node = null;

    //待生产数量
    private _waitProductNum: number = 0;
    //生产时间间隔
    private _productTimer: number = 0.65;
    //生产计时
    private _productTime: number = 0;

    protected start(): void {
        DataManager.Instance.grassController = this;
        this.groundGrass.init(EntityTypeEnum.Grass,DataManager.grassHeight);
    }

    update(dt: number) {
        this._productTime += dt;
        if(this._waitProductNum > 0){
            if (this._productTime >= this._productTimer) {
                this._productTime = 0;
                
                let product:boolean= this.lawnMower?.playOperate();
                if(product){
                    this.productGrass();
                }else{
                    console.log("割草机 没动");
                }
            }
        }else{
            this.lawnMower?.playIdle();
        }
    }

    /** 生产草 */
    private productGrass(){
        this._waitProductNum--;
        this.lawnMower.subCoin();
        this.scheduleOnce(this.flyGrass,0.27);
    }

    /** 飞草片 */
    private flyGrass():void{
        //草片飞到地上
        let grass:Node = NodePoolManager.Instance.getNode(EntityTypeEnum.Grass);
        grass.setParent(DataManager.Instance.sceneManager.effectNode);
        grass.setWorldPosition(this.productGrassNode.worldPosition.clone());
        grass.worldRotation = this.productGrassNode.worldRotation.clone();
        let targetPos = this.groundGrass.getNextItemPos(this.groundGrass.getPlayingAniNum());
        let pos: Vec3 = grass.worldPosition.clone();
        const centerPosX = (pos.x + targetPos.x) / 2;
        const centerPosY = 25;
        const centerPosZ = (pos.z + targetPos.z) / 2;
        const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ);
        grass.eulerAngles = new Vec3(0, 0, 0);
        //const startRot = grass.worldRotation.clone();
        //const endRot = this.groundGrass.node.getWorldRotation().clone();

        const startScale = new Vec3(1,1,1);
        const endScale = new Vec3(1,1,1);
        grass.scale = startScale.clone();
        this.groundGrass.addPlayingAniNum();
        tween(grass)
        .to(0.45, { worldPosition: targetPos }, {
            easing: `cubicInOut`,
            onUpdate: (target, ratio) => {
                const targetNode = target as Node;
                //pos
                const position = MathUtils.bezierCurve(pos, controlPoint, targetPos, ratio);
                targetNode.worldPosition = position;
                //rotation
                // const lerpedEuler = new Quat(
                //     startRot.x * (1-ratio) + endRot.x * ratio,
                //     startRot.y * (1-ratio) + endRot.y * ratio,
                //     startRot.z * (1-ratio) + endRot.z * ratio,
                //     startRot.w * (1-ratio) + endRot.w * ratio
                // );
                
                //scale
                const lerpedScale = new Vec3(
                    startScale.x * (1-ratio) + endScale.x * ratio,
                    startScale.y * (1-ratio) + endScale.y * ratio,
                    startScale.z * (1-ratio) + endScale.z * ratio
                );

                targetNode.setWorldScale(lerpedScale);
            }
        })
        .call(() => {
            this.groundGrass.reducePlayingAniNum();
            this.groundGrass.addItem(targetPos);
            NodePoolManager.Instance.returnNode(grass, EntityTypeEnum.Grass);
        })
        .start();
    }

    public playerDeliverCoin(): void {
        //交付金币
        this._waitProductNum++;
        this.lawnMower.addCoin();
    }

    /** 获取地上的草 */
    public getGroundGrass(): Vec3 {
        return this.groundGrass.playerGetItem();
    }

    //地面草的数量
    public getGroundGrassNum(){
        return this.groundGrass.getGroundItemNum();
    }

    /** 地上的草的位置 */
    public getGroundGrassPos(): Vec3 {
        return this.groundGrass.node.getWorldPosition().clone();
    }

}


