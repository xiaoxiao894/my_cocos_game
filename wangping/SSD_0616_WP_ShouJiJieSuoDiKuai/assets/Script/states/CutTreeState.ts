import { _decorator, Component, Node, tween, Animation } from 'cc';
import State from './State';
import Entity, { CharacterType } from '../entitys/Entity';
import { EnemyTree } from '../entitys/EnemyTree';
import { treeController } from '../Game/TreeController';
import { BehaviourType, Character } from '../entitys/Character';
import { Global } from '../core/Global';

const { ccclass, property } = _decorator;

@ccclass('CutTreeState')
export class CutTreeState extends State {
    target: Entity = null;
    private callback: Function = null;
    private num: number = 0;

   // private TreeAnimationNum: number = 1;
    private currentTween: any = null;
    private isExiting: boolean = false;

    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }

    onEnter(callback?: (...agrs: unknown[]) => void): void {
        // 重置状态
        this.resetState();
        this.callback = callback;

        if (this.entity.getType() !== CharacterType.CHARACTER) return;
        if (!this.entity.characterSkeletalAnimation) {
            console.error("骨骼动画组件未初始化");
            return;
        }

        const enemyTree = this.entity.target as EnemyTree;
        if (!enemyTree || enemyTree.getType() !== CharacterType.ENEMY_TREE) return;

        const character = this.entity as Character;

        character.axe.active = true;
        character.sickle.active = false;
        character.setBehaviour(BehaviourType.CutTree);
        this.entity.characterSkeletalAnimation.stop();

        // 保存引用用于退出时清理
        this.currentTween = tween(enemyTree)
            .call(() => this.performAttack(enemyTree, character))
            .start();
    }

    private performAttack(enemyTree: EnemyTree, character: Character) {
        if (this.isExiting) return;

        console.log("attackLoop  == " + character.getBehaviour());

        // 移除之前可能残留的监听器
        this.entity.characterSkeletalAnimation.off(Animation.EventType.FINISHED);

        let tt = this.entity.characterSkeletalAnimation.getState("kanshu").wrapMode
        // 添加单次监听器
        //  this.entity.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
        this.scheduleOnce(() => {
            if (this.isExiting) return;
            //  if(Global.treeHandOver){
            //     return;
            //  }
            //     this.scheduleOnce(()=>{
            //         character.setFindTarget(false);
            //         character.BehaviourType = BehaviourType.Idel;
            //         character.idle();

            //     },0.5)
            // }else{
            this.num++;
            enemyTree.curCollectNum++;
            console.log(" this.num  == ", enemyTree.curCollectNum);

            if (enemyTree.curCollectNum === 3) {
                character.collectWoodNew(character, 4, enemyTree);
            } else {
                character.collectWoodNew(character, 3, enemyTree);
            }
            //}

        }, 0.3)

        //  });

        Global.soundManager.playCutTreeSound();

        this.entity.characterSkeletalAnimation.play("kanshu");
        enemyTree.playAnimtion("shuKF00" + enemyTree.curCutNum);
        enemyTree.animationNum++;
        enemyTree.curCutNum++;
       // this.TreeAnimationNum++
        enemyTree.takeDamage(this.entity.attack, (isDie: boolean) => {
            if (this.isExiting) return;
            if (isDie) {
                let itiem = 0.3
                if (Global.treeHandOver == false) {
                    itiem = 0.3
                } else {
                    itiem = 0
                    return;
                }

                this.scheduleOnce(() => {
                    if (BehaviourType.HandOver == (this.entity as Character).BehaviourType) {
                        return;
                    } else {
                        character.setFindTarget(false);
                        // character.setBehaviour(BehaviourType.Idel);
                        character.nextTree();
                        this.entity.idle();
                        this.resetState();

                        if (this.callback) {
                            this.callback();
                        }
                    }


                }, itiem)

            } else {
                this.currentTween = tween(enemyTree)
                    .delay(1)
                    .call(() => this.performAttack(enemyTree, character))
                    .start();
            }
        });
    }

    private resetState() {
        this.num = 0;
        this.isExiting = false;
      //  this.TreeAnimationNum = 1;

        // 停止并清除tween动画
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }

        // 清除动画监听器
        if (this.entity.characterSkeletalAnimation) {
            this.entity.characterSkeletalAnimation.off(Animation.EventType.FINISHED);
        }
    }

    onUpdate(dt: number): void {
        // 攻击状态的逻辑
    }

    onExit(callback?: (...agrs: unknown[]) => void): void {
        console.log("退出攻击状态");
        this.isExiting = true;
        this.resetState();

        if (callback) {
            callback();
        }
    }
}