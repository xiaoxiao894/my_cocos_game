import { _decorator, BoxCollider, Collider, Color, Component, debug, director, geometry, Node, SphereCollider, Vec2, Vec3 } from 'cc';
import Singleton from '../Base/Singleton';
import { DataManager } from '../Global/DataManager';

class FlowCell {
    cost: number = 0;       // 到达玩家的代价
    direction: Vec2 = new Vec2(0, 0); // 移动方向
}
/**
 * 流场避障算法
 */
export class FlowField extends Singleton {

    
    private _gridSize = 1; // 每个格子的大小（世界单位）
    
    private _gridWidth = 50; // 网格宽度（格子数）
    
    private _gridHeight = 50; // 网格高度（格子数）

    private _grid: FlowCell[][] = [];
    private _obstacles: Vec3[] = []; // 静态障碍物位置

    static get Instance() {
        return super.GetInstance<FlowField>();
    }

    public init(obstacles:Node[]) {
        // 初始化网格
        this._grid = new Array(this._gridWidth);
        for (let x = 0; x < this._gridWidth; x++) {
            this._grid[x] = new Array(this._gridHeight);
            for (let y = 0; y < this._gridHeight; y++) {
                this._grid[x][y] = new FlowCell();
            }
        }
        // 初始化障碍物（新增代码）
        this._obstacles = [];
        this.registerObstacles(obstacles);
        this.updateFlowField(DataManager.Instance.player?.node?.getWorldPosition()?.clone());
    }

    /**
     * 注册所有静态障碍物
     */
    private registerObstacles(obstacles:Node[]) {
        //方式1：通过节点
        for (const node of obstacles) {
            let width:number=1;
            let height :number = 1;
            let collider:Collider = node.getComponent(Collider);
            if(collider){
                if ('radius' in collider) {
                    // 类型推断为 SphereCollider
                    width = (collider as any).radius * 2;
                    height = width;
                } else if ('size' in collider) {
                    // 类型推断为 BoxCollider
                    const size = (collider as any).size;
                    width = size.x;
                    height = size.z ; 
                }
                //this.addLargeObstacle(node.worldPosition,width,height);
                this.addObstacle(node.worldPosition);
            }
            
        }
    }

    /**
     * 添加单个障碍物
     * @param worldPos 世界坐标
     */
    public addObstacle(worldPos: Vec3) {
        const gridPos = this.worldToGrid(worldPos);
        if (this.isValidGrid(gridPos)) {
            this._obstacles.push(worldPos.clone());
            console.log(`障碍物添加在网格: [${gridPos.x},${gridPos.y}]`);
        }
    }

    public addLargeObstacle(centerPos: Vec3, width: number, height: number) {
        console.log(`大障碍物: [${width},${height}]`);
        for (let dx = -width/2; dx <= width/2; dx++) {
            for (let dy = -height/2; dy <= height/2; dy++) {
                this.addObstacle(centerPos.add(new Vec3(dx, 0, dy)));
            }
        }
    }

    // 更新流场（玩家位置变化时调用）
    public updateFlowField(playerWorldPos: Vec3) {
        if(!playerWorldPos){
            return;
        }
        // 1. 转换玩家位置到网格坐标
        const playerGridPos = this.worldToGrid(playerWorldPos);

        // 2. 重置所有格子代价
        for (let x = 0; x < this._gridWidth; x++) {
            for (let y = 0; y < this._gridHeight; y++) {
                this._grid[x][y].cost = Infinity;
            }
        }

        // 3. 从玩家位置开始广度优先搜索（BFS）
        const queue: Vec2[] = [playerGridPos];
        this._grid[playerGridPos.x][playerGridPos.y].cost = 0;

        while (queue.length > 0) {
            const current = queue.shift()!;
            const currentCost = this._grid[current.x][current.y].cost;

            // 检查4个相邻格子（上、下、左、右）
            const neighbors = [
                new Vec2(current.x, current.y + 1),
                new Vec2(current.x, current.y - 1),
                new Vec2(current.x + 1, current.y),
                new Vec2(current.x - 1, current.y)
            ];

            for (const neighbor of neighbors) {
                if (this.isValidGrid(neighbor)) {
                    // 计算新代价 = 当前代价 + 移动成本（障碍物则成本极高）
                    const moveCost = this.isObstacle(neighbor) ? 1000 : 1;
                    const newCost = currentCost + moveCost;

                    if (newCost < this._grid[neighbor.x][neighbor.y].cost) {
                        this._grid[neighbor.x][neighbor.y].cost = newCost;
                        queue.push(neighbor);

                        // 记录移动方向（指向更低代价的邻居）
                        const dir = new Vec2(
                            current.x - neighbor.x,
                            current.y - neighbor.y
                        ).normalize();
                        this._grid[neighbor.x][neighbor.y].direction = dir;
                    }
                }
            }
        }
    }

    // 辅助方法：世界坐标转网格坐标
    public worldToGrid(worldPos: Vec3): Vec2 {
        return new Vec2(
            Math.floor(worldPos.x / this._gridSize + this._gridWidth / 2),
            Math.floor(worldPos.z / this._gridSize + this._gridHeight / 2) // 3D游戏用z轴
        );
    }

    // 检查是否为障碍物
    private isObstacle(gridPos: Vec2): boolean {
        return this._obstacles.some(obs => {
            const obsGridPos = this.worldToGrid(obs);
            return obsGridPos.equals(gridPos);
        });
    }

    /**
     * 检查网格坐标是否在有效范围内
     */
    private isValidGrid(gridPos: Vec2): boolean {
        // 使用Number.isInteger更严格地检查整数索引
        return (
            Number.isInteger(gridPos.x) &&
            Number.isInteger(gridPos.y) &&
            gridPos.x >= 0 && 
            gridPos.x < this._gridWidth &&
            gridPos.y >= 0 && 
            gridPos.y < this._gridHeight
        );
    }

    /**
     * 将网格坐标转换为世界坐标
     * @param gridPos 网格坐标 (x,y 表示网格行列索引)
     * @param yHeight 世界Y轴高度（默认0）
     */
    private gridToWorld(gridPos: Vec2, yHeight: number = 0): Vec3 {
        // 计算世界坐标（假设网格原点在场景中心）
        return new Vec3(
            (gridPos.x - this._gridWidth / 2) * this._gridSize,
            yHeight, // Y轴高度
            (gridPos.y - this._gridHeight / 2) * this._gridSize // 3D用Z轴
        );
    }

    /**
     * 获取指定网格的移动方向
     * @param gridPos 网格坐标
     * @returns 归一化的方向向量 (Vec2)
     */
    public getDirection(gridPos: Vec2): Vec2 {
        if (!this.isValidGrid(gridPos)) {
            return Vec2.ZERO;
        }
        // 返回预计算的方向（流场生成时已归一化）
        return this._grid[gridPos.x][gridPos.y].direction.clone();
    }


}


