import { _decorator, Prefab, Vec2, Vec3, Node, Vec4, Tween } from 'cc';
import Singleton from '../Base/Singleton';
import { CameraMain } from '../Camera/CameraMain';
import { RopeManager } from '../Repo/RopeManager';
import { SceneManager } from '../SceneManger';
import { eventMgr } from '../core/EventManager';
import { EventManager } from './EventManager';
import { EventName } from '../Common/Enum';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    public prefabMap: Map<string, Prefab> = new Map();

    public sceneManger: SceneManager = null;

    public soundManager: SoundManager = null;

    public isMapBesastSatr:boolean = false;

    /** 主摄像机 */
    public mainCamera: CameraMain = null;


    /** 电线管理类 */
    public ropeManager: RopeManager = null;

    /** 当前操控的插头 */
    public nowPlug: Node = null;

    //当前插座
    public nowSocket: Node = null;

    /**所有插座节点 */
    public socketNodes: Node[] = [];
    /**所有箭头节点 */
    public arrowNodes: Node[] = [];



    public Arrow_beast: Node = null;


    public Arrow_mining: Node = null;

    public Arrow_farmLand: Node = null;

    /**摄像机移动限制 */
    /**
     * (-19, -40, 37.9, 22);
     * 向左滑动右边界
     * 向右滑动左边界  
     * 向下滑动上边界
     * 向上滑动下边界
     */
    // Vec4(xMax, xMin, zMax, zMin)
    public cameraLimit: Vec4 = new Vec4(14, -14, 56, 23.64);
    /** 插头插座连接距离 */
    public plugConnectDistance: number = 6;
    public cloudHideDistance: number = 10;

    public upgradeAnimationType:number = 1;
    public upgradeTween:Tween<Node> = null;
    public upgradeNode:Node = null;

    /** 插头移动旋转角度 顺序对应插座 */
    public plugMoveAngles: Vec3[] = [
        new Vec3(-90, 0, 0),
        new Vec3(90, 90, 0),
        new Vec3(90, 0, 0),
        new Vec3(90, -90, 0),
        new Vec3(-90, 0, 0),
    ]

    /** 插头最终旋转角度 顺序对应插座 */
    public plugFinalAngles: Vec3[] = [
        new Vec3(-90, 0, 0),
        new Vec3(90, 90, 0),
        new Vec3(90, 90, 0),
        new Vec3(125, -127, 0),
        new Vec3(-90, 0, 0),
    ]
    /** 游戏结束 */
    public isGameOver: boolean = false;
    public leftSocket: number[] = [0, 1, 2, 3, 4];

    //当前金币数量
    public coinNum: number = 0;

    public addCoin(num: number = 1) {
        this.coinNum += num;
        EventManager.inst.emit(EventName.CoinAdd);
    }


    //升级需要金币数量
    public upgradeCoinNum: number = 900;

    //塔当前金币数量
    public towerCoinNum: number = 0;

    //飞金币节点
    public coinEndNode: Node = null;

}

