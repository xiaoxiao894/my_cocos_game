import { SoundManager } from "../SoundManager";
import { UIWarnManager } from "../UIWarnManager";


export class Global {
    // public static isFirstTreeFland:boolean = true;

    // public static isStartGame:boolean = false;
    public static isAttackWarn:boolean = false;
    public static soundManager:SoundManager = null;

    public static characterFindTree: number = 1;   //人物按顺序砍树 共四个 循环
    public static readonly characterPrefabPath: string = "Prefab/Player";

    public static readonly woodPrefabPath: string = "Prefab/Wood";

    public static readonly cornPrefabPath: string = "Prefab/yumi1";
    public static isPlayHouseAnimation:boolean = false;

    public static  treeHandOverNum: number = 0;
    public static  treeHandOverNumLimit:number = 50;

    public static  playerBodyWood:number = 0;
    public static  playerBodyWoodTest:number = 0;

    public static  clickCornLand:number[] = [0,0,0,0,0];//下标0的位置不用

    public static  playerBodyWoodAll:number = 0;
    public static  playerBodyCornAll:number = 0;
    public static  clickNum:number = 1;

    public static  cornHandOverNum: number = 0;
    public static  cornHandOverNumLimit:number = 50;

    public static  cornUnlock:number[] = [0,0,0,0]

    public static  isEnemyCutTree:boolean = false; //敌人地块的树是否可以砍伐
    
    public static isUpgrade:boolean = false; //是否升级


    public static isMoveCamreToCorn:boolean = true;
    /**移动到敌人地块摄像机的移动保证只调用一次 */
    public static  isFirstEnemyLand:boolean = false;
    /**在玉米地块开始移动到怪物地块时候停止当前动作以防报错 */
    public static isStartMoveEnemyLand:boolean = false;
    /**在敌人地块砍伐树木需要时机的 */
    public static isClickUpLandTree:boolean = true;//是否可以点击树 到玉米地块时候不能点击上一个地块的树

    public static isClickUpLandCorn:boolean = true;//是否可以点玉米 到敌人地块时候不能点击上一个地块的玉米

    public static isClickEnemy:boolean = false; //是否可以点击敌人地块上的树

    public static characterPosNum:number = 0; //人物位置

    public static upgradeUIAnimtion:number = 0; // 1 未达到升级数量左右动画  2 中间状态  3 交付呼吸状态 4 中间状态  5 交付未升级暂停动画
    public static upgradeAnimationgPlayTyep = 1; //1 是第一个地块  2 是最后一个地块

    public static warnUI:UIWarnManager = null;

    public static isClickUpgrade:boolean = false;
    public static isClickUpgradeEnemy:boolean = false;
    public static isClickEnemy1:boolean = false;
    public static isClickEnemy2:boolean = false;
    public static isClickEnemy3:boolean = false;
    public static isClickEnemy4:boolean = false;

    public static isLandNum:number = 0;

    public static enemyDieNum:number = 0;

    public static treeHandOver:boolean = false;
    public static showTreeUI:boolean = false;
    public static showTreeUINode:Node = null;

}


