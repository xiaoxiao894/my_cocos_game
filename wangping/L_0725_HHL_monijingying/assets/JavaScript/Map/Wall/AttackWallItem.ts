import { _decorator,  Material, MeshRenderer, Node, Vec3 } from 'cc';
import { NodePoolManager } from '../../Common/NodePoolManager';
import { EntityTypeEnum } from '../../Common/Enum';
import Blood from '../../Common/Blood';
import { DataManager } from '../../Global/DataManager';
import Entity from '../../Common/Entity';
const { ccclass, property } = _decorator;

@ccclass('AttackWallItem')
export class AttackWallItem extends Entity {

    //@property({type:Number,tooltip:"最大血量"})
    maxHp: number = 50;

    //血条初始位置
    //@property({displayName:"血条位置"})
    private bloodOffset: Vec3 = new Vec3(0, 11, 0);


    private _blood: Blood = null;
    private palingTime: number = 0;
    private palingTimeMax: number = 15;
    private isTime: boolean = false;

    start() {
        //创建血条
        this.init();

    }
    async init() {
        const bloodNode: Node = NodePoolManager.Instance.getNode(EntityTypeEnum.HP);
        bloodNode.parent = DataManager.Instance.sceneManager.bloodParent;
        bloodNode.active = false;
        let bloodPos: Vec3 = new Vec3();
        Vec3.add(bloodPos, this.node.worldPosition.clone(), this.bloodOffset);
        bloodNode.setWorldPosition(bloodPos);
        this._blood = bloodNode.getComponent(Blood);
        this._blood?.init(EntityTypeEnum.AttackWall,this.maxHp);

        if (this._blood) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this.bloodOffset);
            this._blood.node.setWorldPosition(bloodPos);
        }
    }

    hit(play:Entity) {
        this.isTime = true;
        this.setShowHp(play.attackNum);
        //闪红
        this.changeColor(1);
        this.scheduleOnce(() => {
            //恢复
            this.changeColor(0);
        }, 0.2);
    }


    setShowHp(attack:number) {
        if (!this._blood) {
            return;
        }
        this._blood.node.active = true;
        this._blood.injuryAni(attack);
    }

    hide() {
        this.isTime = false;
        if (this._blood?.node)
            this._blood.node.active = false;
    }
    
    update(dt: number): void {
        if (this.isTime) {
            this.palingTime += dt;
            if (this.palingTime >= this.palingTimeMax) {
                this.palingTime = 0;

                this.hide();
            }

        }
    }

    private changeColor( matIndex: number) {
        const mesh:MeshRenderer = this.node.children[0].getComponent(MeshRenderer);
        if (mesh) {
            //for (let i = 0; i < mesh.materials.length; i++) {
                let matInstance: Material = mesh.getMaterialInstance(0);
                if(matIndex === 1){
                    matInstance.setProperty('showType', 1.0);
                }else{
                    matInstance.setProperty('showType', 0.0);
                    matInstance.setProperty('dissolveThreshold', 0.0);
                }
            //}
        }
    }
}


