import { Vec2, Vec3,Node } from "cc";
import { DataManager } from "../Global/DataManager";
import { EventManager } from "../Global/EventManager";
import { EventName } from "../Common/Enum";
import { RopePoint, TreeAniData } from "../Common/Type";

export default class GridPathController {
    private static _instance: GridPathController;
    static get instance(): GridPathController {
        if(!GridPathController._instance){
            GridPathController._instance = new GridPathController();
        }
        return GridPathController._instance;
    }

    /** 玩家路径点 */
    public path: { x: number, y: number }[] = [];


    private gridSize: number = 0; // 网格大小（单位：米）
    /** 初始坐标位置 */
    private originOffset: Vec3;
    public treeDistance: number = 0; // 绳子与树的距离
    


    constructor(){
        this.gridSize = DataManager.Instance.treeSpace;
        this.originOffset = DataManager.Instance.firstTreePos.clone();
        this.treeDistance = DataManager.Instance.wireRadius + DataManager.Instance.treeRadius;
    }

    /** 清空路径 */
    public cleanPath(){
        this.path = [];
    }

    /**
     * 更新路径（每帧调用）
     * @param worldPosition 人物的世界坐标
     */
    public updatePath(worldPosition: Vec3) {
        const gridPos = this.worldToGrid(worldPosition);
        
        // 如果路径为空或当前位置不等于最后一个点，则处理
        if (this.path.length === 0 || 
            !this.isSameGrid(gridPos, this.path[this.path.length - 1])) {
            if(!this.handleBacktracking(gridPos)){
                this.path.push(gridPos); // 添加新点
                this.treePlayAni(this.path[this.path.length - 1],this.path[this.path.length - 2]);
            }
            
            //console.log(`path  ${JSON.stringify(this.path)}`);
        }

    }



    /**
     * 检测并处理回退路径
     */
    private handleBacktracking(newGridPos: { x: number, y: number }):boolean {

        if(this.path.length === 0){
            return false;
        }

        if (this.isSameGrid(newGridPos, this.path[this.path.length - 1])) {
            // 发现回退，删除回退部分
            const removePos = this.path.pop(); // 保留到匹配点，删除后续点
            this.treePlayAni(this.path[this.path.length - 1],removePos);
            return true;
        }
        return false;
    }

    /**
     * 世界坐标转网格坐标（考虑初始偏移）
     */
    private worldToGrid(worldPos: Vec3): { x: number, y: number } {
        return {
            x: Math.floor((worldPos.x - this.originOffset.x) / this.gridSize),
            y: Math.floor((worldPos.z - this.originOffset.z) / this.gridSize) // 假设z轴为2D平面y轴
        };
    }

    /**
     * 将网格坐标转换为网格中心的世界坐标
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 世界坐标（Vec3）
     */
    public gridToWorldCenter(gridX: number, gridY: number): Vec3 {
        return new Vec3(
            gridX * this.gridSize + this.originOffset.x + this.gridSize / 2,
            0, 
            gridY * this.gridSize + this.originOffset.z + this.gridSize / 2
        );
    }

    /**
     * 判断两个网格坐标是否相同
     */
    private isSameGrid(
        a: { x: number, y: number },
        b: { x: number, y: number }
    ): boolean {
        return a.x === b.x && a.y === b.y;
    }

    /** 人过树动  */
    private treePlayAni(pos:{ x: number, y: number },lastPos:{ x: number, y: number }){
        if(pos&&lastPos){
            const angle:number = 10;
            //获取周围4棵树  右上 左上 右下 左下
            let trees = [pos,{x:pos.x,y:pos.y+1},{x:pos.x+1,y:pos.y},{x:pos.x+1,y:pos.y+1}];
            //确定哪两棵树播放动画，以及动画方向
            let treeAnis:TreeAniData [] = [];
            if(pos.x>lastPos.x){
                treeAnis.push({dir:new Vec3(-angle,0,0),tree:trees[0]});
                treeAnis.push({dir:new Vec3(angle,0,0),tree:trees[1]});
            }else if(pos.x<lastPos.x){
                treeAnis.push({dir:new Vec3(-angle,0,0),tree:trees[2]});
                treeAnis.push({dir:new Vec3(angle,0,0),tree:trees[3]});
            }else if(pos.y>lastPos.y){
                treeAnis.push({dir:new Vec3(0,0,angle),tree:trees[0]});
                treeAnis.push({dir:new Vec3(0,0,-angle),tree:trees[2]});
            }else if(pos.y<lastPos.y){
                treeAnis.push({dir:new Vec3(0,0,angle),tree:trees[1]});
                treeAnis.push({dir:new Vec3(0,0,-angle),tree:trees[3]});
            }

            if(treeAnis.length>0){
                //播放动画
                EventManager.inst.emit(EventName.TreeFallAniPlay,treeAnis);
            }

        }
    }

    /*********   绳子相关******************************* */


    /**
     * 判断点是否在扇形区域内
     * @param P 待测点 (Vec3)
     * @param O 圆心 (Vec3)
     * @param A 圆上点1 (Vec3)
     * @param B 圆上点2 (Vec3)
     * @returns 是否在扇形内 (boolean)
     */
    public isPointInSector(
        P: Vec3,
        O: Vec3,
        A: Vec3,
        B: Vec3
    ): boolean {
        // 2. 半径
        const radius = 3; // 假设 |OA| = |OB|
        // 1. 计算向量
        let OA = A.subtract(O);
        let OB = B.subtract(O);
        let OP = P.subtract(O);

        OA.y = 0;
        OB.y = 0;
        OP.y = 0;

        OA = OA.normalize();
        OA = OA.multiplyScalar(radius);
        OB = OB.normalize();
        OB = OB.multiplyScalar(radius);

        
        if (OP.length() > radius) {
            return false;
        }

        // 3. 计算叉积和点积
        const crossOA_OP = Vec3.cross(new Vec3(), OA, OP).y; // 取y分量（2D叉积）
        const crossOB_OP = Vec3.cross(new Vec3(), OB, OP).y;
        const dotOA_OP = Vec3.dot(OA, OP);
        const dotOB_OP = Vec3.dot(OB, OP);

        // 4. 判断方向
        const isBetweenOAAndOB = (crossOA_OP >= 0 && crossOB_OP <= 0);

        // 5. 检查夹角是否 <180°（避免扇形定义错误）
        const crossOA_OB = Vec3.cross(new Vec3(), OA, OB).y;
        if (crossOA_OB === 0) {
            return false; // OA和OB共线，无法构成扇形
        }

        return isBetweenOAAndOB;
    }

    /**
     * 判断点是否在多边形内（XZ平面）
     * @param polygon 多边形顶点数组，按顺序排列
     * @param point 要判断的点
     * @returns 是否在多边形内
     */
    private isPointInPolygonNew(polygon: Vec3[], point: Vec3): boolean {
        const x = point.x;
        const z = point.z;
        let inside = false;
        
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, zi = polygon[i].z;
            const xj = polygon[j].x, zj = polygon[j].z;
            
            const intersect = ((zi > z) !== (zj > z))
                && (x < (xj - xi) * (z - zi) / (zj - zi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    }

    /**
     * 获取所有在多边形内的树
     * @returns 在多边形内的树的index数组
     */
    public getPointsInsideTrees(): number[] {
        let polygon: Vec3[] = [];
        let ropeList = DataManager.Instance.ropeParentNode.children;
        for(let i=0;i<ropeList.length;i++){
            let rope = ropeList[i];
            let ropePos = rope.getWorldPosition().clone();
            polygon.push(new Vec3(ropePos.x,0,ropePos.z));
        }
        //所有还在的树
        let trees:number[]=[];
        let TreeNodes = DataManager.Instance.treeManger.treeParent.children;
        for (let i = 0; i < TreeNodes.length; i++) {
            //是否是挂点
            if(this.treeIsPoint(TreeNodes[i])){
                let index:number = parseInt(TreeNodes[i].name.substring(5));
                trees.push(index);
                continue;
            }
            //是否在多边形内
            if(this.isPointInPolygonNew(polygon, TreeNodes[i].getWorldPosition().clone())){
                let index:number = parseInt(TreeNodes[i].name.substring(5));
                trees.push(index);
            }
        }
        //大树
        if(DataManager.Instance.bigTreeAlive&&DataManager.Instance.wireLen === DataManager.Instance.wireSecendLen){
            if(this.isPointInPolygonNew(polygon, DataManager.Instance.treeManger.bigTreeNode.getWorldPosition().clone())){
                trees.unshift(-1);
            }
        }
        return trees;
    }

    /**
     * 判断树是不是挂点
     * @param tree 树的节点
     */
    public treeIsPoint(tree:Node){
        let pointList:RopePoint[] = DataManager.Instance.ropePointList;
        for(let i =0;i<pointList.length;i++){
            if(pointList[i].tree.equals(tree.getWorldPosition().clone())){
                return true;
            }
        }
        return false;
    }

}