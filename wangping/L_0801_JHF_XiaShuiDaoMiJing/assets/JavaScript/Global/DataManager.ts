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
import { FunTypeEnum, PlacingEnum, PlatformEnum, PlayerWeaponTypeEnum, PlotEnum, SceneEnum, TypeItemEnum } from '../Enum/Index';
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
    // 当前武器类型
    curWeaponType: PlayerWeaponTypeEnum = PlayerWeaponTypeEnum.CottonSwab;
    // 当前所在场景
    curScene: SceneEnum = SceneEnum.Scene1;

    plotRules = [
        {
            funType: FunTypeEnum.Deliver,
            plotName: PlotEnum.Plot1,
            isUnlock: true,
            meatNum: 10,
            isUnlockAnimationShown: false,
            typeItem: TypeItemEnum.Meat,
            isChangeValue: true,
            placing: PlacingEnum.Plot1Con,
        },
        {
            funType: FunTypeEnum.Deliver,
            plotName: PlotEnum.Plot2,
            isUnlock: false,
            meatNum: 40,
            isUnlockAnimationShown: false,
            typeItem: TypeItemEnum.Meat,
            isChangeValue: true,
            placing: PlacingEnum.Plot2Con,
        },
        {
            funType: FunTypeEnum.Deliver,
            plotName: PlotEnum.Plot3,
            isUnlock: false,
            meatNum: 80,
            isUnlockAnimationShown: false,
            typeItem: TypeItemEnum.Meat,
            isChangeValue: true,
            placing: PlacingEnum.Plot3Con,
        },
        {
            funType: FunTypeEnum.Deliver,
            plotName: PlotEnum.Plot4,
            isUnlock: false,
            meatNum: 120,
            isUnlockAnimationShown: false,  // 是否展示解锁动画？
            typeItem: TypeItemEnum.Meat,
            isChangeValue: true,
            placing: PlacingEnum.Plot4Con,
        },
    ]

    // 四面墙
    walls = [];

    // 提示
    guideTargetIndex = 0;
    guideTargetList = [];

    // 是否可以交付？
    isCanDelivered = false;

    // 产生怪的时间
    bornTimeLimit = 1;
    maxMonsterCount = 20;

    // 是否解锁盔甲
    isUnlockArmor = false;

    // 人物是否在水上
    isOnWater = false;
}

export type Guardrail = {
    node: Node,
    attackingMonsterCount: number,
    blood: number
}

