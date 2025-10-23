import { _decorator, Collider, Component, ITriggerEvent, Node, PhysicsSystem, RigidBody, Vec3 } from 'cc';
import { App } from '../App';
const { ccclass, property } = _decorator;

@ccclass('physicsForce')
export class physicsForce extends Component {
    @property({ tooltip: "房子是否已解锁（控制显示/隐藏）" })
    isUnlocked: boolean = true;

    @property({ tooltip: "推出力大小（需足够大以克服重力）" })
    pushForce: number = 0.01;

    @property({ tooltip: "人物节点标签" })
    playerTag: string = "Player";

    private _isProcessed: boolean = false; // 避免重复触发
    private _houseCollider: Collider | null = null;
    private _currentPlayerCollider: ITriggerEvent["otherCollider"] | null = null; // 记录当前在触发器内的玩家碰撞体

    onLoad() {
        this._houseCollider = this.getComponent(Collider);
        this._houseCollider.on('onTriggerEnter', this.onTriggerEnter, this);
        this._houseCollider.on('onTriggerStay', this.onTriggerStay, this);
        this._houseCollider.on('onTriggerExit', this.onTriggerExit, this);
    }
    init() {
        this.forceCheckTriggerStay();
    }

    onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.node.name === this.playerTag) {
            // console.log("玩家进入触发器");
            this._currentPlayerCollider = event.otherCollider; // 记录玩家碰撞体
        }
    }

    onTriggerStay(event: ITriggerEvent) {
        if (event.otherCollider.node.name === this.playerTag) {
            this.handlePlayerInTrigger(event);
            const houseAABB = this._houseCollider.worldBounds;
            const player = App.playerController.getPlayer();
            if (!player) return;

            const playerNode = player.node;
            const playerRigidBody = playerNode.getComponent(RigidBody);
            if (!playerRigidBody) return;

            // 计算玩家到碰撞体边缘的距离
            const distanceToEdge = this.calculateDistanceToEdge(playerNode.worldPosition, houseAABB);

            // 距离边缘越近，推力越小，避免在边缘持续加速
            const forceFactor = Math.max(0, distanceToEdge / (houseAABB.halfExtents.x * 0.5));
            const adjustedForce = this.pushForce * forceFactor;

            const direction = new Vec3();
            Vec3.subtract(direction, playerNode.worldPosition, houseAABB.center);
            direction.normalize();

            // 改用applyForce而不是applyImpulse，施加持续力而非瞬时冲量
            const force = new Vec3();
            Vec3.multiplyScalar(force, direction, adjustedForce);
            playerRigidBody.applyForce(force, playerNode.worldPosition);
        }
    }
    // 计算玩家到碰撞体边缘的距离
    private calculateDistanceToEdge(playerPos: Vec3, aabb: { center: Vec3, halfExtents: Vec3 }) {
        // 计算玩家在AABB坐标系中的位置
        const localPos = new Vec3();
        Vec3.subtract(localPos, playerPos, aabb.center);

        // 计算到每个轴边缘的距离
        const distX = aabb.halfExtents.x - Math.abs(localPos.x);
        const distY = aabb.halfExtents.y - Math.abs(localPos.y);
        const distZ = aabb.halfExtents.z - Math.abs(localPos.z);

        // 返回最小距离（到最近边缘的距离）
        return Math.min(distX, distY, distZ);
    }
    onTriggerExit(event: ITriggerEvent) {
        if (event.otherCollider.node.name === this.playerTag) {
            // console.log("玩家离开触发器");
            this._currentPlayerCollider = null;

            // 玩家离开时施加一个反向力，帮助减速
            const player = App.playerController.getPlayer();
            // if (player) {
            //     const playerRigidBody = player.node.getComponent(RigidBody);
            //     if (playerRigidBody) {
            //         // 获取当前速度并施加反向力
            //         const velocity = playerRigidBody.linearVelocity;
            //         const brakeForce = new Vec3(-velocity.x * 0.5, -velocity.y * 0.5, -velocity.z * 0.5);
            //         playerRigidBody.applyImpulse(brakeForce, player.node.worldPosition);
            //     }
            // }
        }
    }

    // 提取玩家在触发器内的核心处理逻辑（供onTriggerStay和手动检测调用）
    private handlePlayerInTrigger(event: ITriggerEvent) {
        // console.log("玩家持续在触发器内（触发逻辑）");
        // 这里放原本onTriggerStay中的处理代码（如施加推力、显示提示等）
    }

    // 手动强制检测一次（模拟onTriggerStay）
    public forceCheckTriggerStay() {
        if (this._currentPlayerCollider && this._houseCollider) {
            // 使用类型断言忽略完整属性检查
            const mockEvent = {
                otherCollider: this._currentPlayerCollider,
                selfCollider: this._houseCollider,
                type: 'onTriggerStay'
            } as ITriggerEvent; // 关键：用as断言为ITriggerEvent类型

            this.handlePlayerInTrigger(mockEvent);
        } else {
            // console.log("当前没有玩家在触发器内或碰撞体未初始化");
        }
    }

}
