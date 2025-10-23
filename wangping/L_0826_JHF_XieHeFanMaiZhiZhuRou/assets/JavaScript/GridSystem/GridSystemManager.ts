import { Vec3, Node } from 'cc';

export class GridSystemManager {
    private gridSize: number;
    private gridMap: Map<string, Set<Node>> = new Map();
    private nodeGridKey: Map<Node, string> = new Map();

    constructor(gridSize: number = 5) {
        this.gridSize = gridSize;
    }

    private getGridKey(pos: Vec3): string {
        const gx = Math.floor(pos.x / this.gridSize);
        const gz = Math.floor(pos.z / this.gridSize);
        return `${gx}_${gz}`;
    }

    // 注册或更新怪物位置
    public updateNode(node: Node) {
        if (!node || !node.worldPosition) return;

        const newKey = this.getGridKey(node.worldPosition);
        const lastKey = this.nodeGridKey.get(node);

        if (lastKey === newKey) return; // 没移动出格子

        // 1. 旧格子移除
        if (lastKey && this.gridMap.has(lastKey)) {
            this.gridMap.get(lastKey)?.delete(node);
        }

        // 2. 新格子添加
        if (!this.gridMap.has(newKey)) {
            this.gridMap.set(newKey, new Set());
        }
        this.gridMap.get(newKey)!.add(node);

        // 3. 记录新位置
        this.nodeGridKey.set(node, newKey);
    }

    // 获取攻击范围内的怪物（粗略）
    public getNearbyNodes(centerPos: Vec3, range: number): Node[] {
        const result: Node[] = [];
        const cx = Math.floor(centerPos.x / this.gridSize);
        const cz = Math.floor(centerPos.z / this.gridSize);
        const r = Math.ceil(range / this.gridSize);

        for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
                const key = `${cx + dx}_${cz + dz}`;
                const set = this.gridMap.get(key);
                if (set) {
                    for (const node of set) {
                        result.push(node);
                    }
                }
            }
        }

        return result;
    }

    // 移除节点
    public removeNode(node: Node) {
        const key = this.nodeGridKey.get(node);
        if (key && this.gridMap.has(key)) {
            this.gridMap.get(key)?.delete(node);
        }
        this.nodeGridKey.delete(node);
    }

    // 清理数据
    public clear() {
        this.gridMap.clear();
        this.nodeGridKey.clear();
    }
}
