import { _decorator, Component, PhysicsSystem, instantiate, Node,  Vec3, Quat, CylinderCollider, RigidBody } from 'cc';
import { MathUtil } from '../Utils/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('RopeGeneratorNew')
export class RopeGeneratorNew extends Component {
    @property(Node)
    private ropeSegmentPrefab: Node = null!;

    private staticTar: Node = null!;
    private plugTar: Node = null!;
    private head: Node = null!;
    private tail: Node = null!;
    private headConstraint: CANNON.PointToPointConstraint | null = null;
    private tailConstraint: CANNON.PointToPointConstraint | null = null;
    private rope: Node[] = [];
    private joints: CANNON.Constraint[] = [];
    private cannonWorld: CANNON.World = null!;

    private _diameter: number = 0.4;

    private _yLen:number = 10;

    //停止绳子表现更新 timer
    private _stopTimer;
    //停止绳子平滑更新 timer
    private _stopSmoothTimer;
    //是否更新绳子可视化表现
    private _updateVisuals:boolean = false;


    update(deltaTime: number) {
        // 更新绳子的可视化表现
        this.updateRopeVisuals();
    }

    // 更新绳子的可视化效果
    private updateRopeVisuals() {
        if (this.rope.length < 2) return;
        if(!this._updateVisuals){
            return;
        }
        let sampleDir = new Vec3();
        let poses: Vec3[] = [];
        for(let i = 0; i < this.rope.length-1; i++){
            poses.push(this.rope[i].getWorldPosition());
        }
        //console.log(JSON.stringify(poses));
        // 处理头节点与第一个节点之间的连接
        if (this.head && this.rope.length > 0) {
            let headPos = this.head.getWorldPosition();
            let firstNodePos = this.rope[0].getWorldPosition();
            
            Vec3.subtract(sampleDir, firstNodePos, headPos);
            let length = Vec3.len(sampleDir);
            
            if (length > 0.001) {
                Vec3.multiplyScalar(sampleDir, sampleDir, 1.0/length);
                
                let rotation = new Quat();
                Quat.rotationTo(rotation, new Vec3(0, 1, 0), sampleDir);
                
                this.head.setWorldRotation(rotation);
                
                // 调整头节点的缩放，使其覆盖整个距离
                let scale = new Vec3(this._diameter, length, this._diameter);
                this.head.setWorldScale(scale);
                
                // 将头节点放在两点之间的中心
                let midPoint = new Vec3();
                Vec3.lerp(midPoint, headPos, firstNodePos, 0);
                this.head.setWorldPosition(midPoint);
            }
        }
        
        // 处理绳子节点之间的连接，确保它们形成连续的线
        for (let i = 0; i < this.rope.length-1; i++) {
            let currentNode = this.rope[i];
            let nextNode = this.rope[i + 1];
            
            let currentPos = currentNode.getWorldPosition();
            let nextPos = nextNode.getWorldPosition();
            
            Vec3.subtract(sampleDir, nextPos, currentPos);
            let length = Vec3.len(sampleDir);
            
            if (length < 0.001) continue;
            
            Vec3.multiplyScalar(sampleDir, sampleDir, 1.0/length);
            
            let rotation = new Quat();
            Quat.rotationTo(rotation, new Vec3(0, 1, 0), sampleDir);
            
            currentNode.setWorldRotation(rotation);
            
            // 使用完整长度的圆柱体表示绳子段
            let scale = new Vec3(this._diameter, length, this._diameter);
            currentNode.setWorldScale(scale);
            
            // 将节点放在两点之间的中心
            let midPoint = new Vec3();
            Vec3.lerp(midPoint, currentPos, nextPos, 0.5);
            currentNode.setWorldPosition(midPoint);
        }
    }

    createRope(nodes: number, staticTar: Node, plugTar: Node) {
        this.staticTar = staticTar;
        this.plugTar = plugTar;
        this.cannonWorld = (PhysicsSystem.instance.physicsWorld as any).impl as CANNON.World;
        
        // 清除之前的绳子
        //this.clearRope();

        // 初始化头节点
        this.head = this.node;
        
        // 设置插头和静态目标为静态刚体
        const plugRb = plugTar.getComponent(RigidBody)!;
        plugRb.type = 2;
        //plugRb.type = RigidBody.Type.STATIC;
        
        const staticRb = staticTar.getComponent(RigidBody)!;
        staticRb.type = 2;
        //staticRb.type = RigidBody.Type.STATIC;
        
        // 设置头节点为动态刚体
        const headRb = this.head.getComponent(RigidBody)!;
        headRb.type = 1; 
        //headRb.type = RigidBody.Type.DYNAMIC; // 修改为DYNAMIC
        headRb.allowSleep = false;
        headRb.mass = 0.1;
        headRb.linearDamping = 0.8;
        headRb.angularDamping = 0.8;
        
        // 创建绳子节点
        let prevNode = this.head;
        let prevBody = (headRb as any)._body.impl as CANNON.Body;
        
        // 绑定头节点到插头
        const plugBody = (plugRb as any)._body.impl as CANNON.Body;
        this.headConstraint = new CANNON.PointToPointConstraint(
            prevBody,
            new CANNON.Vec3(0, 0, 0),
            plugBody,
            new CANNON.Vec3(0, 0, 0)
        );
        this.cannonWorld.addConstraint(this.headConstraint);
        this.joints.push(this.headConstraint);
        // 使用距离约束
        const headDistanceConstraint = new CANNON.DistanceConstraint(
            prevBody,
            plugBody,
            -0.1,
            100 // 降低强度以增加柔软度
        );
        this.cannonWorld.addConstraint(headDistanceConstraint);
        this.joints.push(headDistanceConstraint);

        const curvePoints = MathUtil.generateSmoothPath(plugTar.getWorldPosition().clone(),staticTar.getWorldPosition().clone(),nodes,-4.34);
        //console.log(JSON.stringify(curvePoints));
        // 生成绳子节点
        for (let i = 1; i < nodes; i++) {
            // 创建新节点
            const newNode = instantiate(this.head);
            this.node.parent!.addChild(newNode);
            this.rope.push(newNode);
            
            // 设置物理属性
            const newRb = newNode.getComponent(RigidBody)!;
            newRb.type = 1;
            //newRb.type = RigidBody.Type.DYNAMIC;
            
            newRb.mass = 0.1;
            newRb.linearDamping = 0.8;
            newRb.angularDamping = 0.8;
            
            // 确保节点有圆柱体碰撞器用于渲染
            let collider = newNode.getComponent(CylinderCollider);
            if (!collider) {
                collider = newNode.addComponent(CylinderCollider);
                collider.radius = 0.025;
                collider.height = 1.0;
                collider.direction = 1; // Y轴方向
            }
            
            // 计算位置
            const t = i / (nodes - 1);
            
            newNode.setWorldPosition(curvePoints[i].position);
            //console.log(`rope pos ${i} ${JSON.stringify(newNode.worldPosition)}`);
            newNode.rotation = curvePoints[i].rotation;
            
            // 添加物理约束
            const currBody = (newRb as any)._body.impl as CANNON.Body;
            //const distance = Vec3.distance(prevNode.worldPosition,newNode.worldPosition);
            
            // 使用距离约束
            const distanceConstraint = new CANNON.DistanceConstraint(
                prevBody,
                currBody,
                0,
                100 // 降低强度以增加柔软度
            );
            this.cannonWorld.addConstraint(distanceConstraint);
            this.joints.push(distanceConstraint);
            
            // 添加铰链约束以限制弯曲
            if (i > 1) {
                //const prevPrevNode = i === 1 ? this.head : this.rope[i - 2];
                //const prevPrevBody = (prevPrevNode.getComponent(RigidBody) as any)._body.impl;
                
                const hingeConstraint = new CANNON.ConeTwistConstraint(
                    prevBody,
                    currBody,
                    {
                        pivotA: new CANNON.Vec3(0, 0, 0),
                        pivotB: new CANNON.Vec3(0, 0, 0),
                        axisA: new CANNON.Vec3(0, 1, 0),
                        axisB: new CANNON.Vec3(0, 1, 0),
                        //angle: Math.PI / 8, // 限制弯曲角度
                       // twistAngle: Math.PI / 4
                    }
                );
                this.cannonWorld.addConstraint(hingeConstraint);
                this.joints.push(hingeConstraint);
            }
            
            prevNode = newNode;
            prevBody = currBody;
        }
        
        // 设置尾节点
        this.tail = prevNode;
        
        // 绑定尾节点到静态目标
        const tailRb = this.tail.getComponent(RigidBody)!;
        const tailBody = (tailRb as any)._body.impl as CANNON.Body;
        const staticBody = (staticRb as any)._body.impl as CANNON.Body;
        
        this.tailConstraint = new CANNON.PointToPointConstraint(
            tailBody,
            new CANNON.Vec3(0, 0, 0),
            staticBody,
            new CANNON.Vec3(0, -0.05, 0)
        );
        this.cannonWorld.addConstraint(this.tailConstraint);
        this.joints.push(this.tailConstraint);
        
        this.startRopeMovement();
        //8秒后停止平滑处理
        this._stopSmoothTimer = setTimeout(() => {
            this.unschedule(this.smoothRopeMovement);
        }, 8000);
        return this.head;
    }

    // 平滑绳子运动
    private smoothRopeMovement() {
        // 应用平滑处理到所有绳子节点
        for (let i = 0; i < this.rope.length; i++) {
            const node = this.rope[i];
            const rb = node.getComponent(RigidBody);
            if (!rb) continue;
            
            const body = (rb as any)._body.impl;
            
            // 降低角速度
            body.angularVelocity.scale(0.9);
            
            // 如果速度很小，直接设为0
            if (body.velocity.lengthSquared() < 0.05) {
                body.velocity.scale(0.9);
            }
            if (body.angularVelocity.lengthSquared() < 0.05) {
                body.angularVelocity.setZero();
            }
            
            // 对中间节点应用额外平滑
            if (i > 0 && i < this.rope.length - 1) {
                const prevNode = this.rope[i-1];
                const nextNode = this.rope[i+1];
                const prevPos = prevNode.getWorldPosition();
                const nextPos = nextNode.getWorldPosition();
                
                // 计算平均位置
                const avgPos = new Vec3(
                    (prevPos.x + nextPos.x) * 0.5,
                    (prevPos.y + nextPos.y) * 0.5,
                    (prevPos.z + nextPos.z) * 0.5
                );
                
                // 轻微地向平均位置移动
                const currPos = node.getWorldPosition();
                const newPos = new Vec3(
                    currPos.x * 0.95 + avgPos.x * 0.05,
                    currPos.y * 0.95 + avgPos.y * 0.05,
                    currPos.z * 0.95 + avgPos.z * 0.05
                );
                
                // 应用新位置
                node.setWorldPosition(newPos);
            }
        }
        
        // 处理头节点
        if (this.head) {
            const headRb = this.head.getComponent(RigidBody);
            if (headRb) {
                const headBody = (headRb as any)._body.impl;
                headBody.angularVelocity.scale(0.9);
            }
        }
    }

    // 清除绳子
    public clearRope() {
        this.scheduleOnce(()=>{
            this.unschedule(this.smoothRopeMovement);
            this._updateVisuals = false;
            
            // 移除所有约束
            if (this.joints.length > 0) {
                for (const joint of this.joints) {
                    if (this.cannonWorld) {
                        this.cannonWorld.removeConstraint(joint);
                    }
                }
                this.joints = [];
            }

            //去掉所有刚体
            this.rope.forEach((node) => {
                node.getComponent(RigidBody)?.destroy();
                node.getComponent(CylinderCollider)?.destroy();
            })
            this.node.getComponent(RigidBody)?.destroy();
            
            // 移除所有节点
            // for (const node of this.rope) {
            //     node.destroy();
            // }
            // this.rope = [];
            
            this.headConstraint = null;
            this.tailConstraint = null;
        },5);
    }

    onDestroy() {
        // 清理资源
        this.clearRope();
    }

    private startRopeMovement(){
        // 启用平滑处理
        this.unschedule(this.smoothRopeMovement);
        this.schedule(this.smoothRopeMovement, 0.01);
    }


    //开始更新绳子可视化表现
    public startMove(){
        this._updateVisuals = true;
        clearTimeout(this._stopTimer);
        clearTimeout(this._stopSmoothTimer);
        this.startRopeMovement();
    }

    //停止更新绳子可视化表现
    public stopMove(){
        this._stopTimer = setTimeout(() => {
            this._updateVisuals = false;
            this.unschedule(this.smoothRopeMovement);
        }, 5000);
    }

    public shackRope(){
        console.log("没平滑");   
        // this.rope.forEach((body, index) => {
        //     this.scheduleOnce(() => {
        //         body.getComponent(RigidBody).applyImpulse(new Vec3(0, 1, 0));
        //     }, index * 0.01); // 延迟时间产生波浪效果
        // });
    }
}