import { _decorator, Prefab, Vec3, Node } from 'cc';
import Singleton from '../Base/Singleton';
import { PlayerManager } from '../Actor/PlayerManager';
import { CameraMain } from '../Camera/CameraMain';
import { GridSystem } from '../Grid/GridSystem';
import { CollisionEntityEnum, EntityTypeEnum, FunTypeEnum, PlacingEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
import PillarManager from '../pillars/PillarManager';
import { UIPropertyManager } from '../UI/UIPropertyManager';
import { SceneManager } from '../Scene/SceneManager';
import { ConveyerBeltManager } from '../Actor/ConveyerBeltManager';
import { UIWarnManager } from '../UI/UIWarnManager';
import { UIJoyStick } from '../UI/UIJoyStick';
import { GameEndManager } from '../UI/GameEndManager';
import { SearchTreeManager } from '../SearchSystem/SearchTreeManager';
import { TreeManager } from '../Tree/TreeManager';
import { WoodManager } from '../Wood/WoodManager';
import { BoardConManager } from '../Board/BoardConManager';
import { MonsterConManager } from '../Monster/MonsterConManager';
import { ElectricTowerManager } from '../ElectricTower/ElectricTowerManager';
import { PartnerConManager } from '../Actor/PartnerConManager';
import { Arrow3DManager } from '../Arrow/Arrow3DManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    cameraGuiding = false;
    isConveyerBeltUpgrade = false;
    curCutDownTree = 0;
    // 帮手正在砍树      没在砍树 false, 正在砍树true
    hasHelperCuttingDownTrees = false

    // 是否到达交付地点， false 没有前往，true 前往
    hasHelperReachDeliveryLocation = false;
    prefabMap: Map<string, Prefab> = new Map();

    claimedTargets: Set<Node> = new Set(); // 防止重复攻击
    partnerConManager: PartnerConManager;
    electricTowerManager: ElectricTowerManager;
    monsterManager: MonsterConManager;
    boardManager: BoardConManager;
    woodManager: WoodManager;
    treeManager: TreeManager;
    searchTreeManager: SearchTreeManager;
    arrow3DManager: Arrow3DManager;
    gameEndManager: GameEndManager;
    uiJoyStick: UIJoyStick;
    uiWarnManager: UIWarnManager;
    conveyerBeltManager: ConveyerBeltManager
    player: PlayerManager;
    sceneManager: SceneManager
    pillarManager: PillarManager;
    UIPropertyManager: UIPropertyManager
    mainCamera: CameraMain = null;
    gridSystem: GridSystem;
    isNormalAttacking = true;                   // 是否可以普通攻击,    
    arrowTargetNode = null;                      // 箭头指向目标位置

    // 记录当前秒
    curReduceTemplateTimeIndex = 0;
    curReduceTemplateTimeArr = [2, 1.6, 1.2, 1, 0.8];

    // 是否进入提示区域？ 
    isEnterPromptArea = true;
    guideTargetIndex = -1;
    guideTargetList = [
        {
            plot: PlotEnum.Plot8,               // 解锁英雄
            coinNum: 10,
            initCoinNum: 10,
            isDisplay: true,
        },
        {
            plot: PlotEnum.Plot9,               // 左1
            coinNum: 30,
            initCoinNum: 30,
            isDisplay: false,
        },
        {
            plot: PlotEnum.Plot3,               // 右1
            coinNum: 30,
            initCoinNum: 30,
            isDisplay: false,
        },
        {
            plot: PlotEnum.Plot2,               // 左2
            coinNum: 60,
            initCoinNum: 60,
            isDisplay: false,
        },
        {
            plot: PlotEnum.Plot4,               // 右2
            coinNum: 60,
            initCoinNum: 60,
            isDisplay: false,
        },

        {
            plot: PlotEnum.Plot5,               // 升级
            coinNum: 100,
            initCoinNum: 100,
            isDisplay: false,
        },
    ];

    isTouching = false;

    isDeactivateVirtualJoystick = false;

    // 障碍物
    obstacleArr = [];

    // 栅栏
    guardrailArr: Guardrail[] = [];

    //栅栏血量
    guardrailBlood = 250;

    // 怪物查找范围
    monsterSearchRange = 5;

    // 四个门
    doors = [];

    // 是否开始生成武器
    isGenerateWeapons = false;

    // 传送带是否解锁
    isConveyorBeltUnlocking = false;

    // 武器队列
    isInWeaponDeliveryArea = false;

    // 是否结束游戏
    isGameEnd = false;

    // 是否开始游戏
    isStartGame = false;

    // 小兵 ,开关门
    isAllMinionsPassed = true;

    // 电塔是否攻击
    isTowerAttack = false;

    isGetCoins = false;

    /** 传送带等级 */
    conveyorLevel = 1;

    rules = [
        {
            colliderName: PlotEnum.Plot1,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.WoodAccumulationCon,
            typeItem: TypeItemEnum.Wood,
            isChangValue: false,
        },
        {
            colliderName: PlotEnum.Plot2,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot2Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
        {
            colliderName: PlotEnum.Plot3,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot3Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
        {
            colliderName: PlotEnum.Plot4,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot4Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
        {
            colliderName: PlotEnum.Plot5,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot5Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
        {
            colliderName: PlotEnum.Plot6,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot6Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
        {
            colliderName: PlotEnum.Plot7,
            funType: FunTypeEnum.Collect,
            placing: PlacingEnum.SceneCoinCon,
            typeItem: TypeItemEnum.Coin,
            isChangValue: false,
        },
        {
            colliderName: PlotEnum.Plot8,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot8Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
        {
            colliderName: PlotEnum.Plot9,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot9Con,
            typeItem: TypeItemEnum.Coin,
            isChangValue: true,
        },
    ]

    // 当前所在地块
    currentArrowPointing = null;

    // 树矩阵
    treeMatrix = [];

    // 解锁电塔数量
    unlockPowerTowersNum = 1;

    // 怪刷新速度
    bornTimeLimit = 0.6;

    // 电塔攻击频率
    bulletAttackTimeInterval = 2;

    // 怪物数量
    monsterNum = 20;

    // 只进入一次指引
    onlyGuidanceOnce = true;

    // 帮手是否解锁
    isUnlockHelper = false;

    // 是否继续填充木柴
    isContinueFillFireWood = true;
    quantityFirewood = 27;
    curQuantityFirewood = 0;                // 当前投射木柴

    isEndTower = false;

    // 电塔的攻击距离
    electricTowerAttackRange = 15;
}

export type Guardrail = {
    node: Node,
    attackingMonsterCount: number,
    blood: number
}

