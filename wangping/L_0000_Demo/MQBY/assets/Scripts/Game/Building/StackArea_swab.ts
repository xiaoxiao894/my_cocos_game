import { _decorator, CCFloat, CCInteger, Collider, Component, ITriggerEvent, Label, Node, SkeletalAnimation, tween, Tween, v3, Vec3 } from 'cc';
import { BuildingType, ObjectType } from '../../common/CommonEnum';
import { PoolManager } from '../PoolManager';
import { DropItemCom } from '../Drop/DropItemCom';
const { ccclass, property } = _decorator;

/** 道具堆放区 -- 棉签 */
@ccclass('StackArea_swab')
export class StackArea_swab extends Component {
    private _stackItemType: ObjectType = ObjectType.StackItemSwab;

    // 手动搭建好初始棉签组，然后按排数生成后续的
    public initialSwabNodes: Node[] = [];

    @property({ type: CCInteger, displayName: '堆放排数' })
    public stackRow: number = 0;

    @property({ type: CCFloat, displayName: '堆放排间隔' })
    public stackRowInterval: number = 0;

    protected onLoad(): void {
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            let item = children[i];
            if (item.name.indexOf('Swab') != -1) {
                this.initialSwabNodes.push(item);
            }
        }
    }

    protected start(): void {
        this._createSwab();
        manager.game.registerBuilding(BuildingType.SwabStack, this.node, this.node.getWorldPosition());
    }

    _createSwab() {
        // 根据初始棉签组，生成 stackRow 数量的堆放棉签，每排间隔为 stackRowInterval
        for (let i = 0; i < this.stackRow; i++) {
            for (let j = 0; j < this.initialSwabNodes.length; j++) {
                let swabNode = this.initialSwabNodes[j];
                let newSwabNode = manager.pool.getNode(this._stackItemType, this.node);
                let pos = swabNode.getPosition().clone();
                pos.z += i * this.stackRowInterval;
                newSwabNode.setPosition(pos);
            }
        }
    }
}


