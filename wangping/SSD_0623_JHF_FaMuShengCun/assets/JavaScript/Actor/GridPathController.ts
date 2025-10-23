import { Vec2, Vec3, Node } from "cc";
import { DataManager } from "../Global/DataManager";
import { EventManager } from "../Global/EventManager";
import { TreeAniData } from "../Enum/Index";

export default class GridPathController {
    private static _instance: GridPathController;
    static get instance(): GridPathController {
        if (!GridPathController._instance) {
            GridPathController._instance = new GridPathController();
        }
        return GridPathController._instance;
    }

    /** 玩家路径点 */
    public path: { x: number, y: number }[] = [];


    private gridSizeX: number = 0; // 网格大小（单位：米）
    private gridSizeZ: number = 0; // 网格大小（单位：米）
    /** 初始坐标位置 */
    private originOffset: Vec3;

    constructor() {
        this.gridSizeX = DataManager.Instance.treeManager.treeSpacingX;
        this.gridSizeZ = DataManager.Instance.treeManager.treeSpacingZ;
        this.originOffset = DataManager.Instance.treeManager.treeStartPoint;
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
            this.path.push(gridPos); // 添加新点
            this.treePlayAni(this.path[this.path.length - 1], this.path[this.path.length - 2]);
            if (this.path.length > 2) {
                this.path.shift();
            }
        }

    }

    /**
     * 世界坐标转网格坐标（考虑初始偏移）
     */
    private worldToGrid(worldPos: Vec3): { x: number, y: number } {
        return {
            x: Math.floor((worldPos.x - this.originOffset.x) / this.gridSizeX),
            y: Math.floor((worldPos.z - this.originOffset.z) / this.gridSizeZ) // 假设z轴为2D平面y轴
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
            gridX * this.gridSizeX + this.originOffset.x + this.gridSizeX / 2,
            0,
            gridY * this.gridSizeZ + this.originOffset.z + this.gridSizeZ / 2
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
    private treePlayAni(pos: { x: number, y: number }, lastPos: { x: number, y: number }) {
        if (pos && lastPos) {
            const angle: number = 10;
            //获取周围4棵树  右上 左上 右下 左下
            let trees = [pos, { x: pos.x, y: pos.y + 1 }, { x: pos.x + 1, y: pos.y }, { x: pos.x + 1, y: pos.y + 1 }];
            //确定哪两棵树播放动画，以及动画方向
            let treeAnis: TreeAniData[] = [];
            if (pos.x > lastPos.x) {
                treeAnis.push({ dir: new Vec3(-angle, 0, 0), tree: trees[0] });
                treeAnis.push({ dir: new Vec3(angle, 0, 0), tree: trees[1] });
            } else if (pos.x < lastPos.x) {
                treeAnis.push({ dir: new Vec3(-angle, 0, 0), tree: trees[2] });
                treeAnis.push({ dir: new Vec3(angle, 0, 0), tree: trees[3] });
            } else if (pos.y > lastPos.y) {
                treeAnis.push({ dir: new Vec3(0, 0, angle), tree: trees[0] });
                treeAnis.push({ dir: new Vec3(0, 0, -angle), tree: trees[2] });
            } else if (pos.y < lastPos.y) {
                treeAnis.push({ dir: new Vec3(0, 0, angle), tree: trees[1] });
                treeAnis.push({ dir: new Vec3(0, 0, -angle), tree: trees[3] });
            }

            if (treeAnis.length > 0) {
                //播放动画
                DataManager.Instance.treeManager.playAni(treeAnis);
            }

        }
    }
}