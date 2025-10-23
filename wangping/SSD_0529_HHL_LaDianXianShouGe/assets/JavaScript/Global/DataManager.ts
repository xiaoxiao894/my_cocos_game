import { _decorator, Prefab, Vec2, Vec3,Node, Vec4 } from 'cc';
import Singleton from '../Base/Singleton';
import { CameraMain } from '../Camera/CameraMain';
import { RopeManager } from '../Repo/RopeManager';
import { SceneManager } from '../SceneManger';
import { EventManager } from './EventManager';
import { EventName } from '../Common/Enum';
import { UIJoyStickManager } from '../UI/UIJoyStickManager';
import { TreeManager } from '../TreeLand/TreeManger';
import { RopePoint } from '../Common/Type';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    public prefabMap: Map<string, Prefab> = new Map();

    public sceneManger:SceneManager = null;

    /** 树 */
    public treeManger:TreeManager = null;

    /** 主摄像机 */
    public mainCamera: CameraMain = null;

    public guideTargetIndex:number =-1;

    //摄像机引导中
    public cameraGuiding: boolean = false;

    /** 电线管理类 */
    public ropeManager: RopeManager = null;
    /** 摇杆 */
    public joyStick: UIJoyStickManager = null;

    /** 玩家节点 */
    public player: Node = null;
    /** 玩家是否可移动 */
    public playerCanMove:boolean = true;
    /** 玩家木头数量 */
    public playerWoodNum:number = 0;

    /** 木材高度 */
    private _woodHeight:number = 0.52;

    public get WoodHeight():number{
        return this._woodHeight;
    }

    /** 树相关 */
    /** 大树是否还活着 */
    public bigTreeAlive:boolean = true;
    /** 大树坐标 */
    public bigTreePos:Vec3 = null;
    /** 大树 index */
    public bigTreeIndexList:number[] =[11,19,20];
    /** 大树半径 */
    public bigTreeRadius:number = 1;

    /** 小树 行数 */
    public treeRow:number = 7;
    /** 小树 列数 */
    public treeCol:number = 8;
    /** 小树间距 */
    public treeSpace:number = 3;
    /** 小树半径 */
    public treeRadius:number = 0.25;
    /** 小树半径 */
    //public treeRealRadius:number = 0.25;
    /** 第一棵树坐标 */
    public firstTreePos:Vec3 ;
    /** 树相关结束 */


    /** 电线相关 */

    /** 电线粗度 */
    public wireRadius:number = 0.15;
    /** 电线长度 */
    public wireLen:number = 35;
    public wireSecendLen:number = 65;
    /** 已使用长度 */
    public usedLen:number = 0;

    /** 当前操控的插头 */
    public plugNode:Node= null;

    //当前插座
    public socketNode:Node = null;

    /** 插头最终旋转角度 顺序对应插座 */
    public plugFinalAngles:Vec3=new Vec3(-90,0,0);

    /** 电线方向 */
    public wireDir:Vec3 = new Vec3(0,0,0);

    /** 电线父节点 */
    public ropeParentNode:Node = null;

    /** 电线挂点列表 */
    public ropePointList:RopePoint[] = [];
    /** 电线挂住的树 */
    public ropeTrees:Map<string,boolean> = new Map();

    /** 电线相关 结束 */
    
    /** 游戏结束 */
    public isGameOver:boolean = false;


    //升级到二级需要木材数量
    public upgradeSecondWoodNum:number = 50;
    //升级到三级需要木材数量
    public upgradeThirdWoodNum:number = 150;

    //塔当前木材数量
    public towerWoodNum:number = 0;

    //飞木材节点
    public woodEndNode:Node = null;

    public addTowerWoodNum():void{
        this.towerWoodNum++;
        EventManager.inst.emit(EventName.GiveTowerWood);
    }

    /** 引导相关 */
    public inDeliverArea:boolean = false;

}

