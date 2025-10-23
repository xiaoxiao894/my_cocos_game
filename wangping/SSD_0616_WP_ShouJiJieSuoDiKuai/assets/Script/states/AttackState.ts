import { AnimationComponent, tween, Vec3 } from "cc";
import { EnemyTree } from "../entitys/EnemyTree";
import Entity, { CharacterType } from "../entitys/Entity";
import State from "./State";
import { enemyCharacter } from "../entitys/enemyCharacter";
import { BehaviourType, Character } from "../entitys/Character";
import { goodsDrop } from "../goodsDrop";
import { Global } from "../core/Global";
import { eventMgr } from "../core/EventManager";
import { EventType } from "../core/EventType";

export default class AttackState extends State {

    target: Entity = null;
    private callBcak: Function = null;
    pos: Vec3 = null;
    constructor(entity: Entity) {
        super();
        this.entity = entity;
        this.pos = this.entity.node.worldPosition.clone();
    }
    private num: number = 0;
    onEnter(callback?: (...agrs: unknown[]) => void): void {
        if (this.entity.getType() == CharacterType.CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }
        }
        // this.entity.node.worldPosition = this.pos;
        if ((this.entity.target as enemyCharacter).getType() == CharacterType.ENEMY) {
            let enemyChar = (this.entity.target as enemyCharacter);
            let cahracter = (this.entity as Character);
            cahracter.isAttack = true;
            cahracter.axe.active = true;
            cahracter.sickle.active = false;
            const attackLoop = () => {
                this.entity.characterSkeletalAnimation.play("kanshu");
                Global.soundManager.playAttackEnemySound()
                //enemyTree.playAnimtion();//受激动作
                enemyChar.takeDamage(this.entity.attack, (isDie: boolean) => {
                    if (isDie) {
                        Global.enemyDieNum++;
                        if (Global.enemyDieNum >= 4) {
                            eventMgr.emit(EventType.ENTITY_ALL_DIE)
                        }
                        //  cahracter.setFindTarget(false);
                        cahracter.setBehaviour(BehaviourType.Idel)
                        cahracter.idle();
    

                    } else {
                        tween(enemyChar)
                            .delay(1)
                            .call(() => {
                                attackLoop();
                            })
                            .start()
                    }
                });
                this.scheduleOnce(() => {
                    // this.num++;
                    // if(this.num >= 3){
                    //     enemyChar.die();
                    //     enemyChar.attackNum = -1;
                    // }
                    enemyChar.hit();
                    
                }, 0.3)
            }
            attackLoop();
        }

        // if (callback) {

        //     console.log("AttackState callback")
        //     this.callBcak = callback;
        //     this.callBcak(this.entity)
        // }

    }


    onUpdate(dt: number): void {
        // 攻击状态的逻辑
    }

    onExit(callback?: (...agrs: unknown[]) => void): void {
        console.log("退出攻击状态");
        this.callBcak = null;
    }
}