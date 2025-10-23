import { _decorator, Animation, Component, Node, Vec3 } from 'cc';
import { EventName } from '../../Common/Enum';
import { EventManager } from '../../Global/EventManager';
import { DataManager } from '../../Global/DataManager';
import { WallItem } from './WallItem';
const { ccclass, property } = _decorator;

/** 墙边界 */
interface WallBounding {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}

/** 墙数据接口定义 */
interface AttackWallData {
    node: Node;
    curNum: number;
    maxNum: number;
}

@ccclass('WallControler')
export class WallControler extends Component {

    @property(WallItem)
    walls: WallItem[] = [];

    private _isWallAllUnlocked:boolean = false;
    private _wallBounding:WallBounding = null;

    private _attackWalls:Record<string, AttackWallData> = {};
    private _wallRegex = /^LaZhu.*/;

    start() {
        DataManager.Instance.wallController = this;
        this.init();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ShowWallArea, this.wallUnlockShow, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ShowWallArea, this.wallUnlockShow, this);
    }

    /** 隐藏所有墙 */
    private init():void{
        this.walls.forEach(wall => {
            wall.node.active = false;
        });

    }

    /** 初始化可被攻击的墙 */
    private addAllAttackWalls():void{
        this._attackWalls = {};
        this.walls.forEach(wall => {
            wall.wallNode.children.forEach((node:Node)=>{
                if(node.name.match(this._wallRegex)){
                    this.addOneAttackWall(node);
                }
            });
        });
    }

    private addOneAttackWall(node:Node):void{
        const nodeId = node.uuid;
        this._attackWalls[nodeId] = {
            node,
            curNum: 0,
            maxNum: 2
        };
    }

    /** 还需要多少草片 */
    public getNeedNumByIndex(index:number):number{
        let wall = this.walls[index];
        if(wall){
            const needNum = wall.getNeedNum();
            return needNum;
        }
        return 0;
    }

    /** 添加草片 */
    public addGrassByIndex(index:number){
        let wall = this.walls[index];
        if(wall){
            wall.reduceNumber();
        }
    }

    /** 墙待解锁阶段 */
    private wallUnlockShow(index:number):void{
        const wall = this.walls[index];
        if(wall&&wall.getNeedNum()>0){
            wall.node.active = true;
            wall.landNode?.getComponent(Animation)?.play();
        }
    }

    public getDeliverPosByIndex(index:number):Vec3{
        const wall = this.walls[index];
        if(wall&&wall.deliverPosNode){
            return wall.deliverPosNode.worldPosition.clone();
        }
        return null;
    }

    public isWallUnlockedByIndex(index:number):boolean{
        const wall = this.walls[index];
        if(wall){
            return wall.getNeedNum() <= 0;
        }
        return false;
    }

    /** 是否已解锁全部墙 */
    public isWallAllUnlocked():boolean{
        if(this._isWallAllUnlocked){
            return true;
        }

        for(let i = 0;i<this.walls.length;i++){
            if(this.walls[i].getNeedNum() > 0){
                return false;
            }
        }
        this._isWallAllUnlocked = true;
        this.addAllAttackWalls();
        return true;
    }

    /** 获取下一个待解锁的篱笆 */
    public getNextUnlockWallIndex():number{
        for(let i = 0;i<this.walls.length;i++){
            if(this.walls[i].getNeedNum() > 0){
                return i;
            }
        }
        return -1;
    }

    /** 坐标是否在墙内 */
    public posIsInDoor(pos:Vec3):boolean{
        if(this.isWallAllUnlocked()){
            if(!this._wallBounding){
                this.initWallBounding();
            }
            return pos.x >= this._wallBounding.minX && pos.x <= this._wallBounding.maxX && pos.z >= this._wallBounding.minZ && pos.z <= this._wallBounding.maxZ;
        }
        return false;
    }

    private initWallBounding():void{
        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        for (const wall of this.walls) {
            const palingPos = wall.node.worldPosition;
            minX = Math.min(minX, palingPos.x);
            maxX = Math.max(maxX, palingPos.x);
            minZ = Math.min(minZ, palingPos.z);
            maxZ = Math.max(maxZ, palingPos.z);
        }
        this._wallBounding = { minX, maxX, minZ, maxZ };
    }

    /**
     * 返回最近的围栏
     * @returns 符合条件的围栏数据或null
     */
    public getNearstAttackWall(pos: Vec3): AttackWallData | null {

        let nearestAttackWall = null; //最近墙
        let minDistSqr = Infinity;   //最近距离

        for (const key in this._attackWalls) {
            if (this._attackWalls.hasOwnProperty(key)) {
                const paling = this._attackWalls[key];
                //if (paling.curNum < paling.maxNum) {
                    let disSqr: number = Vec3.squaredDistance(paling.node.getWorldPosition(), pos);
                    if (disSqr < minDistSqr) {
                        minDistSqr = disSqr;
                        nearestAttackWall = paling;
                    }
                //}
            }
        }

        // 如果没有符合条件的墙，返回null
        if (!nearestAttackWall) {
            return null;
        }

        // 返回最近的墙
        return nearestAttackWall;
    }

    /**
     * 根据节点UUID获取特定墙数据
     * @param uuid 节点UUID
     * @returns 墙数据或undefined
     */
    getAttackWallByUuid(uuid: string): AttackWallData | undefined {
        return this._attackWalls[uuid];
    }

    /**
     * 更新墙的当前数值
     * @param uuid 节点UUID
     * @param newCurNum 新的当前数值
     * @returns 是否更新成功
     */
    updateAttackWallCurNum(uuid: string, newCurNum: number): boolean {
        const attackWall = this._attackWalls[uuid];
        if (attackWall) {
            attackWall.curNum = newCurNum;
            return true;
        }
        return false;
    }
}