import { _decorator, Prefab, Vec3, Node } from 'cc';
import Singleton from '../Base/Singleton';
import { PlayerManager } from '../Actor/PlayerManager';
import { CameraMain } from '../Camera/CameraMain';
import MonsterManager from '../Monster/MonsterManager';
import { GridSystem } from '../Grid/GridSystem';
import { CollisionEntityEnum, EntityTypeEnum } from '../Enum/Index';
import { CardConManager } from '../UI/CardConManager';
import PillarManager from '../pillars/PillarManager';
import { UIPropertyManager } from '../UI/UIPropertyManager';
import { SearchMonsters } from '../Actor/SearchMonsters';
import { BossTipConMananger } from '../Tip/BossTipConMananger';
import { SceneManager } from '../Scene/SceneManager';
import { ConveyerBeltManager } from '../Actor/ConveyerBeltManager';
import { MinionConManager } from '../Actor/MinionConManager';
import { UIWarnManager } from '../UI/UIWarnManager';
import { UIJoyStick } from '../UI/UIJoyStick';
import { GameEndManager } from '../UI/GameEndManager';
import { Arrow3DManager } from '../Actor/Arrow3DManager';
import { SoundManager } from '../Sounds/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    prefabMap: Map<string, Prefab> = new Map();

    soundManager: SoundManager;
    arrow3DManager: Arrow3DManager;
    gameEndManager: GameEndManager;
    uiJoyStick: UIJoyStick;
    uiWarnManager: UIWarnManager;
    conveyerBeltManager: ConveyerBeltManager
    player: PlayerManager;
    sceneManager: SceneManager
    monsterManager: MonsterManager;
    searchMonsters: SearchMonsters;
    pillarManager: PillarManager;
    UIPropertyManager: UIPropertyManager
    mainCamera: CameraMain = null;
    gridSystem: GridSystem;
    cardConManager: CardConManager;
    isNormalAttacking = true;                   // 是否可以普通攻击,    
    arrowTargetNode = null;                      // 箭头指向目标位置
    BossTipConManager: BossTipConMananger;
    MinionConManager: MinionConManager;
    cardDatas = [{
        card: EntityTypeEnum.Card1,
        partner: EntityTypeEnum.Partner1
    }, {
        card: EntityTypeEnum.Card2,
        partner: EntityTypeEnum.Partner2
    }, {
        card: EntityTypeEnum.Card3,
        partner: EntityTypeEnum.Partner3
    }]

    guideTargetIndex = -1;
    guideTargetList = [];

    isTouching = false;

    isDeactivateVirtualJoystick = false;

    landParcelRules = [
        {
            name: CollisionEntityEnum.DeliveryAreas1,       // 地块名称
            iconNumber: 5,                                  // 需要金币数量 
            isUnlockPartners: false                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas2,       // 地块名称
            iconNumber: 5,                                  // 需要金币数量 
            isUnlockPartners: false                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas3,       // 地块名称
            iconNumber: 25,                                  // 需要金币数量 
            isUnlockPartners: true                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas4,       // 地块名称
            iconNumber: 25,                                  // 需要金币数量 
            isUnlockPartners: true                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas5,       // 地块名称
            iconNumber: 25,                                  // 需要金币数量 
            isUnlockPartners: true                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas6,       // 地块名称
            iconNumber: 40,                                 // 需要金币数量        只要有一个角色解锁，这个就显示   解锁这个解锁场景1，
            isUnlockPartners: false                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas7,       // 地块名称
            iconNumber: 45,                                  // 需要金币数量         解锁铁匠铺         送一个弓之后  解锁60出暗送带，80下一个
            isUnlockPartners: false                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas8,       // 地块名称
            iconNumber: 25,                                  // 需要金币数量        
            isUnlockPartners: false                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas9,       // 地块名称
            iconNumber: 60,                                 // 需要金币数量 
            isUnlockPartners: false                         // 是否解锁伙伴
        },
        {
            name: CollisionEntityEnum.DeliveryAreas10,       // 地块名称
            iconNumber: 80,                                  // 需要金币数量                   解锁场景2，  结束
            isUnlockPartners: false                         // 是否解锁伙伴
        },
    ]

    // 武器位置坐标
    weaponPos = [{
        pos: new Vec3(-0.918, -1.139, -2.053),
    }, {
        pos: new Vec3(0.29, -1.139, -2.053)
    }, {
        pos: new Vec3(1.517, -1.139, -2.053)
    }]

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

    // 特效名字对应
    skillName = [
        {
            name: "Partner1-L",
            skill: "",
            effects: ""
        },
        {
            name: "Partner2-L",
            skill: "",
            effects: ""
        },
        {
            name: "Partner3-L",
            skill: "",
            effects: ""
        },
        {
            name: "Partner4-L",
            skill: "",
            effects: ""
        }, {
            name: "Partner5-L",
            skill: "",
            effects: ""
        }
    ]

    // 武器队列
    isInWeaponDeliveryArea = false;

    // 是否结束游戏
    isGameEnd = false;

    // 是否开始游戏
    isStartGame = false;

    // 小兵 ,开关门
    isAllMinionsPassed = true;
}

export type Guardrail = {
    node: Node,
    attackingMonsterCount: number,
    blood: number
}

