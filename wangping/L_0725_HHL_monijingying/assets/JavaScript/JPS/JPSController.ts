import { Collider, Size, Vec3, Node, BoxCollider, CylinderCollider } from "cc";
import { DataManager } from "../Global/DataManager";
import JPSNode from "./JPSNode";
import JPS from "./JPS";
import JPSCheckTag from "./JPSCheckTag";
import { EventManager } from "../Global/EventManager";
import { EventName } from "../Common/Enum";
import { MathUtils } from "../Util/MathUtils";
import { makeCorde } from "./Corde";

export default class JPSController {
    private static _instance: JPSController;
    static get instance(): JPSController {
        if (!JPSController._instance) {
            JPSController._instance = new JPSController();
        }
        return JPSController._instance;
    }

    jpsNodes: Array<JPSNode<any, number>>;
    jpsLogic: JPS<JPSNode<any, number>, any, number>;
    private gridSize: number = 0; // 网格大小（单位：米）
    /** 初始坐标位置 */
    private originOffset: Vec3;
    private _mapSize: Size;

    constructor() {
        this.gridSize = 4;
        this.originOffset = DataManager.Instance.sceneManager.startPos.worldPosition.clone();
        this._mapSize = new Size(44, 40);

        this._jps = new JPS();
        this._goodTag = new JPSCheckTag(1); // 可通过标记
        this._badTag = new JPSCheckTag(0);  // 障碍物标记
        this.init();
    }

    /** 初始化 */
    public init(): void {
        this.jpsNodes = new Array();
        for (let h = 0; h < this._mapSize.width; h++) {
            for (let v = 0; v < this._mapSize.height; v++) {
                let index = v * this._mapSize.width + h;
                let astarNode = new JPSNode<any, number>();
                astarNode.corde = makeCorde(h, v);
                astarNode.myIndex = index;
                astarNode.myTag = this._goodTag;
                this.jpsNodes[index] = astarNode;
            }
        }
        this._jps.init(this.jpsNodes,
            this._goodTag,
            this._badTag,
            this._mapSize.width,
            this._mapSize.height);
    }

    private _jps: JPS<JPSNode<any, number>, any, number>;
    private _goodTag: JPSCheckTag<number>;
    private _badTag: JPSCheckTag<number>;

    public addOneObstacle(obstacle: Node, reset: boolean = false): void {
        let collider: Collider = obstacle.getComponent(Collider);
        if (!collider) return;

        let worldPos = MathUtils.localToWorldPos3D(collider.center.clone(), obstacle);
        const worldScale = obstacle.worldScale;
        if (collider instanceof BoxCollider) {
            this.markRotatedBoxAsObstacle(obstacle, collider);
        } else if (collider instanceof CylinderCollider) {
            // 处理圆柱碰撞器
            const radius = collider.radius * Math.max(worldScale.x, worldScale.z) + 2;
            const minPos = new Vec3(worldPos.x - radius, 0, worldPos.z - radius);
            const maxPos = new Vec3(worldPos.x + radius, 0, worldPos.z + radius);

            this.markAreaAsObstacle(minPos, maxPos);
        }
        EventManager.inst.emit(EventName.ReFindPath);
    }

    private markRotatedBoxAsObstacle(obstacle: Node, collider: BoxCollider): void {
        const worldScale = obstacle.worldScale;
        const size = collider.size.clone();
        size.x *= worldScale.x;
        size.z *= worldScale.z;

        const half = new Vec3(size.x / 2 + 2, 0, size.z / 2 + 2);

        // 本地空间的 4 个底面角点（忽略 y）
        const localCorners: Vec3[] = [
            new Vec3(-half.x, 0, -half.z),
            new Vec3(half.x, 0, -half.z),
            new Vec3(half.x, 0, half.z),
            new Vec3(-half.x, 0, half.z),
        ];

        // 转换到世界坐标
        const worldMatrix = obstacle.worldMatrix;
        const worldCorners = localCorners.map(corner => {
            let out = new Vec3();
            Vec3.transformMat4(out, corner.add(collider.center), worldMatrix);
            return out;
        });

        // 提取XZ平面的点
        const poly: { x: number, y: number }[] = worldCorners.map(p => ({ x: p.x, y: p.z }));

        // 包围盒范围（用于减少检测范围）
        let minX = Math.min(...poly.map(p => p.x));
        let maxX = Math.max(...poly.map(p => p.x));
        let minY = Math.min(...poly.map(p => p.y));
        let maxY = Math.max(...poly.map(p => p.y));

        const minGrid = this.worldToGrid(new Vec3(minX, 0, minY));
        const maxGrid = this.worldToGrid(new Vec3(maxX, 0, maxY));

        // 网格空间的 4角点（忽略 y）
        const polyGrid: { x: number, y: number }[] = [
            { x: minGrid.x, y: minGrid.y },
            { x: maxGrid.x, y: minGrid.y },
            { x: maxGrid.x, y: maxGrid.y },
            { x: minGrid.x, y: maxGrid.y },
        ];

        for (let gx = minGrid.x; gx <= maxGrid.x; gx++) {
            for (let gy = minGrid.y; gy <= maxGrid.y; gy++) {
                const pt = { x: gx, y: gy };
                if (this.isPointInPolygon(pt, polyGrid)) {
                    const index = gy * this._mapSize.width + gx;
                    if (index >= 0 && index < this.jpsNodes.length) {
                        this.jpsNodes[index].myTag = this._badTag;
                    }
                }
            }
        }
    }

    private markAreaAsObstacle(minWorldPos: Vec3, maxWorldPos: Vec3): void {
        const minGrid = this.worldToGrid(minWorldPos);
        const maxGrid = this.worldToGrid(maxWorldPos);

        // 确保在有效范围内
        const startX = Math.max(0, minGrid.x);
        const startY = Math.max(0, minGrid.y);
        const endX = Math.min(this._mapSize.width - 1, maxGrid.x);
        const endY = Math.min(this._mapSize.height - 1, maxGrid.y);

        // 标记范围内的所有网格
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const index = y * this._mapSize.width + x;
                if (index >= 0 && index < this.jpsNodes.length) {
                    this.jpsNodes[index].myTag = this._badTag;
                }
            }
        }

        //更新周边所有跳点
        //this._jps.updateAroundJumpPoint(minGrid,maxGrid);
    }

    /**
     * 寻路方法
     * @param startWorldPos 起始世界坐标
     * @param endWorldPos 目标世界坐标
     * @returns 路径点数组(世界坐标)
     */
    public findPath(startWorldPos: Vec3, endWorldPos: Vec3): Vec3[] {
        let startGrid = this.worldToGrid(startWorldPos);
        let endGrid = this.worldToGrid(endWorldPos);

        let startNode = this.getNodeAt(startGrid.x, startGrid.y);
        let endNode = this.getNodeAt(endGrid.x, endGrid.y);

        if (!startNode || !endNode) return [];
        if (startNode.myIndex === endNode.myIndex) {
            return [];
        }
        let pathNodes = this._jps.findPath(
            startNode,
            endNode
        );

        console.log("====================>", pathNodes);

        if (!pathNodes) return [endWorldPos];

        return pathNodes.map(node => this.gridToWorldCenter(node.corde.x, node.corde.y));
    }

    private getNodeAt(x: number, y: number): JPSNode<any, number> | null {
        if (x < 0 || y < 0 || x >= this._mapSize.width || y >= this._mapSize.height) {
            return null;
        }
        return this.jpsNodes[y * this._mapSize.width + x];
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

    /** 点是否在多边形内部（含边界） */
    private isPointInPolygon(pt: { x: number, y: number }, poly: { x: number, y: number }[]): boolean {
        // 1. 边界检测：点是否在任意一条边上
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const x1 = poly[j].x, y1 = poly[j].y;
            const x2 = poly[i].x, y2 = poly[i].y;

            // 判断 pt 是否在线段 (x1,y1)-(x2,y2) 上
            const cross = (pt.x - x1) * (y2 - y1) - (pt.y - y1) * (x2 - x1);
            if (Math.abs(cross) < 1e-6) {
                const dot = (pt.x - x1) * (pt.x - x2) + (pt.y - y1) * (pt.y - y2);
                if (dot <= 0) {
                    return true; // 在边上
                }
            }
        }

        // 2. 射线法（奇偶规则）
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i].x, yi = poly[i].y;
            const xj = poly[j].x, yj = poly[j].y;
            const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
                (pt.x <= (xj - xi) * (pt.y - yi) / (yj - yi + 1e-12) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

}