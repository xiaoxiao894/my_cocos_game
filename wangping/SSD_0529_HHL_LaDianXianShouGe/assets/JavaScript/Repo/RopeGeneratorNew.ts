import { _decorator, Component, PhysicsSystem, instantiate, Node,  Vec3, Quat, RigidBody, Collider} from 'cc';
import { MathUtil } from '../Utils/MathUtils';
import RopeUtils from '../Utils/RopeUtils';
import { DataManager } from '../Global/DataManager';
import { RopePoint } from '../Common/Type';
import GridPathController from '../Player/GridPathController';
const { ccclass, property } = _decorator;

@ccclass('RopeGeneratorNew')
export class RopeGeneratorNew extends Component {

    @property(Node) pointNode:Node = null;
    @property(Node) pointParentNode:Node = null;

    private staticTar: Node = null!;
    private plugTar: Node = null!;

    private head: Node = null!;
    private tail: Node = null!;
    private headConstraint: CANNON.PointToPointConstraint | null = null;
    private tailConstraint: CANNON.PointToPointConstraint | null = null;
    private rope: Node[] = [];
    private joints: CANNON.Constraint[] = [];
    private cannonWorld: CANNON.World = null!;

    /** 电线直径 */
    private _diameter: number = 0;
    /** 不动的长度长度 */
    private _noMoveLen:number = 0;
    /** 剩余活动长度 */
    private _leftActiveLen:number = 0;
    /** 平均最大长度 */
    private _averageMaxLen:number = 0.2;
    /** 平均最小长度 */
    private _averageMinLen:number = 0.08;

    /** 是否更新不动的绳子长度 */
    private _updateNoMoveLen:boolean = false;

    private _end:boolean = false;

    nextSmoothRopeMovementSec: number = 0;


    createRope(nodes: number, staticTar: Node, plugTar: Node) {
        this._end = false;
        this._diameter = DataManager.Instance.wireRadius*2;

        this.staticTar = staticTar;
        this.plugTar = plugTar;
        this.cannonWorld = (PhysicsSystem.instance.physicsWorld as any).impl as CANNON.World;
        

        // 初始化头节点
        this.head = this.node;
        this.head.setWorldPosition(plugTar.getWorldPosition().clone());
        // 设置插头和静态目标为静态刚体
        const plugRb = plugTar.getComponent(RigidBody)!;
        plugRb.type = RigidBody.Type.STATIC;
        
        const staticRb = staticTar.getComponent(RigidBody)!;
        staticRb.type = RigidBody.Type.STATIC;
        
        // 设置头节点为动态刚体
        const headRb = this.head.getComponent(RigidBody)!;
        headRb.type = RigidBody.Type.DYNAMIC; // 修改为DYNAMIC
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
            0,
            100 // 降低强度以增加柔软度
        );
        this.cannonWorld.addConstraint(headDistanceConstraint);
        this.joints.push(headDistanceConstraint);

        const curvePoints = MathUtil.generateSmoothPath(plugTar.getWorldPosition().clone(),staticTar.getWorldPosition().clone(),nodes,0);
        //console.log(JSON.stringify(curvePoints));
        // 生成绳子节点
        for (let i = 1; i < nodes; i++) {
            // 创建新节点
            const newNode = DataManager.Instance.ropeManager.getRope();
            newNode.getComponent(RopeGeneratorNew)?.destroy();
            newNode.children[0].active = true;
            newNode.children[1].active = false;
            newNode.children[2].active = false;
            newNode.children[3].active = false;
            newNode.active = true;
            this.node.parent!.addChild(newNode);
            this.rope.push(newNode);
            
            // 设置物理属性
            const newRb = newNode.getComponent(RigidBody)!;
            RopeUtils.setRigidBody(newRb);
            
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
        return this.head;
    }

    //绳子增长 增长一定是在第一个和第二个节点之间
    private addRopeNode(){
        // 创建新节点
        const newNode = DataManager.Instance.ropeManager.getRope();
        newNode.getComponent(RopeGeneratorNew)?.destroy();
        newNode.children[0].active = true;
        newNode.children[1].active = false;
        newNode.children[2].active = false;
        newNode.children[3].active = false;
        newNode.active = true;
        this.node.parent!.insertChild(newNode,2);
        
        
        // 设置物理属性
        const newRb = newNode.getComponent(RigidBody)!;
        RopeUtils.setRigidBody(newRb);

        //连接新节点 放在第一个结点和第二个节点之间 
        this.rope.splice(1,0,newNode);
        let prevNode = this.rope[0];
        let midPoint = new Vec3();
        Vec3.lerp(midPoint, prevNode.worldPosition.clone(), this.rope[2].worldPosition.clone(), 0.5);
        newNode.setWorldPosition(midPoint);
        newNode.rotation = this.rope[2].rotation.clone();

        // 物理连接 约束关系放在第三个后边
        let prevBody = (prevNode.getComponent(RigidBody) as any)._body.impl;
        const currBody = (newRb as any)._body.impl as CANNON.Body;
        // 使用距离约束
        const distanceConstraint = new CANNON.DistanceConstraint(
            prevBody,
            currBody,
            0,
            100 // 降低强度以增加柔软度
        );
        this.cannonWorld.addConstraint(distanceConstraint);
        // 添加铰链约束以限制弯曲
        const hingeConstraint = new CANNON.ConeTwistConstraint(
            prevBody,
            currBody,
            {
                pivotA: new CANNON.Vec3(0, 0, 0),
                pivotB: new CANNON.Vec3(0, 0, 0),
                axisA: new CANNON.Vec3(0, 1, 0),
                axisB: new CANNON.Vec3(0, 1, 0),
                //angle: Math.PI / 8, // 限制弯曲角度
                //twistAngle: Math.PI / 4
            }
        );
        this.cannonWorld.addConstraint(hingeConstraint);
        
        //删除现有约束关系
        const jointDistance = this.joints[3];
        const jointHinge = this.joints[4];
        this.cannonWorld.removeConstraint(jointDistance);
        this.cannonWorld.removeConstraint(jointHinge);
        jointDistance.disable();
        jointHinge.disable();

        let bodyB = (this.rope[2].getComponent(RigidBody) as any)._body.impl;

        // 使用距离约束
        const distanceConstraint2 = new CANNON.DistanceConstraint(
            currBody,
            bodyB,
            0,
            100 // 降低强度以增加柔软度
        );
        this.cannonWorld.addConstraint(distanceConstraint2);
        // 添加铰链约束以限制弯曲
        const hingeConstraint2 = new CANNON.ConeTwistConstraint(
            currBody,
            bodyB,
            {
                pivotA: new CANNON.Vec3(0, 0, 0),
                pivotB: new CANNON.Vec3(0, 0, 0),
                axisA: new CANNON.Vec3(0, 1, 0),
                axisB: new CANNON.Vec3(0, 1, 0),
                //angle: Math.PI / 8, // 限制弯曲角度
                //twistAngle: Math.PI / 4
            }
        );
        this.cannonWorld.addConstraint(hingeConstraint2);
        // 插入约束关系
        this.joints.splice(3,2,distanceConstraint,hingeConstraint,distanceConstraint2,hingeConstraint2);

        //this.updateRopeVisuals();
    }

    //绳子过长移除一个节点，暂定也是从头节点开始移除，如果有问题再改到尾节点
    private removeRopeNode(index:number = 1){
        let removeNode:Node;
        [removeNode] = this.rope.splice(index,1);
        //解除物理依赖
        let prevBody = (this.rope[index-1].getComponent(RigidBody) as any)._body.impl;
        let joints:CANNON.Constraint[] = this.joints.splice(1+index*2,2);
        for(let joint of joints){
            this.cannonWorld.removeConstraint(joint);
            joint.disable();
        }
        let jointDistance = this.joints[1+index*2];
        let jointHinge = this.joints[2+index*2];
        this.cannonWorld.removeConstraint(jointDistance);
        this.cannonWorld.removeConstraint(jointHinge);
        jointDistance.disable();
        jointHinge.disable();
        let bodyB = (this.rope[index].getComponent(RigidBody) as any)._body.impl;

        // 使用距离约束
        const distanceConstraint = new CANNON.DistanceConstraint(
            prevBody,
            bodyB,
            0,
            100 // 降低强度以增加柔软度
        );
        this.cannonWorld.addConstraint(distanceConstraint);
        // 添加铰链约束以限制弯曲
        const hingeConstraint = new CANNON.ConeTwistConstraint(
            prevBody,
            bodyB,
            {
                pivotA: new CANNON.Vec3(0, 0, 0),
                pivotB: new CANNON.Vec3(0, 0, 0),
                axisA: new CANNON.Vec3(0, 1, 0),
                axisB: new CANNON.Vec3(0, 1, 0),
                //angle: Math.PI / 8, // 限制弯曲角度
                //twistAngle: Math.PI / 4
            }
        );
        this.cannonWorld.addConstraint(hingeConstraint);
        this.joints.splice(1+index*2,2,distanceConstraint,hingeConstraint);
        //删除节点
        removeNode.removeFromParent();
        DataManager.Instance.ropeManager.putRope(removeNode);

        //缺少 对前一个节点和后一个节点的缩放、长度、旋转、位置的修改
        //this.updateRopeVisuals();
    }

    private checkRopeLen(){
        let num:number = this.rope.length;
        if(DataManager.Instance.ropePointList.length){
            const lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
            num = lastPoint.ropeNode.getSiblingIndex();
        }
        if(this._leftActiveLen<num*this._averageMinLen){
            this.removeRopeNode();
        }else if(this._leftActiveLen>num*this._averageMaxLen && !this._end){
            this.addRopeNode();
        }

    }

    // 平滑绳子运动
    private smoothRopeMovement() {
        // 应用平滑处理到所有绳子节点
        const lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
        let  activeIndedx:number = this.rope.length-1;
        if(lastPoint){
            activeIndedx = lastPoint.ropeNode.getSiblingIndex() - 1;
        }
        for (let i = 0; i < activeIndedx; i++) {
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

    //private frameCount:number = 0;

    update(deltaTime: number) {

        if (this.rope.length < 2) return;
        // this.frameCount++;
        // if(this.frameCount>1){
        //     this.frameCount = 0;
        //     return;
        // }

        // 更新绳子的可视化表现
        this.updateRopeVisuals();

        this.nextSmoothRopeMovementSec -= deltaTime;
        if(this.nextSmoothRopeMovementSec <= 0) {
            this.smoothRopeMovement();
            this.nextSmoothRopeMovementSec = 0.01;
        }
    }

    // 更新绳子的可视化效果
    private updateRopeVisuals() {

        if(this._updateNoMoveLen){
            this.updateNoMoveLen();
            this._updateNoMoveLen = false;
        }

        let sampleDir = new Vec3();

        // 处理头节点与第一个节点、插座之间的连接
        if (this.head && this.rope.length > 0) {
            let headPos = this.head.getWorldPosition();
            let firstNodePos = this.rope[0].getWorldPosition();
            let plugPos:Vec3 = this.plugTar.getWorldPosition();
            let plugDis = Vec3.distance(plugPos,headPos);
            Vec3.subtract(sampleDir, firstNodePos, plugPos);
            let length = Vec3.len(sampleDir);
            
            if (length > 0.001) {
                Vec3.multiplyScalar(sampleDir, sampleDir, 1.0/length);
                
                let rotDir = new Vec3();
                Vec3.subtract(rotDir, firstNodePos, headPos);
                rotDir.normalize();
                let rotation = new Quat();
                Quat.rotationTo(rotation, new Vec3(0, 1, 0), rotDir);
                
                this.head.setWorldRotation(rotation);
                
                // 调整头节点的缩放，使其覆盖整个距离
                let scale = new Vec3(this._diameter, length-plugDis/2, this._diameter);
                this.head.setWorldScale(scale);
                
                // 将头节点放在两点之间的中心
                let midPoint = new Vec3();
                Vec3.lerp(midPoint, plugPos, firstNodePos, 0.5);
                this.head.setWorldPosition(midPoint);
            }
        }
        this._leftActiveLen = 0;
        let posList:Vec3[] = [];
        const lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
        let  activeIndedx:number = this.rope.length-1;
        if(lastPoint&&!this._end){
            activeIndedx = lastPoint.ropeNode.getSiblingIndex() - 1;
        }

        for(let i = activeIndedx ; i >= 0 ; i--){
            posList.push(this.rope[i].getWorldPosition());
        }
        posList.reverse();
        let newPos:Vec3[] = RopeUtils.uniformize(posList,activeIndedx+1);

        
        let ropeList:number[]=[];
        // 处理绳子节点之间的连接，确保它们形成连续的线
        for (let i = activeIndedx-1; i >=0; i--) {
            let currentNode = this.rope[i];
            ropeList.push((currentNode.getComponent(RigidBody) as any)._body.impl.id);
            let currentPos = newPos[i];
            let nextPos = newPos[i+1];

            Vec3.subtract(sampleDir, nextPos, currentPos);
            let length = Vec3.len(sampleDir);
            
            Vec3.multiplyScalar(sampleDir, sampleDir, 1.0/length);
            
            let rotation = new Quat();
            Quat.rotationTo(rotation, new Vec3(0, 1, 0), sampleDir);
            
            currentNode.setWorldRotation(rotation);
            
            // 使用完整长度的圆柱体表示绳子段
            let scale = new Vec3(this._diameter, length, this._diameter);
            currentNode.setWorldScale(scale);

            //检查是否在树内，在树内 挂在树上
            if(!this._end&&i>5){
                let treePos:Vec3 = RopeUtils.getCircleContainingPoint(currentPos);
                if(treePos){
                    this.addOnePoint(treePos.clone(),currentPos.clone(),currentNode);
                }
            }
            

            currentNode.setWorldPosition(currentPos);
            this._leftActiveLen +=length;
        }
        DataManager.Instance.usedLen = Math.max(0,Math.floor((this._noMoveLen+this._leftActiveLen-2)*1.05));
        this.updateNoMoveRope();
        this.checkRopeLen();
        if(!this._end){
            this.checkLastPoint();
            this.updateRopeDir();
        }
    }

    private _noMoveRopeUpdateCount:number = 0
    private updateNoMoveRope(){
        if(DataManager.Instance.ropePointList.length<1){
            return;
        }
        this._noMoveRopeUpdateCount++;
        if(this._noMoveRopeUpdateCount<2){
            return;
        }
        this._noMoveRopeUpdateCount = 0;

        let len = this.rope.length-1;
        let lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
        let lastNode:Node = lastPoint.ropeNode;
        let lastIndex = lastNode.getSiblingIndex();
        // 处理绳子节点之间的连接，确保它们形成连续的线
        let sampleDir = new Vec3();
        for (let i = lastIndex+1; i < len; i++) {
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
            let scale = new Vec3(this._diameter, length,this._diameter);
            currentNode.setWorldScale(scale);
            
            // 将节点放在两点之间的中心
            let midPoint = new Vec3();
            Vec3.lerp(midPoint, currentPos, nextPos, 0.5);
            currentNode.setWorldPosition(midPoint);
        }
    }

    /** 更新绳子方向 */
    private updateRopeDir(){
        
        let firstPOS:Vec3 = this.rope[0].getWorldPosition().clone();
        let lastPOS:Vec3 = this.rope[this.rope.length-1].getWorldPosition().clone();
        if(DataManager.Instance.ropePointList.length>0){
            let lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
            let lastNode:Node = lastPoint.ropeNode;
            if(lastNode&&lastNode.isValid){
                lastPOS = lastNode.getWorldPosition().clone();
            }
        }
        let dir:Vec3 = new Vec3();
        Vec3.subtract(dir,firstPOS,lastPOS);
        dir.y = 0;
        dir.normalize();
        DataManager.Instance.wireDir = dir;
    }

    /** 加一个挂点 */
    private addOnePoint(treePos:Vec3,currentPos:Vec3,currentNode:Node){
        //剩最后一点绳子就不挂了
        let leftLen:number =  DataManager.Instance.wireLen - DataManager.Instance.usedLen;
        if(leftLen<5){
            let startPos:Vec3 = this.rope[0].getWorldPosition().clone();
            let endPos:Vec3 = currentNode.getWorldPosition().clone();
            let disSquare:number = Vec3.squaredDistance(startPos,endPos);
            if(disSquare+leftLen*leftLen<20){
                return;
            }
        }

        //判断是大树且要继续增加挂点
        let bigTreeAddPoint:boolean = RopeUtils.checkBigTreeAddPoint(treePos.clone(),currentPos.clone());

        if(DataManager.Instance.ropeTrees.get(treePos.toString())==null||bigTreeAddPoint){
            if(DataManager.Instance.ropePointList.length>0){
                let last:Node = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1].ropeNode;
                if(last.getSiblingIndex() <= currentNode.getSiblingIndex()){
                    return;
                }
            }
            let pointPos:Vec3 = new Vec3();
            const curY:number = currentPos.y;
            currentPos.y = 0;
            let treeDis = Vec3.distance(treePos,currentPos);
            let treeRadius = DataManager.Instance.treeRadius;
            //判断大树
            if(bigTreeAddPoint){
                treeRadius = DataManager.Instance.bigTreeRadius;
            }

            let moveDis = treeRadius+this._diameter/2-treeDis;
            let moveVec = new Vec3();
            Vec3.subtract(moveVec,currentPos,treePos);
            Vec3.normalize(moveVec,moveVec);
            Vec3.multiplyScalar(moveVec,moveVec,moveDis);
            Vec3.add(pointPos,currentPos,moveVec);
            let pointNode = instantiate(this.pointNode);
            pointNode.setParent(this.pointParentNode);
            pointPos.y = curY;
            pointNode.setWorldPosition(pointPos);
            // if(bigTreeAddPoint){
            //     console.log("big tree check");
            //     console.log(DataManager.Instance.ropePointList);
            // }
            const puintRb = pointNode.getComponent(RigidBody)!;
            let pointBody = (puintRb as any)._body.impl as CANNON.Body;
            const curRb = currentNode.getComponent(RigidBody)!;
            let curBody = (curRb as any)._body.impl as CANNON.Body;
            let constraint = new CANNON.PointToPointConstraint(
                curBody,
                new CANNON.Vec3(0, 0, 0),
                pointBody,
                new CANNON.Vec3(0, 0, 0)
            );
            this.cannonWorld.addConstraint(constraint);
            // 使用距离约束
            const distanceConstraint = new CANNON.DistanceConstraint(
                curBody,
                pointBody,
                -0.1,
                100 // 降低强度以增加柔软度
            );
            this.cannonWorld.addConstraint(distanceConstraint);
            DataManager.Instance.ropeTrees.set(treePos.toString(),true);
            DataManager.Instance.ropePointList.push({
                tree:treePos,
                ropeNode:currentNode,
                pointNode:pointNode,
                pointConstraint:constraint,
                distanceConstraint:distanceConstraint
            });

            this._updateNoMoveLen = true;

            //减少挂点前边的节点数量
            let removeIndex = currentNode.getSiblingIndex();
            let len = this.rope.length;
            let lastPointNode:Node = this.staticTar;
            if(DataManager.Instance.ropePointList.length>1){
                let lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-2];
                let lastNode:Node = lastPoint.ropeNode;
                let lastIndex = lastNode.getSiblingIndex();
                if(removeIndex>=lastIndex){   
                    return;
                }
                len = lastIndex;
                lastPointNode = lastNode;
            }
            
            //判断节点数量剪裁多少
            let dis:number = Vec3.distance(lastPointNode.worldPosition,currentNode.worldPosition);
            let removeNum:number = Math.floor((len-removeIndex) - dis/this._averageMaxLen);
            if(removeNum>0){
                let step:number = Math.ceil((len-removeIndex)/removeNum);
                let index:number = len-3;
                let cont:number = 0;
                while(index>(removeIndex+3)){
                    this.removeRopeNode(index);
                    index -= step;
                    cont++;
                }
            }
            
        }
    }

    /** 检查是否要去掉最后一个挂点 */
    private checkLastPoint(){
        if(DataManager.Instance.ropePointList.length>0){
            let lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
            let lastNode:Node = lastPoint.ropeNode;
            if(lastNode&&lastNode.isValid){
                let treePos = lastPoint.tree.clone();
                let aPos:Vec3 = this.rope[0].getWorldPosition().clone();
                let bPos:Vec3 = this.rope[lastNode.getSiblingIndex()+10].getWorldPosition().clone();
                //根据路径判断去不去掉
                let remove:boolean = GridPathController.instance.isPointInSector(treePos,lastNode.getWorldPosition().clone(),aPos,bPos);
                if(!remove){
                    this.removeLastPoint();
                }

            }
            
        }
    }

    public ropeEnd(){
        this._end = true;
    }

    /** 移除所有挂点 */
    public removeAllPoint(){
        while(DataManager.Instance.ropePointList&&DataManager.Instance.ropePointList.length>0){
            this.removeLastPoint();
        }

    }

    /** 去掉最后一个挂点 */
    private removeLastPoint(){
        if(DataManager.Instance.ropePointList.length>0){
            let lastPoint:RopePoint = DataManager.Instance.ropePointList.pop();
            this.cannonWorld?.removeConstraint(lastPoint.pointConstraint);
            this.cannonWorld?.removeConstraint(lastPoint.distanceConstraint);
            lastPoint.pointNode.destroy();
            if(Vec3.strictEquals(lastPoint.tree,DataManager.Instance.bigTreePos)){
                let list = DataManager.Instance.ropePointList;
                let noBigTreePoint:boolean = true;
                for(let i = 0;i<list.length;i++){
                    if(Vec3.strictEquals(list[i].tree,DataManager.Instance.bigTreePos)){
                        noBigTreePoint = false;
                        break;
                    }
                }
                if(noBigTreePoint){
                    DataManager.Instance.ropeTrees.delete(lastPoint.tree.toString());
                }
            }else{
                DataManager.Instance.ropeTrees.delete(lastPoint.tree.toString());
            }
            

            this._updateNoMoveLen = true;

        }
    }

    private updateNoMoveLen(){
        this._noMoveLen = 0;
        const lastPoint:RopePoint = DataManager.Instance.ropePointList[DataManager.Instance.ropePointList.length-1];
        if(lastPoint){
            let noMoveIndedx = lastPoint.ropeNode.getSiblingIndex()+1;
            for(let i = noMoveIndedx; i < this.rope.length; i++){
                this._noMoveLen+= this.rope[i].getWorldScale().y;
            }
        }
        
    }

    // 清除绳子
    public clearRope() {
        
        // 移除所有约束
        if (this.joints.length > 0) {
            for (const joint of this.joints) {
                if (this.cannonWorld) {
                    this.cannonWorld.removeConstraint(joint);
                }
            }
            this.joints = [];
        }

        this.node.getComponent(RigidBody)?.destroy();
        
        // 移除所有节点
        for (const node of this.rope) {
            node.removeFromParent();
            DataManager.Instance.ropeManager.putRope(node);
        }
        this.rope = [];
        
        this.headConstraint = null;
        this.tailConstraint = null;
        this.head.destroy();
    }

    onDestroy() {
         if (this.rope.length < 2) return;
        // 清理资源
        this.clearRope();
    }

    /** 直接移除一半绳子节点 */
    public removeHalfRope() {
        let index = this.rope.length-20;
        while(index>3){
            //不是挂点再移除
            let deleteNode:boolean = true;
            if(DataManager.Instance.ropePointList.length>0){
                for(let i = 0;i<DataManager.Instance.ropePointList.length;i++){
                    let point:RopePoint = DataManager.Instance.ropePointList[i];
                    if(point.ropeNode === this.rope[index]){
                        deleteNode = false;
                    }
                }
            }
            if(deleteNode){
                this.removeRopeNode(index);
            }
            index -= 2;
        }
        if(this.rope.length>70){
            this.scheduleOnce(this.removeHalfRope,0.05);
        }
    }
}