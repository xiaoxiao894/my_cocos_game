import { _decorator, Collider, Component, ICollisionEvent, Node, Vec3 } from 'cc';
import { App } from '../App';
const { ccclass, property } = _decorator;

@ccclass('physicsForce1')
export class physicsForce1 extends Component {
    @property({ tooltip: "人物节点标签" })
    playerTag: string = "Player";

    @property({ tooltip: "玩家与碰撞盒子边缘保持的距离（需大于0）" })
    distance: number = 2;

    @property({ tooltip: "碰撞盒子的半径/半长（根据实际碰撞体大小设置）" })
    boxRadius: number = 1;  // 碰撞盒子自身的尺寸

    private _initialPlayerY: number = 0;

    onLoad() {
        const collider = this.getComponent(Collider);
        if (!collider) {
            console.error("当前节点没有碰撞体组件！");
        }
    }

    start() {
        const playerNode = App.playerController.getPlayer()?.node;
        if (playerNode) {
            this._initialPlayerY = playerNode.worldPosition.y;
        } else {
            console.error("初始化时未找到玩家节点！");
        }
    }

    // 强制移动玩家到碰撞盒子外部
    public forceMovePlayer() {
        const playerNode = App.playerController.getPlayer()?.node;
        if (!playerNode) {
            console.error("强制移动时未找到玩家节点！");
            return;
        }
        this.movePlayerOutsideBox(playerNode);
    }

    // 核心逻辑：将玩家移动到碰撞盒子外部指定距离处
    private movePlayerOutsideBox(playerNode: Node) {
        // 碰撞盒子中心位置
        const boxCenter = this.node.worldPosition;
        // 玩家当前位置
        const playerPos = playerNode.worldPosition;

        // 计算从玩家指向盒子中心的方向向量
        const playerToBoxDir = new Vec3(
            boxCenter.x - playerPos.x,
            0,  // 忽略Y轴，只在水平面上计算
            boxCenter.z - playerPos.z
        );

        // 计算玩家到盒子中心的直线距离
        const distanceToCenter = playerToBoxDir.length();

        // 处理玩家与盒子中心重合的特殊情况（避免方向向量为0）
        if (distanceToCenter < 0.001) {
            playerToBoxDir.set(1, 0, 0);  // 默认X轴正方向
        } else {
            playerToBoxDir.normalize();  // 归一化方向向量
        }

        // 最终目标距离 = 盒子自身半径 + 要保持的距离（确保在外部）
        const targetDistance = this.boxRadius + this.distance;

        // 计算新位置：从盒子中心向远离玩家原位置的方向移动目标距离
        // 对X和Z轴应用相同的逻辑，确保在水平面上正确远离盒子
        const newPos = new Vec3(
            boxCenter.x - playerToBoxDir.x * targetDistance,  // X轴方向远离盒子
            this._initialPlayerY,                             // 保持Y轴高度不变
            boxCenter.z - playerToBoxDir.z * targetDistance   // Z轴方向远离盒子
        );

        playerNode.worldPosition = newPos;
    }

    // onCollisionEnter(event: ICollisionEvent) {
    //     const otherNode = event.otherCollider.node;
    //     if (otherNode.name === this.playerTag && this.isTrue) {
    //         this.isTrue = false;
    //         console.log("玩家与房子发生碰撞");
    //         this._currentPlayerCollider = event.otherCollider;

    //         const playerNode = App.playerController.getPlayer()?.node;
    //         if (!playerNode) {
    //             console.error("未找到玩家节点");
    //             return;
    //         }

    //         // 碰撞时将玩家移动到距离碰撞盒子指定距离的位置
    //         this.movePlayerToDistance(playerNode);
    //     }
    // }

    // onCollisionStay(event: ICollisionEvent) {
    //     const otherNode = event.otherCollider.node;
    //     if (otherNode.name === this.playerTag) {
    //         // 碰撞持续时的逻辑（如需）
    //     }
    // }

    // onCollisionExit(event: ICollisionEvent) {
    //     const otherNode = event.otherCollider.node;
    //     if (otherNode.name === this.playerTag) {
    //         this.isTrue = true;  // 离开碰撞后重置状态，允许下次碰撞触发
    //     }
    // }
}
