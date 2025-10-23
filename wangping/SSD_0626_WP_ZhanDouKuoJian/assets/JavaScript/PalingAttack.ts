import { _decorator, Node, Vec3 } from 'cc';
import { App } from './App';

const { ccclass } = _decorator;

/** 围栏数据接口定义 */
interface PalingData {
    node: Node;
    curNum: number;
    maxNum: number;
    distance: number;
}

/** 围栏边界 */
interface PalingBounding {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}

@ccclass('PalingAttack')
export class PalingAttack {
    private static _instance: PalingAttack | null = null;

    /** 获取单例实例 */
    public static get Instance(): PalingAttack {
        if (!this._instance) {
            this._instance = new PalingAttack();
        }
        return this._instance;
    }

    /** 围栏攻击数据映射表，key为节点uuid */
    private attackPaling: Record<string, PalingData> = {};

    /** 围栏边界 3个等级的节点对应的边界 */
    private _palingBoundings: PalingBounding[] = [];

    /** 围栏2状态  0 中间一块 1中间一块+右边一块 2中间一块+左边一块 3全部 */
    private _paling2State: number = 0;

    /**
     * 设置可被攻击的围栏
     * 从场景节点中获取围栏并初始化其攻击数据
     */
    setPaling(level: number = 1): void {
        // 空值检查，避免访问undefined的属性
        if (!App || !App.sceneNode) {
            // console.warn('App或sceneNode未初始化');
            return;
        }


        this.attackPaling = {}; // 重置数据
        if (level == 1) {
            const attackPalingLevel_1 = App.sceneNode.attackPalingLevel_1 || [];
            attackPalingLevel_1.forEach((node) => {
                this.addOneAttack(node);
            });
        } else if (level == 2) {
            const attackPalingLevel_2 = App.sceneNode.attackPalingLevel_2 || [];
            attackPalingLevel_2.forEach((node) => {
                this.addOneAttack(node);
            });
        } else if (level == 3) {
            const attackPalingLevel_3 = App.sceneNode.attackPalingLevel_3 || [];
            attackPalingLevel_3.forEach((node) => {
                this.addOneAttack(node);
            });
        } else if (level == 4) {
            [
                ...(App.sceneNode.attackPalingLevel_3 || []),
                ...(App.sceneNode.attackPalingLevel_4 || [])
            ].forEach(node => this.addOneAttack(node));
        }



        // // 初始化围栏数据
        // if(App.sceneNode.palingLevels[0].active){
        //     const attackPalingLevel_1 = App.sceneNode.attackPalingLevel_1 || [];
        //     attackPalingLevel_1.forEach((node) => {
        //         this.addOneAttack(node);
        //     });
        // }
        // if(App.sceneNode.palingLevels[1].active){
        //     const attackPalingLevel_2 = App.sceneNode.attackPalingLevel_2 || [];
        //     attackPalingLevel_2.forEach((node) => {
        //         let showNode:boolean = false;
        //         if(node.active &&node.parent.active){
        //             if(!App.sceneNode.palingLevels[5].active){
        //                 showNode = true;
        //             // }else if(node.name ==="erjichengmen"||node.name ==="erjichengqiang01"||node.name ==="erjichengqiang02"){
        //             //     showNode = false;
        //             // }else{
        //              //   showNode = true;
        //             }

        //         }
        //         if(showNode){
        //             this.addOneAttack(node);
        //         }
        //     });
        // }
        // if(App.sceneNode.palingLevels[2].active){
        //     const attackPalingLevel_3 = App.sceneNode.attackPalingLevel_3 || [];
        //     attackPalingLevel_3.forEach((node) => {
        //         this.addOneAttack(node);
        //     });
        // }
        App.enemyController.resetEnemyAttackPaling();
    }

    private addOneAttack(node: Node) {
        const nodeId = node.uuid;
        this.attackPaling[nodeId] = {
            node,
            curNum: 0,
            maxNum: 2,
            distance: 2
        };
    }

    /**
     * 返回最近的围栏
     * @returns 符合条件的围栏数据或null
     */
    getNearstPaling(pos: Vec3): PalingData | null {

        let nearestGuardrail = null; //最近围栏
        let minDistSqr = Infinity;   //最近距离

        for (const key in this.attackPaling) {
            if (this.attackPaling.hasOwnProperty(key)) {
                const paling = this.attackPaling[key];
                if (paling.curNum < paling.maxNum) {
                    let disSqr: number = Vec3.squaredDistance(paling.node.getWorldPosition(), pos);
                    if (disSqr < minDistSqr) {
                        minDistSqr = disSqr;
                        nearestGuardrail = paling;
                    }
                }
            }
        }

        // 如果没有符合条件的围栏，返回null
        if (!nearestGuardrail) {
            return null;
        }

        // 返回最近的围栏
        return nearestGuardrail;
    }

    /**
     * 获取所有围栏的数据
     */
    getAllPaling(): Record<string, PalingData> {
        const result: Record<string, PalingData> = {};
        for (const key in this.attackPaling) {
            if (this.attackPaling.hasOwnProperty(key)) {
                result[key] = { ...this.attackPaling[key] };
            }
        }
        return result;
    }

    /**
     * 根据节点UUID获取特定围栏数据
     * @param uuid 节点UUID
     * @returns 围栏数据或undefined
     */
    getPalingByUuid(uuid: string): PalingData | undefined {
        return this.attackPaling[uuid];
    }

    /**
     * 更新围栏的当前数值
     * @param uuid 节点UUID
     * @param newCurNum 新的当前数值
     * @returns 是否更新成功
     */
    updatePalingCurNum(uuid: string, newCurNum: number): boolean {
        const paling = this.attackPaling[uuid];
        if (paling) {
            paling.curNum = newCurNum;
            return true;
        }
        return false;
    }

    /** 判断是否在栅栏边界内 */
    public inPalingsByLevel(level: number, pos: Vec3): boolean {
        if (this._palingBoundings.length === 0) {
            this.updateBounding();
        } else if (this._paling2State !== 3) {
            this.updatePaling2Bounding();
        }
        const bounding = this._palingBoundings[level - 1];
        if (bounding) {
            return pos.x >= bounding.minX && pos.x <= bounding.maxX && pos.z >= bounding.minZ && pos.z <= bounding.maxZ;
        }
        console.error(`没有找到对应栅栏的边界 ${level}`);
        return false;
    }

    /** 更新栅栏边界 */
    private updateBounding(): void {
        let palings: Node[] = App.sceneNode.palingLevels;
        for (const paling of palings) {
            let minX = Infinity, maxX = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;

            for (const palingNode of paling.children) {

                const palingPos = palingNode.worldPosition;
                minX = Math.min(minX, palingPos.x);
                maxX = Math.max(maxX, palingPos.x);
                minZ = Math.min(minZ, palingPos.z);
                maxZ = Math.max(maxZ, palingPos.z);
            }

            this._palingBoundings.push({ minX, maxX, minZ, maxZ });
        }
    }

    /** 单独更新2级围栏边界 */
    private updatePaling2Bounding(): void {
        let newState: number = 0;
        let palings: Node[] = App.sceneNode.palingLevels;
        if (palings[3].active && palings[4].active && palings[5].active) {
            newState = 1;
            if (palings[6].active) {
                newState = 3;
            }
        } else if (palings[6].active) {
            newState = 2;
        }
        if (newState !== this._paling2State) {
            let { minX, maxX, minZ, maxZ } = this._palingBoundings[1];
            if ((newState === 1 || newState === 3) && this._paling2State !== 1) {
                for (let i = 3; i < 6; i++) {
                    minX = Math.min(minX, this._palingBoundings[i].minX);
                    maxX = Math.max(maxX, this._palingBoundings[i].maxX);
                    minZ = Math.min(minZ, this._palingBoundings[i].minZ);
                    maxZ = Math.max(maxZ, this._palingBoundings[i].maxZ);
                }
            }
            if ((newState === 2 || newState === 3) && this._paling2State !== 2) {
                minX = Math.min(minX, this._palingBoundings[6].minX);
                maxX = Math.max(maxX, this._palingBoundings[6].maxX);
                minZ = Math.min(minZ, this._palingBoundings[6].minZ);
                maxZ = Math.max(maxZ, this._palingBoundings[6].maxZ);
            }
            this._palingBoundings[1] = { minX, maxX, minZ, maxZ };
            this._paling2State = newState;
        }

    }
}