import { _decorator, CCInteger, Collider, Component, ITriggerEvent, Node, SphereCollider, TriggerEventType, tween, v3, Vec3 } from 'cc';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import { MonsterManager } from './MonsterManager';
import { PrefabsEnum, PrefabsManager } from '../../Base/PrefabsManager';
import { getPosRandomPos } from '../../Tool/Index';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import { MonsterCreateNodeManager } from './MonsterCreateNodeManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterCreate')
export class MonsterCreate extends UnityUpComponent {
    protected _update(dt: number): void {
        this.monsterCreate(dt);
        this.monsterDie();
        this.attackTarUp();
    }

    @property(CCInteger)
    public maxCount: number;


    @property(MonsterManager)
    private monsterList: MonsterManager[] = [];
    private _collider: SphereCollider;

    private _battleList: BattleTarget[] = [];

    private _time: number = 0;


    protected start(): void {
        this._collider = this.getComponent(SphereCollider);
        this._collider.on("onTriggerEnter", this.onTriggerEnter, this);
        this._collider.on("onTriggerExit", this.onTriggerExit, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        if (tag && tag.tag == COLLIDE_TYPE.HERO) {
            let battle = event.otherCollider.getComponent(BattleTarget);
            let index = this._battleList.indexOf(battle);
            if (index == -1) {
                this._battleList.push(battle);
            }
        }
    }

    private onTriggerExit(event: ITriggerEvent) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        if (tag && tag.tag == COLLIDE_TYPE.HERO) {
            let battle = event.otherCollider.getComponent(BattleTarget);
            let index = this._battleList.indexOf(battle);
            if (index != -1) {
                this._battleList.splice(index, 1);
            }
        }
    }
    private get Monster() {
        let monster = PoolManager.instance.getPool<MonsterManager>(PoolEnum.monsterManager);
        if (!monster) {
            let node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.enemy, 0);
            monster = node.getComponent(MonsterManager);
        }
        monster.node.active = true;
        monster.battle.init(1);
        monster.initMat();
        return monster;
    }


    public maxTime: number = 1;

    private monsterCreate(dt: number) {
        if (this.monsterList.length < this.maxCount && this._time <= 0) {
            let monster = this.Monster;
            this._time = this.maxTime;
            this.node.addChild(monster.node);

            const pos = MonsterCreateNodeManager.instance.pos;

            // monster.selfCollider.enabled = false;
            monster.node.setWorldPosition(pos);
            monster.node.setScale(Vec3.ZERO);
            tween(monster.node).to(0.1, { scale: Vec3.ONE }, { easing: 'backOut' }).call(() => {
                const movePos = getPosRandomPos(this.node.worldPosition, this._collider.radius, Vec3.ZERO, v3(1, 0, 1));
                monster.setMovePos(movePos);
                this.monsterList.push(monster);
                // monster.selfCollider.enabled = true;
            }).start();
        }
        this._time -= dt;
    }

    private attackTarUp() {
        let target = this.attacktarget;
        for (let i = 0; i < this.monsterList.length; i++) {
            let monster = this.monsterList[i];
            let attackTarget = monster.attackTarget;
            const isIn = this._battleList.indexOf(attackTarget) == -1 && !!attackTarget;
            if (!target) {
                monster.attackTarget = null;
                attackTarget = null;
            } else if (!attackTarget || attackTarget.isDie || isIn) {
                monster.attackTarget = this.attacktarget;
                attackTarget = monster.attackTarget;
            }
            if (isIn && !attackTarget) {
                const pos = getPosRandomPos(this.node.worldPosition, this._collider.radius, Vec3.ZERO, v3(1, 0, 1));
                monster.setMovePos(pos);
            }

        }
    }

    private monsterDie() {
        for (let i = this.monsterList.length - 1; i >= 0; i--) {
            let monster = this.monsterList[i];
            if (monster.battle.isDie) {
                this.monsterList.splice(i, 1);
                monster.die();
            }
        }
    }

    public get attacktarget() {
        if (this._battleList.length) {
            return this._battleList[Math.floor(Math.random() * this._battleList.length)];
        } else {
            return null;
        }
    }

    public get monsterRandom() {
        // const length = this.monsterList.length;
        // const index = Math.floor(Math.random() * length);
        const monster = this.monsterList[0];
        return monster;
    }

    public getMonsterDis(pos: Vec3) {
        let dis = Vec3.distance(pos, this.monsterList[0].node.worldPosition);
        let monster = this.monsterList[0];
        for (let i = 1; i < this.monsterList.length; i++) {
            let m = this.monsterList[i];
            let d = Vec3.distance(pos, m.node.worldPosition);
            if (d < dis) {
                monster = m;
                dis = d;
            }
        }
        return monster;
    }

}


