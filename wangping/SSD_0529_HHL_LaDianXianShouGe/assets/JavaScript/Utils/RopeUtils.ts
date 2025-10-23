import { BoxCollider, CylinderCollider, RigidBody, Vec3 } from "cc";
import { DataManager } from "../Global/DataManager";
import { RopePoint } from "../Common/Type";

export default class RopeUtils {
    
    /**
     * 均匀化3D曲线点集
     * @param originalPoints 原始点集(Vec3数组)
     * @param targetCount 目标点数
     * @returns 均匀分布的新点集
     */
    public static uniformize(
        originalPoints: Vec3[],
        targetCount: number
    ): Vec3[] {
        // 1. 计算累积弧长
        const arcLengths: number[] = [0];
        for (let i = 1; i < originalPoints.length; i++) {
            const dist = Vec3.distance(originalPoints[i], originalPoints[i-1]);
            arcLengths.push(arcLengths[i-1] + dist);
        }
        const totalLength = arcLengths[arcLengths.length - 1];

        // 2. 生成均匀分布的点
        const uniformPoints: Vec3[] = [];
        for (let i = 0; i < targetCount; i++) {
            const targetLength = (totalLength * i) / (targetCount - 1);
            uniformPoints.push(this.getPointAtLength(originalPoints, arcLengths, targetLength));
        }

        return uniformPoints;
    }

    /**
     * 获取曲线上指定弧长位置的点
     */
    private static getPointAtLength(
        points: Vec3[],
        arcLengths: number[],
        targetLength: number
    ): Vec3 {
        // 找到目标弧长所在的线段
        let segmentIndex = 0;
        while (segmentIndex < arcLengths.length - 1 && 
               arcLengths[segmentIndex + 1] < targetLength) {
            segmentIndex++;
        }

        // 计算插值比例
        const segmentStart = points[segmentIndex];
        const segmentEnd = points[segmentIndex + 1];
        const segmentLength = arcLengths[segmentIndex + 1] - arcLengths[segmentIndex];
        const t = (targetLength - arcLengths[segmentIndex]) / segmentLength;
        if(!segmentEnd){
            return segmentStart.clone();
        }
        // 线性插值
        return new Vec3(
            segmentStart.x + (segmentEnd.x - segmentStart.x) * t,
            segmentStart.y + (segmentEnd.y - segmentStart.y) * t,
            segmentStart.z + (segmentEnd.z - segmentStart.z) * t
        );
    }

    /**
     * 判断点是否在圆内，并返回圆心坐标（若在圆内）
     * @param ropePos 点的坐标
     * @returns 圆心坐标 Vec3 或 null（不在任何圆内）
     */
    public static getCircleContainingPoint(ropePos:Vec3): Vec3 | null {
        let row:number = DataManager.Instance.treeRow;
        let col:number = DataManager.Instance.treeCol;
        let radius:number = DataManager.Instance.treeRadius + DataManager.Instance.wireRadius;
        let spacing:number = DataManager.Instance.treeSpace;
        const firstX:number = DataManager.Instance.firstTreePos.x;
        const firstZ:number = DataManager.Instance.firstTreePos.z;

        if(DataManager.Instance.bigTreeAlive){
            //先检查大树
            const bigPos:Vec3 = DataManager.Instance.bigTreePos;
            const bx:number = ropePos.x - bigPos.x;
            const bz:number = ropePos.z - bigPos.z;
            if(bx*bx+bz*bz<=Math.pow(DataManager.Instance.bigTreeRadius,2)){
                return bigPos.clone();
            }
        }

        // 计算最近的圆心索引
        const iNearest = Math.floor((ropePos.x - firstX) / spacing);
        const jNearest = Math.floor((ropePos.z - firstZ) / spacing);

        // 检查最近的 3x3 圆（防止点在边界附近）
        for (let i = Math.max(0, iNearest - 1); i <= Math.min(row - 1, iNearest + 1); i++) {
            for (let j = Math.max(0, jNearest - 1); j <= Math.min(col - 1, jNearest + 1); j++) {
                if(DataManager.Instance.bigTreeIndexList.indexOf(i*col+j)!=-1){
                    continue;
                }
                const cx = firstX + i * spacing;
                const cz = firstZ + j * spacing;
                const dx = ropePos.x - cx;
                const dz = ropePos.z - cz;
                if (dx * dx + dz * dz <= radius * radius) {
                    let treeParent = DataManager.Instance.treeManger.treeParent;
                    if(treeParent.getChildByName(`Tree_${i*col+j}`)){
                        //console.log("name is exist",`Tree_${i*col+j}`);
                        return new Vec3(cx,0,cz); // 点在圆内，返回圆心坐标
                    }else{
                        return null;
                    }
                }
            }
        }
        return null; // 点不在任何圆内
    }

    //设置刚体属性
    public static setRigidBody(newRb:RigidBody){
        newRb.type = RigidBody.Type.DYNAMIC;
            
        newRb.mass = 0.001;
        newRb.linearDamping = 0.8;
        newRb.angularDamping = 0.8;
        
        // 确保节点有圆柱体碰撞器用于渲染
        let collider = newRb.node.getComponent(BoxCollider);
        if (!collider) {
            collider = newRb.node.addComponent(BoxCollider);
            collider.size = new Vec3(0.05, 1.0, 0.05);
        }
    }

    /**
     * 
     * @param treePos 检测的树位置
     * @param currentPos  当前挂点位置
     * @returns 是否是大树且能挂
     */
    public static checkBigTreeAddPoint(treePos:Vec3,currentPos:Vec3):boolean{
        if(DataManager.Instance.bigTreeAlive&&Vec3.strictEquals(treePos,DataManager.Instance.bigTreePos)){
            if(DataManager.Instance.ropeTrees.get(treePos.toString())==null){
                return true;
            }

            let list:RopePoint[] = DataManager.Instance.ropePointList;
            if(list.length<=0){
                return false;
            }
            //距离中心点距离不能太小
            if(Vec3.squaredDistance(treePos,currentPos)<0.8*0.8){
                return false;
            }
            
            if(Vec3.strictEquals(treePos,list[list.length-1].tree)){
                const firstLen:number = 0.5;
                const secondLen:number = 0.8;
                //距离要大
                let dis:number = Vec3.squaredDistance(list[list.length-1].pointNode.getWorldPosition().clone(),currentPos.clone());
                if(dis>firstLen*firstLen){
                    // 如果上一个点也是大树 离再上一个点距离要更大
                    if(list.length<=1){
                        return true;  
                    }

                    if(!Vec3.strictEquals(treePos,list[list.length-2].tree)){
                        return true;
                    }

                    let dis2:number = Vec3.squaredDistance(list[list.length-2].pointNode.getWorldPosition().clone(),currentPos.clone());
                    if(dis2>secondLen*secondLen){
                        return true;
                    }
                }
            }
        }
        return false;
    }


}