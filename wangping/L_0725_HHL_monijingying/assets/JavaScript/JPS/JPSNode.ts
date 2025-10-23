// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Corde } from "./Corde";
import JPSCheckTag from "./JPSCheckTag";

export default class JPSNode<DATA, TAG> {
    public static JPS_DIR = {
        NONE: -1,
        L: 1,          // 左
        R: 1 << 1,     // 右
        U: 1 << 2,     // 上
        D: 1 << 3,     // 下
        LU: 1 << 4,    // 左上
        LD: 1 << 5,    // 左下
        RU: 1 << 6,    // 右上
        RD: 1 << 7     // 右下
    }

    // 常量对象，存储斜角方向及其分解结果
    public static DIRECTION_CACHE = {
        [JPSNode.JPS_DIR.LD]: [JPSNode.JPS_DIR.L, JPSNode.JPS_DIR.D],
        [JPSNode.JPS_DIR.RD]: [JPSNode.JPS_DIR.R, JPSNode.JPS_DIR.D],
        [JPSNode.JPS_DIR.LU]: [JPSNode.JPS_DIR.L, JPSNode.JPS_DIR.U],
        [JPSNode.JPS_DIR.RU]: [JPSNode.JPS_DIR.R, JPSNode.JPS_DIR.U],
    };

    corde: Corde;           // 当前节点的坐标
    myIndex: number;        // 当前节点的索引
    parentIndex: number;    // 父节点的索引
    customData: DATA;       // 用户自定义数据

    currentDir: number;     // 当前节点的方向
    myTag: JPSCheckTag<TAG>; // 当前节点的标签

    f: number;  // f = g + h
    g: number;  // 到起点的代价
    h: number;  // 到终点的代价

    isJump: boolean;  // 是否为跳点

    visitCount: number;  // 访问次数

    // 跳点直线距离记录
    jumpDistances: { [direction: number]: number } = {};

    constructor() {
        this.parentIndex = -1;
        this.myIndex = -1;
        this.currentDir = JPSNode.JPS_DIR.NONE;
        this.isJump = false;
        this.visitCount = 0;
        
        //初始化可达方向（此时所有方向都为可达）
        // const directions = [
        //     JPSNode.JPS_DIR.L, JPSNode.JPS_DIR.R, JPSNode.JPS_DIR.U, JPSNode.JPS_DIR.D
        // ];
        // const directions2 = [
        //     JPSNode.JPS_DIR.LU, JPSNode.JPS_DIR.LD, JPSNode.JPS_DIR.RU, JPSNode.JPS_DIR.RD
        // ];
        // for (let dir of directions) {
        //     this.jumpDistances[dir] = 10;
        // }
        // for (let dir of directions2) {
        //     this.jumpDistances[dir] = 14;
        // }
    }

    // 判断当前节点是否有父节点
    public hasParent(): boolean {
        return this.parentIndex !== -1;
    }

    // 设置跳点方向的可达性
    public setDirection(direction: number) {
        this.currentDir = direction;
    }

    // 获取当前节点所有有效方向的可达性
    public getReachableDirections(): number[] {
        const directions: number[] = [];
        for (const dir in JPSNode.JPS_DIR) {
            const direction = JPSNode.JPS_DIR[dir];
            if (this.isDirectionReachable(direction)) {
                directions.push(direction);
            }
        }
        return directions;
    }

    // 判断当前节点某个方向是否可达
    public isDirectionReachable(direction: number): boolean {
        return (this.currentDir & direction) !== 0;
    }

    // 更新可达性和跳点直线距离
    public setJumpDistance(direction: number, distance:number) {
        this.jumpDistances[direction] = distance;
    }

    public getDistanceByDir(dir:number):number{
        return this.jumpDistances[dir];
    }

    // 计算直线距离（曼哈顿距离或对角线距离）
  public calculateDistance(node: JPSNode<DATA, TAG>): number {
    const dx = Math.abs(this.corde.x - node.corde.x);
    const dy = Math.abs(this.corde.y - node.corde.y);
    if (dx === dy) {
      // 对角线方向
      return dx*14; // 或者 dy，两者相等
    } else {
      // 水平或垂直方向
      return (dx + dy)*10;
    }
  }
}
