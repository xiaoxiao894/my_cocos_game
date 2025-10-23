import { _decorator, Component, Node, LineComponent, Material, EffectAsset, Vec3, ModelComponent, Texture2D, CCFloat, ParticleSystem } from "cc";
import PoolManager, { PoolEnum } from "db://assets/Script/Base/PoolManager";
const { ccclass, property } = _decorator;

const up: Vec3 = new Vec3(0, 1, 0);

/**
 * 闪电效果组件
 * 使用中点分形法生成动态闪电效果，连接两个节点
 */
@ccclass("Lightning")
export class Lightning extends Component {

    @property({
        type: CCFloat,
        displayName: "细节程度",
        tooltip: "闪电分段的最小细节值，值越小闪电越平滑"
    })
    detail: number = 1;

    @property({
        type: CCFloat,
        displayName: "位移强度",
        tooltip: "闪电随机偏移的强度，值越大闪电越弯曲"
    })
    displacement: number = 15;

    @property({
        type: CCFloat,
        displayName: "Y轴偏移",
        tooltip: "闪电起始和结束点的Y轴偏移量"
    })
    yOffset: number = 0;

    @property({
        type: Node,
        displayName: "起始节点",
        tooltip: "闪电的起始位置节点"
    })
    startNode: Node = null;

    @property({
        type: Node,
        displayName: "目标节点",
        tooltip: "闪电的目标位置节点"
    })
    targetNode: Node = null;

    /** 线条渲染组件 */
    @property({
        type: LineComponent,
        displayName: "线条组件"
    })
    line: LineComponent = null;



    /** 闪电路径顶点数组 */
    points: Vec3[];


    onLoad() {
        this.points = [];
    }

    start() {
    }

    update(deltaTime: number) {
        let startPos: Vec3 = Vec3.ZERO;
        let endPos: Vec3 = Vec3.ZERO;

        // 获取起始节点的世界坐标位置
        if (this.startNode) {
            startPos = this.startNode.worldPosition.add(up.multiplyScalar(this.yOffset));
        }
        // 获取目标节点的世界坐标位置
        if (this.targetNode) {
            endPos = this.targetNode.worldPosition.add(up.multiplyScalar(this.yOffset));
        }

        // 当起始位置和结束位置不同时，生成闪电路径
        if (!startPos.equals(endPos)) {
            this.points.length = 0;
            this.collectLinPos(startPos, endPos, this.displacement);
            this.points.push(endPos);

            // 更新线条组件的顶点位置
            this.line.positions = this.points;
        }
    }


    /**
     * 收集顶点，使用中点分形法插值抖动生成闪电路径
     * @param startPos 起始位置
     * @param destPos 目标位置
     * @param displace 当前位移强度
     */
    collectLinPos(startPos: Vec3, destPos: Vec3, displace: number) {
        // 当位移强度小于细节阈值时，直接添加顶点
        if (displace < this.detail) {
            this.points.push(startPos);
        }
        else {
            // 计算中点坐标
            let midX: number = (startPos.x + destPos.x) / 2;
            let midY: number = (startPos.y + destPos.y) / 2;
            let midZ: number = (startPos.z + destPos.z) / 2;

            // 为中点添加随机偏移，形成闪电的弯曲效果
            midX += (Math.random() - 0.5) * displace;
            midY += (Math.random() - 0.5) * displace;
            midZ += (Math.random() - 0.5) * displace;

            let midPos: Vec3 = new Vec3(midX, midY, midZ);

            // 递归处理两段，位移强度减半
            this.collectLinPos(startPos, midPos, displace / 2);
            this.collectLinPos(midPos, destPos, displace / 2);
        }
    }

    setPos(endWorldPos: Vec3, startPos?: Vec3) {
        this.targetNode.setWorldPosition(endWorldPos);
        if (startPos) {
            this.startNode.setWorldPosition(startPos);
        }
    }
    setPosNode(endNode: Node, startNode: Node) {
        this.targetNode = endNode;
        this.startNode = startNode;
    }

    public remove() {
        this.node.active = false;
        PoolManager.instance.setPool(PoolEnum.bullet + 1, this);
    }
}