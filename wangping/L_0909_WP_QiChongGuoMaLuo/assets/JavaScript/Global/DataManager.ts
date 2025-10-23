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
import { MeatManager } from '../Item/MeatManager';
import { RoastDuckManager } from '../Item/RoastDuckManager';
import { PeopleConManager } from '../Actor/PeopleConManager';
import { PartnerConManager } from '../Actor/PartnerConManager';
import { GameEndManager } from '../UI/GameEndManager';
import { UIGameManager } from '../UI/UIGameManager';
import { SoundManager } from '../Sounds/SoundsManager';
import { BubbleManager } from '../Item/BubbleManager';
import { MeatConManager } from '../Placing/MeatConManager';
import { FunTypeEnum, PlacingEnum, PlayerWeaponTypeEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
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

    rules = [
        {
            colliderName: PlotEnum.Plot1,                 // 碰撞  
            funType: FunTypeEnum.Deliver,                 // 类型  收集
            placing: PlacingEnum.Plot1,                   // 放置  容器
            typeItem: TypeItemEnum.GoldCoin,              // 物品
            isChangeValue: true,
        },
        {
            colliderName: PlotEnum.Plot2,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot2,
            typeItem: TypeItemEnum.GoldCoin,
            isChangeValue: true,
        },
        {
            colliderName: PlotEnum.Plot3,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.Plot3,
            typeItem: TypeItemEnum.GoldCoin,
            isChangeValue: true,
        },
        {
            colliderName: PlotEnum.Plot4,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.DeliveryMeatCon,
            typeItem: TypeItemEnum.Meat,
            isChangeValue: false
        },
        {
            colliderName: PlotEnum.Plot5,
            funType: FunTypeEnum.Collect,
            placing: PlacingEnum.CollectMeatCon,
            typeItem: TypeItemEnum.Roast,
            isChangeValue: false
        },
        {
            colliderName: PlotEnum.Plot6,
            funType: FunTypeEnum.Deliver,
            placing: PlacingEnum.DeliveryRoastDuckCon,
            typeItem: TypeItemEnum.Roast,
            isChangeValue: false
        },
        {
            colliderName: PlotEnum.Plot7,
            funType: FunTypeEnum.Collect,
            placing: PlacingEnum.CoinCon,
            typeItem: TypeItemEnum.GoldCoin,
            isChangeValue: false
        }
    ]

    curWeaponType: PlayerWeaponTypeEnum = PlayerWeaponTypeEnum.CottonSwab;

    walls = [];

    // 生产怪的时间;
    bornTimeLimit = 1;
    maxMonsterCount = 20;

}

export type Guardrail = {
    node: Node,
    attackingMonsterCount: number,
    blood: number
}

