import { _decorator,  Prefab, Node, Vec3, geometry, PhysicsSystem, Collider, Vec2} from 'cc';
import { SceneManager } from '../Scene/SceneManager';
import { CameraMain } from '../Camera/CameraMain';
import { UIJoyStick } from '../UI/UIJoyStick';
import { UIManager } from '../UI/UIManager';
import { CornController } from '../Map/CornController';
import { PartnerControler } from '../Partner/PartnerControler';
import { MonsterController } from '../Monster/MonsterController';
import { GrassController } from '../Map/GrassController';
import { WallControler } from '../Map/Wall/WallController';
import MapController from '../Map/MapController';
import { TurretController } from '../Map/Turret/TurretController';
import { PlayerController } from '../Player/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager {

    private static _instance: DataManager = null;
    static get Instance() {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }


    /** 主摄像机 */
    public cameraMain: CameraMain = null;

    /** 游戏开始 */
    public isGameStart: boolean = false;
    /** 游戏结束 */
    public isGameEnd: boolean = false;

    public prefabMap: Map<string, Prefab> = new Map();
    public sceneManager: SceneManager;
    public player: Node = null;

    // 遥杆是否正在触摸
    public isTouching = false;

    public uiJoyStick: UIJoyStick;
    public uiManger:UIManager = null;
    public cornController:CornController = null;
    public partnerController:PartnerControler = null;
    public monsterController:MonsterController = null;
    public grassController:GrassController = null;
    public wallController:WallControler = null;
    public turretController:TurretController = null;
    public mapController:MapController = null;
    public playerController:PlayerController = null;


    /** 最大金币拾取范围的平方 */
    public static maxCoinSquareDis: number = 1296;
    /** 最大玉米拾取范围的平方 */
    public static maxCornSquareDis: number = 100;

    /** 玉米高度 */
    public static cornHeight: number = 0.75;
    /** 草块高度 */
    public static grassHeight: number = 0.45;
    /** 金币高度 */
    public static coinHeight: number = 0.55;

    /** 解锁割草机需要的金币数量 */
    public unlockLawnMowerCost: number = 10;

    /** 中心世界坐标 */
    public centerPos:Vec3 = null;

    /** 所有伙伴攻击玉米次数 */
    public partnerAttackCornNum:number = 0;
    /** 所有伙伴攻击怪次数 */
    public partnerAttackMonsterNum:number = 0;
    /** 有多少怪在打主角 */
    public targetPlayerNumber:number = 0;

    /** 玩家能否切换状态 */
    public playerAction = true;

    public partnerPathing:boolean = false;
    
    //判断是不是离障碍物很近了
    public isCloseToObstacle(node:Node,radius:number,goalVector:Vec2,checkDistance:boolean = true):number{
        const pos:Vec3 = node.worldPosition;
        const forward:Vec3 = new Vec3(goalVector.x,0,goalVector.y);
        // 确定朝向最近的轴向
        const absForwardX = Math.abs(forward.x);
        const absForwardZ = Math.abs(forward.z);
        const closestAxis = absForwardX > absForwardZ ? 'x' : 'z';


        let outRay: geometry.Ray;
        if (closestAxis === 'x') {
            outRay = new geometry.Ray(pos.x, 0, pos.z, forward.x > 0 ? 1 : -1, 0, 0);
        } else {
            outRay = new geometry.Ray(pos.x, 0, pos.z, 0, 0, forward.z > 0 ? 1 : -1);
        }

        const mask = 1 << 4 | 1 << 6;
        const maxDistance = 10000000;
        const queryTrigger = true;
        if (PhysicsSystem.instance.raycastClosest(outRay, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            if(!checkDistance||raycastClosestResult.distance<5+radius){
                const collider: Collider = raycastClosestResult.collider;
                if(collider.node.name.includes("wall")){
                    return 1;
                }
                return 2;
            }else {
                return 0;
            }
        }
        return 0;
    }

    
}


