import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import State from './State';
import Entity, { CharacterType } from '../entitys/Entity';
import { BehaviourType, Character } from '../entitys/Character';
import { MathUtil } from '../MathUtils';
import { Global } from '../core/Global';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
const { ccclass, property } = _decorator;

@ccclass('CornHandOver')
export class CornHandOver extends State {
    target: Entity = null;
    private callBcak: Function = null;
    private cornProcessCompleted = false;
    constructor(entity: Entity) {
        super();
        this.entity = entity;

    }
    onEnter(callback?: (...agrs: unknown[]) => void) {
        if (this.entity.getType() == CharacterType.CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }

            this.entity.characterSkeletalAnimation.play("kugongnanidel");

        }
        this.handOver();
    }
    onUpdate(dt: number) {
        console.log("CornHandOver")
        // this.handOver();
    }
    onExit(callback?: (...agrs: unknown[]) => void) {

    }
    handOver() {
        // 获取交付位置节点
        let handOverPosNode = (this.entity as Character).getCornHandOverNode();
        if (!handOverPosNode) {
            console.error("找不到交付位置节点");
            return;
        }
        let handOverPos = handOverPosNode.worldPosition.clone();

        // 获取背包节点
        let woodParent = (this.entity as Character).node.getChildByName("backpack1");
        if (!woodParent) {
            console.error("找不到背包节点");
            return;
        }

        // 检查背包中是否有木头
        if (woodParent.children.length <= 0) {
            (this.entity as Character).setBehaviour(BehaviourType.Idel);
            (this.entity as Character).setFindTarget(false);
            (this.entity as Character).cornNum = 0;
            console.warn("背包中没有可交付的木头");
            return;
        }

        // 获取最后一个木头节点
        const woodNode = woodParent.children[woodParent.children.length - 1];
        const woodWorldPos = woodNode.getWorldPosition().clone();

        // 计算贝塞尔曲线控制点（提升高度可配置）
        const LIFT_HEIGHT = 10; // 可提取为配置项
        const controlPoint = new Vec3(
            (woodNode.worldPosition.x + handOverPos.x) / 2,
            (woodNode.worldPosition.y + handOverPos.y) / 2 + LIFT_HEIGHT,
            (woodNode.worldPosition.z + handOverPos.z) / 2
        );

        // 执行贝塞尔曲线动画
        tween(woodNode)
            .to(0.1, {
                scale: new Vec3(1, 1, 1)
            }, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    // 计算贝塞尔曲线位置
                    const position = MathUtil.bezierCurve(
                        woodWorldPos,
                        controlPoint,
                        handOverPos,
                        ratio
                    );
                    target.worldPosition = position;
                }
            })
            .call(() => {
                Global.soundManager.playHandOverSound();
                if(!this.cornProcessCompleted && Global.cornHandOverNum >= Global.cornHandOverNumLimit){
                    this.cornProcessCompleted = true;
                    eventMgr.emit(EventType.ENTITY_CORN_COMPLATE,this,this.entity)
                    woodParent.removeAllChildren();
                    return;
                }
                // 增加交付计数
                Global.cornHandOverNum++;
                eventMgr.emit(EventType.ENTITY_CORNHAND_OVER_ADD)
                // 从场景中移除木头
                woodNode.removeFromParent();
                woodNode.destroy();
                this.handOver();
                // 注意：这里不再递归调用this.handOver()
                // 而是通过事件或其他方式通知可以继续交付
                console.log("木头交付完成，当前已交付数量:", Global.treeHandOverNum);
            })
            .start();
    }



}


