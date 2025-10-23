import { _decorator, Prefab, Vec3, Node, find } from 'cc';
import Singleton from '../Base/Singleton';
import { PlayerManager } from '../Actor/PlayerManager';
import { CameraMain } from '../Camera/CameraMain';
import { UIPropertyManager } from '../UI/UIPropertyManager';
import { SceneManager } from '../Scene/SceneManager';
import { UIJoyStick } from '../UI/UIJoyStick';
import { Arrow3DManager } from '../Actor/Arrow3DManager';
import { GridSystemManager } from '../GridSystem/GridSystemManager';
import { MonsterConManager } from '../Monster/MonsterConManager';
import { FunTypeEnum, PlacingEnum, PlatformEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
import { MeatManager } from '../Item/MeatManager';
import { RoastDuckManager } from '../Item/RoastDuckManager';
import { CoinManager } from '../Item/CoinManager';
import { PeopleConManager } from '../Actor/PeopleConManager';
import { PartnerConManager } from '../Actor/PartnerConManager';
import { GameEndManager } from '../UI/GameEndManager';
import { UIGameManager } from '../UI/UIGameManager';
import { SoundManager } from '../Sounds/SoundsManager';
import { BubbleManager } from '../Item/BubbleManager';
import { MeatConManager } from '../Placing/MeatConManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    gridSystemManager: GridSystemManager;
    playerAction = true;
    coinCon = find("ThreeDNode/PlacingCon/CoinCon");
    meatConManager: MeatConManager;
    isTouching = false;
    bubbleManager: BubbleManager;
    claimedTargets: Set<Node> = new Set(); // 防止重复攻击
    soundManager: SoundManager;
    uiPropertManager: UIGameManager;
    prefabMap: Map<string, Prefab> = new Map();
    gameEndManager: GameEndManager
    partnerConManager: PartnerConManager
    peopleConManager: PeopleConManager;
    coinManager: CoinManager;
    roastDuckManager: RoastDuckManager;
    meatManager: MeatManager;
    monsterConMananger: MonsterConManager;
    arrow3DManager: Arrow3DManager;
    uiJoyStick: UIJoyStick;
    player: PlayerManager;
    sceneManager: SceneManager
    UIPropertyManager: UIPropertyManager
    mainCamera: CameraMain = null;
    isNormalAttacking = true;                    // 是否可以普通攻击,    
    arrowTargetNode = null;                      // 箭头指向目标位置

    //栅栏血量
    guardrailBlood = 250;
    // 栅栏
    guardrailArr: Guardrail[] = [];

    // 是否开始游戏
    isStartGame = false;
    // 是否结束游戏
    isGameEnd = false;
    // 是否有人站在 plot1 中
    hasPersonInPlot1 = false;
    hasPersonInPlot10 = false;
    // 四个门
    doors = [];

    // 提示
    guideTargetIndex = -1;

    ordinaryRules = [
        {
            colliderName: PlotEnum.Plot2,
            isDisplay: false,
        },
        {
            colliderName: PlotEnum.Plot3,
            isDisplay: false,
        },
        {
            colliderName: PlotEnum.Plot4,
            isDisplay: false,
        },
        {
            colliderName: PlotEnum.Plot5,
            isDisplay: false,
        },
        {
            colliderName: PlotEnum.Plot8,
            isDisplay: false,
            isShow: false,
        },
    ]

    rules = [
        {
            colliderName: PlotEnum.Plot2,   // 碰撞  
            funType: FunTypeEnum.Deliver,   // 类型 交付
            placing: PlacingEnum.PayerDeliversMeat,   // 放置 容器
            typeItem: TypeItemEnum.Meat     // 物品类型
        },
        {
            colliderName: PlotEnum.Plot3,       // 碰撞  
            funType: FunTypeEnum.Collect,       // 类型  收集
            placing: PlacingEnum.BarbecueCon1,  // 放置 容器
            typeItem: TypeItemEnum.Roast        // 物品
        },
        {
            colliderName: PlotEnum.Plot4,       // 碰撞  
            funType: FunTypeEnum.Deliver,       // 类型
            placing: PlacingEnum.BarbecueCon2,  // 放置
            typeItem: TypeItemEnum.Roast        // 物品
        },
        {
            colliderName: PlotEnum.Plot5,       // 碰撞  
            funType: FunTypeEnum.Collect,       // 类型
            placing: PlacingEnum.CoinCon,       // 放置
            typeItem: TypeItemEnum.Coin,        // 物品
            adjacentPlots: [
                {
                    plot: PlotEnum.Plot6,
                    isUnlock: false,
                }
            ]     // 关联解锁地块    
        },
        {
            colliderName: PlotEnum.Plot6,        // 碰撞  
            funType: FunTypeEnum.Deliver,        // 类型
            placing: PlacingEnum.Plot6Con,       // 放置
            typeItem: TypeItemEnum.Coin,         // 物品
            isChaneValue: true,                  // 是否是数值变化的类型， ture 是
        },
        {
            colliderName: PlotEnum.Plot7,        // 碰撞  
            funType: FunTypeEnum.Deliver,        // 类型
            placing: PlacingEnum.Plot7Con,       // 放置
            typeItem: TypeItemEnum.Coin,         // 物品
            isChaneValue: true,                  // 是否是数值变化的类型， ture 是
        },
        {
            colliderName: PlotEnum.Plot8,        // 碰撞  
            funType: FunTypeEnum.Deliver,        // 类型
            placing: PlacingEnum.Plot8Con,       // 放置
            typeItem: TypeItemEnum.Coin,         // 物品
            isChaneValue: true,                  // 是否是数值变化的类型， ture 是
        },
        {
            colliderName: PlotEnum.Plot9,        // 碰撞  
            funType: FunTypeEnum.Deliver,        // 类型
            placing: PlacingEnum.Plot9Con,       // 放置
            typeItem: TypeItemEnum.Coin,         // 物品
            isChaneValue: true,                  // 是否是数值变化的类型， ture 是
        },
        {
            colliderName: PlotEnum.Plot10,       // 碰撞  
            funType: FunTypeEnum.None,           // 类型
            placing: PlacingEnum.Plot9Con,       // 放置
            typeItem: TypeItemEnum.Coin,         // 物品
            isChaneValue: true,                  // 是否是数值变化的类型， ture 是
        }
    ]

    landParcelRules = [
        {
            name: PlotEnum.Plot2,
            iconNumber: 5,
            isUnlockPartners: false
        },
        {
            name: PlotEnum.Plot3,
            iconNumber: 5,
            isUnlockPartners: false
        },
        {
            name: PlotEnum.Plot4,
            iconNumber: 25,
            isUnlockPartners: true
        },
        {
            name: PlotEnum.Plot5,
            iconNumber: 25,
            isUnlockPartners: true
        }
    ]

    guideTargetList = [
        {
            plotName: PlotEnum.Plot1,
            node: null,
            isDisplay: false,
            isDisplayPath: false,
            isOnce: true,
            isClear: true,
        },
        {
            plotName: PlotEnum.Plot2,
            node: null,
            isDisplay: false,
            isDisplayPath: true
        },
        {
            plotName: PlotEnum.Plot3,
            node: null,
            isDisplay: false,
            isDisplayPath: false
        },
        {
            plotName: PlotEnum.Plot4,
            node: null,
            isDisplay: false,
            isDisplayPath: false
        },
        {
            plotName: PlotEnum.Plot5,
            node: null,
            isDisplay: false,
            isDisplayPath: false
        },
        {
            plotName: PlotEnum.Plot8,
            node: null,
            isDisplay: false,
            isDisplayPath: false
        },
    ]
}

export type Guardrail = {
    node: Node,
    attackingMonsterCount: number,
    blood: number
}

