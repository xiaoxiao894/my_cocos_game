import { _decorator, Prefab, Vec2 } from 'cc';
import Singleton from '../Base/Singleton';
import { PlayerManager } from '../Actor/PlayerManager';
import { CameraMain } from '../Camera/CameraMain';
import MonsterManager from '../Monster/MonsterManager';
import { GridSystem } from '../Grid/GridSystem';
import { PartnerManager } from '../Actor/PartnerManager';
import { EntityTypeEnum } from '../Enum/Index';
import { CardConManager } from '../UI/CardConManager';
import PillarManager from '../pillars/PillarManager';
import { UIPropertyManager } from '../UI/UIPropertyManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    prefabMap: Map<string, Prefab> = new Map();

    player: PlayerManager;

    monsterManager: MonsterManager;

    pillarManager: PillarManager;
    UIPropertyManager: UIPropertyManager
    mainCamera: CameraMain = null;
    gridSystem: GridSystem;
    partnerManager: PartnerManager
    cardConManager: CardConManager;
    isNormalAttacking = true;                   // 是否可以普通攻击,    
    arrowTargetNode = null;                      // 箭头指向目标位置
    cardDatas = [{
        card: EntityTypeEnum.Card1,
        partner: EntityTypeEnum.Partner1
    }, {
        card: EntityTypeEnum.Card2,
        partner: EntityTypeEnum.Partner2
    }, {
        card: EntityTypeEnum.Card3,
        partner: EntityTypeEnum.Partner3
    }, {
        card: EntityTypeEnum.Card4,
        partner: EntityTypeEnum.Partner4
    }, {
        card: EntityTypeEnum.Card5,
        partner: EntityTypeEnum.Partner5
    }]

    guideTargetIndex = 0;
    guideTargetList = []

    isTouching = false;

    public mapSidePos = [new Vec2(0,-40),new Vec2(40,0),new Vec2(0,40),new Vec2(-40,0)];
}

