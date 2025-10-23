import { _decorator, Component, Node, Vec3 } from 'cc';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import { WarriorAI } from './WarriorAI';
import { PrefabsEnum, PrefabsManager } from '../../Base/PrefabsManager';
import { MonsterCreate } from '../Monster/MonsterCreate';
import { BagBase } from '../Bag/Base/BagBase';
import { MoveModEnum } from '../../Base/MoveDrive';
const { ccclass, property } = _decorator;

@ccclass('WarriorAIManager')
export class WarriorAIManager extends Component {

    public static instance: WarriorAIManager;

    private warriorAIList: WarriorAI[] = [];
    public get AICount() {
        return this.warriorAIList.length;
    }

    @property(BagBase)
    public meatBag: BagBase;

    private posList: Vec3[] = [];
    @property(MonsterCreate)
    public monsterCreate: MonsterCreate;
    start() {
        WarriorAIManager.instance = this;
        for (let i = 0; i < 2; i++) {
            let posNode = this.node.getChildByName(`pos_${i}`);
            this.posList.push(posNode.worldPosition);
            posNode.active = false;
        }
    }

    update(deltaTime: number) {
        this.aiEventUp();
    }

    public get createAI() {
        let warriorAI = PoolManager.instance.getPool<WarriorAI>(PoolEnum.AI + WarriorAI.name);
        if (!warriorAI) {
            let node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.AI, 1);
            warriorAI = node.getComponent(WarriorAI);
            warriorAI.init(this.meatBag);
        }
        warriorAI.initInfo();
        warriorAI.selfBattle.init(1);
        warriorAI.moveDrive.pos = this.posList[0];
        warriorAI.moveDrive.moveMod = MoveModEnum.PosMove;
        this.warriorAIList.push(warriorAI);
        return warriorAI;
    }

    private aiEventUp() {
        for (let i = this.warriorAIList.length - 1; i >= 0; i--) {
            let ai = this.warriorAIList[i];
            if (ai.selfBattle.isDie) {
                ai.die();
                PoolManager.instance.setPool(PoolEnum.AI + WarriorAI.name, ai);
                ai.node.removeFromParent();
                this.warriorAIList.splice(i, 1);
            } else {
                if (ai.state == 0 && ai.moveDrive.isPos) {
                    ai.moveDrive.pos = this.posList[1];
                    ai.state = 1;
                } else if (ai.state == 1 && ai.moveDrive.isPos) {
                    ai.state = 2;
                } else if (ai.state == 2) {
                    if (!ai.tempBattle || ai.tempBattle.isDie) {
                        ai.moveDrive.moveMod = MoveModEnum.targetMove;
                        const monster = this.monsterCreate.getMonsterDis(ai.node.worldPosition);
                        ai.tempBattle = monster.battle;
                        ai.moveDrive.target = ai.tempBattle.node;
                    }
                }
            }
        }
    }







}


