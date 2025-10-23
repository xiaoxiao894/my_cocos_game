import { _decorator, Component, Node, Animation, tween, Vec3, Tween } from 'cc';
import State from './State';
import Entity, { CharacterType } from '../entitys/Entity';
import { BehaviourType, Character } from '../entitys/Character';
import { Global } from '../core/Global';
import { BubbleFead } from '../BubbleFead';
const { ccclass, property } = _decorator;

@ccclass('CutCornState')
export class CutCornState extends State {
    private index = 0;
    // 新增：保存定时器句柄
    private scheduleHandle: any = null;
    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }
    cornNode: Node = null;
    private isFirst: boolean = false;

    private tweenInstance: Tween<Node> = null;

    getNode(character) {

        let node = null;
        if (character.getId() == "0") {
            node = character.groundEffect.groundObject2_1;
            Global.cornUnlock[0] = 1;
        } else if (character.getId() == "1") {
            Global.cornUnlock[1] = 1;
            node = character.groundEffect.groundObject2_2;
        } else if (character.getId() == "2") {
            node = character.groundEffect.groundObject2_3;
            Global.cornUnlock[2] = 1;
        }
        else if (character.getId() == "3") {
            node = character.groundEffect.groundObject2_4;
            Global.cornUnlock[3] = 1;
        }
        return node;

    }
    onEnter(callback?: (...agrs: unknown[]) => void) {
        let character = (this.entity as Character)
        // 新增：检查是否需要立即清除动作
        if (Global.isStartMoveEnemyLand) {
            this.clearAllActions(character);
            return;
        }
        
        if (this.entity.getType() == CharacterType.CHARACTER) {
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }

        }
        if (character.cornIndex <= 1) {
            character.node.setRotationFromEuler(0, 0, 0);
            character.cornIndex = 1;
        } else {
            character.node.setRotationFromEuler(0, 180, 0);
            character.cornIndex = 4;
        }
        character.axe.active = false;
        character.sickle.active = true;

        let callFun = () => {
            if (character.getId() == "0") {
                character.groundEffect.ArrowgroundObject2_1.active = true;
                if (character.groundEffect.ArrowgroundObject2_1.getComponent(BubbleFead)) {
                    character.groundEffect.ArrowgroundObject2_1.getComponent(BubbleFead).Show();
                }

            } else if (character.getId() == "1") {
                character.groundEffect.ArrowgroundObject2_2.active = true;
                if (character.groundEffect.ArrowgroundObject2_2.getComponent(BubbleFead)) {
                    character.groundEffect.ArrowgroundObject2_2.getComponent(BubbleFead).Show();
                }
            } else if (character.getId() == "2") {
                character.groundEffect.ArrowgroundObject2_3.active = true;
                if (character.groundEffect.ArrowgroundObject2_3.getComponent(BubbleFead)) {
                    character.groundEffect.ArrowgroundObject2_3.getComponent(BubbleFead).Show();
                }
            }
            else if (character.getId() == "3") {
                character.groundEffect.ArrowgroundObject2_4.active = true;
                if (character.groundEffect.ArrowgroundObject2_4.getComponent(BubbleFead)) {
                    character.groundEffect.ArrowgroundObject2_4.getComponent(BubbleFead).Show();
                }

            }
        }
        const attackLoop = () => {
            // 新增：检查是否需要清除动作
            if (Global.isStartMoveEnemyLand) {
                this.clearAllActions(character);
                return;
            }

            if (character.frontage) {
                if (character.cornIndex > 4) {
                    character.cornIndex = 4;
                    Global.isLandNum++;
                    character.setFindTarget(false);
                    character.BehaviourType = BehaviourType.Idel;
                    character.frontage = false;
                    character.idle();
                    
                    // 修改：保存定时器句柄
                    this.scheduleHandle = this.scheduleOnce(() => {
                        this.cornNode.children.forEach((item) => {
                            item.active = true;
                        })
                        callFun()

                    }, 3)


                    return;
                }
            } else {
                if (character.cornIndex <= 0) {
                    character.setFindTarget(false);
                    character.BehaviourType = BehaviourType.Idel;
                    character.cornIndex = 1;
                    character.frontage = true;
                    character.idle();
                    
                    // 修改：保存定时器句柄
                    this.scheduleHandle = this.scheduleOnce(() => {
                        this.cornNode.children.forEach((item) => {
                            item.active = true;
                            callFun()
                        })
                    }, 3)

                    const allUnlocked = Global.cornUnlock.every(value => value !== 0);

                    if (allUnlocked) {
                        if (!Global.isFirstEnemyLand) {
                            Global.isFirstEnemyLand = true;
                            character.groundEffect.passAnimation2();
                        }
                    }
                    return;
                }
            }

            this.cornNode = this.getNode(character);
            character.characterSkeletalAnimation.play("gexiaomai");
            const animationState = character.characterSkeletalAnimation.getState("gexiaomai");
            animationState.speed = 2.2;

            Global.soundManager.playCutCronSound()
            character.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
                // 新增：检查是否需要清除动作
                if (Global.isStartMoveEnemyLand) {
                    this.clearAllActions(character);
                    return;
                }
                
                character.characterSkeletalAnimation.play("kugongnanpao");
                this.cornNode.getChildByName("ground" + character.cornIndex).active = false;
                this.tweenInstance = tween(character.node)
                    .by(0.3, { position: new Vec3(0, 0, character.frontage ? 1.6 : -1.6) })
                    .call(() => {
                        // 新增：检查是否需要清除动作
                        if (Global.isStartMoveEnemyLand) {
                            this.clearAllActions(character);
                            return;
                        }
                        
                        character.collectCorn(this.entity);
                        if (Global.isStartMoveEnemyLand == true) {
                            this.clearAllActions(character);
                            return;
                        }
                        if (character.frontage) {
                            character.cornIndex++;
                        } else {
                            character.cornIndex--;
                        }
                        if (Global.isLandNum >= 3) {
                            const allUnlocked = Global.cornUnlock.every(value => value !== 0);

                            if (allUnlocked) {
                                if (!Global.isFirstEnemyLand) {
                                    Global.isFirstEnemyLand = true;
                                    character.groundEffect.passAnimation2();
                                }
                            }
                        }
                        attackLoop();
                    })
                    .start();
            });

        }
        attackLoop();

    }
    
    // 新增：清除所有缓存动作的方法
    private clearAllActions(character: Character) {
        // 停止tween动画
        if (this.tweenInstance) {
            this.tweenInstance.stop();
            this.tweenInstance = null;
        }
        // 取消定时器
        if (this.scheduleHandle) {
            this.unschedule(this.scheduleHandle);
            this.scheduleHandle = null;
        }
        // 停止骨骼动画
        if (character.characterSkeletalAnimation) {
            character.characterSkeletalAnimation.stop();
        }
        // 切换到 idle 状态
        // character.setFindTarget(false);
        // character.BehaviourType = BehaviourType.Idel;
        // character.idle();
    }

    onUpdate(dt: number) {
        // 新增：在更新时检查是否需要清除动作
        if (Global.isStartMoveEnemyLand) {
            let character = (this.entity as Character);
            this.clearAllActions(character);
        }
    }

    onExit(callback?: (...agrs: unknown[]) => void) {
        // 新增：退出状态时清除所有动作
        this.clearAllActions(this.entity as Character);
        if (callback) callback();
    }

}
