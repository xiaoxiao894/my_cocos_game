import { _decorator, Component, instantiate, Material, MeshRenderer, Node, SkeletalAnimation, SkinnedMeshRenderer, tween, Vec3 } from 'cc';
import Entity from './Entity';
import { treeController } from '../Game/TreeController';
import { ResourceManager } from '../core/ResourceManager';
import { Global } from '../core/Global';
import { EnemyTree } from './EnemyTree';
import { WorldMap } from '../Game/WorldMap';
import { GroundEffct } from '../GroundEffct';
import { MathUtil } from '../MathUtils';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { enemyCharacter } from './enemyCharacter';
const { ccclass, property } = _decorator;
/**
 * 角色类型枚举
 * Tree 寻树  
 * handOver 交付   
 * transmit 传送 
 * idel 空闲可以切换任何状态
 * ConrPost 去玉米地位置点
 * enemyHnadOverPos 去玉米地位置点
 */
export enum BehaviourType {
    Tree = "Tree",
    CutTree = "CutTree",
    HandOver = "HandOver",
    Transmit = "Transmit",
    ConrPost = "ConrPost",
    CutCorn = "CutCorn",
    FindEnemy = "FindEnemy",
    FindLandPos = "FindLandPos",
    Idel = "Idel",
    EnemyHnadOverPos = "enemyHnadOverPos",
}
@ccclass('Character')
export class Character extends Entity {

    isTarget: boolean = false;

    frontage: boolean = true;  // true 是正面 false 是反面
    cornIndex: number = 1;

    // fals 没有寻找 目标  true 寻找目标状态
    isFindTarget: boolean = false;

    BehaviourType: BehaviourType = BehaviourType.Idel;

    moveSpeed: number = 8;
    woodNum: number = 0; //木材
    cornNum: number = 0;//玉米

    @property(Node)
    axe: Node = null;

    @property(Node)
    sickle: Node = null;

    @property(Material)
    chapeauMaterial: Material = null;

    @property(Material)
    bodyMaterial: Material = null;

    @property(Material)
    redyMaterial: Material = null;

    @property(SkinnedMeshRenderer)
    skinnedMeshRenderer: SkinnedMeshRenderer = null;
    //树的交付点
    handOverNode: Node = null;
    // 玉米的交付点
    cornHandOverNode: Node = null;

    curHanOverType: number = 0;//1 第一次交付树的  2 第二次交付 玉米的

    groundEffect: GroundEffct = null;

    isAttack: boolean = false;

    //设置寻找目标
    setFindTarget(value: boolean) {
        this.isFindTarget = value;
    }
    getFindTarget() {
        return this.isFindTarget;
    }
    woodParentBackpack
    woodParentBackpack1
    start() {
        this.idle()
        let woodParent = this.node.getChildByName("backpack");

        let woodParent1 = this.node.getChildByName("backpack1");


    }
    setBehaviour(state: BehaviourType) {
        this.BehaviourType = state;
    }
    getBehaviour() {
        return this.BehaviourType;

    }

    nextTree() {
        treeController.netxTree()
    }
    getHandOverPosNode() {
        return this.handOverNode;
    }
    getCornHandOverNode() {
        return this.cornHandOverNode;
    }
    shakeRed() {
        let houseMaterial = this.node.getChildByName("playerNode").getChildByName("player").getChildByName("Shimin").getComponent(SkinnedMeshRenderer);
        // let materials = houseMaterial.materials;
        //    materials[0] = this.redyMaterial;
        //    materials[1] = this.redyMaterial;
        //    houseMaterial.materials = materials
        tween(houseMaterial.node)
            // 定义要重复的动作序列：切换材质→等待→切回材质→等待
            .sequence(
                // 切换到目标材质
                tween().call(() => {
                    houseMaterial.setMaterialInstance(this.redyMaterial, 0);
                    houseMaterial.setMaterialInstance(this.redyMaterial, 1);
                }),
                // 等待 0.2 秒
                tween().delay(0.2),
                // 切回原材质
                tween().call(() => {
                    houseMaterial.setMaterialInstance(this.chapeauMaterial, 0);
                    houseMaterial.setMaterialInstance(this.bodyMaterial, 1);
                }),
                // 等待 0.2 秒（与切换时间对称）
                tween().delay(0.2)
            )
            // 重复整个序列 3 次
            .repeat(1)
            // 启动 tween
            .start();
    }
    initPos: Vec3 = new Vec3(0.017, 0.4, -0.225)
    private woodNUm = 0;
    //收集树
    private onlyCollectNum = 10
    async collectWood(character: Entity) {

        const prefab = await ResourceManager.instance.loadPrefab(Global.woodPrefabPath);
        let woodParent = (character as Character).node.getChildByName("backpack");

        //woodParent.setScale(new Vec3(0.8,0.8,0.8));
        for (let i = 0; i < this.onlyCollectNum; i++) {

            this.scheduleOnce(() => {
                Global.soundManager.playPickUpSound()
                let woodNode = instantiate(prefab);
                const originalScale = woodNode.scale.clone();
                const shrunkenScale = originalScale.clone().multiplyScalar(0.75);
                let pos = this.initPos.clone();
                pos.y += 0.22 * (character as Character).woodNum;
                (character as Character).woodNum++;
                Global.playerBodyWood++;
                Global.playerBodyWoodAll++;
                if (Global.playerBodyWoodAll >= Global.treeHandOverNumLimit) {
                    eventMgr.emit(EventType.ENTITY_SHOW_TREEHANDE);
                }
                if (Global.upgradeUIAnimtion == 0 || Global.upgradeUIAnimtion == -1) {
                    Global.upgradeUIAnimtion = 1;
                }
                woodNode.setPosition(pos);
                woodNode.setRotationFromEuler(90, 90, 0);
                woodNode.parent = woodParent;
                tween(woodNode)
                    .to(0.1, { scale: shrunkenScale })
                    .to(0.1, { scale: originalScale })
                    .start();

            }, i * 0.05);
        }
    }

    async collectWoodNew(character: Entity, num: number, target) {
        const prefab = await ResourceManager.instance.loadPrefab(Global.woodPrefabPath);
        let woodParent = (character as Character).node.getChildByName("backpack");


        for (let i = 0; i < num; i++) {

            let woodNode = instantiate(prefab);
            let pos = woodParent.worldPosition.clone();
            pos.y += 0.32 * (character as Character).woodNum;
            // // 获取 woodParent 的世界矩阵
            // const worldMatrix = woodParent.worldMatrix;
            // // 使用 transformMat4 方法将局部坐标转换为世界坐标
            // const worldPos1 = pos.transformMat4(worldMatrix);
            (character as Character).woodNum++;

            // woodNode.setPosition(pos);
            Global.playerBodyWood++;
            Global.playerBodyWoodAll++;



            if (Global.playerBodyWoodAll >= Global.treeHandOverNumLimit) {
                eventMgr.emit(EventType.ENTITY_SHOW_TREEHANDE);
            }
            woodNode.setRotationFromEuler(90, 90, 0);
            woodNode.parent = woodParent;
            this.randomizeItemsInBackpack1(target, woodNode)
            this.scheduleOnce(() => {
                this.restoreItemsInBackpack1(pos, woodNode, (character as Character))
                Global.soundManager.playPickUpSound()
            }, i * 0.1)

        }


        //woodParent.setScale(new Vec3(0.8,0.8,0.8));
        // for (let i = 0; i < num; i++) {

        //     this.scheduleOnce(() => {
        //         Global.soundManager.playPickUpSound()
        //         let woodNode = instantiate(prefab);
        //         const originalScale = woodNode.scale.clone();
        //         const shrunkenScale = originalScale.clone().multiplyScalar(0.75);
        //         let pos = this.initPos.clone();
        //         pos.y += 0.22 * (character as Character).woodNum;
        //         (character as Character).woodNum++;
        //         Global.playerBodyWood++;
        //         Global.playerBodyWoodAll++;
        //         if(Global.playerBodyWoodAll >= Global.treeHandOverNumLimit){
        //             eventMgr.emit(EventType.ENTITY_SHOW_TREEHANDE);
        //         }
        //         if (Global.upgradeUIAnimtion == 0 || Global.upgradeUIAnimtion == -1) {
        //             Global.upgradeUIAnimtion = 1;
        //         }
        //         woodNode.setPosition(pos);
        //         woodNode.setRotationFromEuler(90, 90, 0);
        //         woodNode.parent = woodParent;
        //         tween(woodNode)
        //             .to(0.1, { scale: shrunkenScale })
        //             .to(0.1, { scale: originalScale })
        //             .start();

        //     }, i * 0.05);
        // }
    }
    randomizeItemsInBackpack1(target, woodNode) {

        if (!target || !target.node) {
            return;
        }
        const parentWorldPos = target.node.getWorldPosition();
        // 生成相对于父节点的随机偏移量
        let relativeOffset: Vec3;
        do {
            relativeOffset = new Vec3(
                // 缩小 x 轴随机范围至 -1 到 1
                Math.floor(Math.random() * 3) - 1,
                0,
                // 缩小 z 轴随机范围至 -1 到 1
                Math.floor(Math.random() * 3) - 1
            );

        } while (relativeOffset.x === 0 && relativeOffset.z === 0);

        // 计算相对于父节点的目标位置
        let handOverPos = new Vec3(
            parentWorldPos.x + relativeOffset.x,
            parentWorldPos.y + relativeOffset.y,
            parentWorldPos.z + relativeOffset.z
        );
        const itemNode = woodNode;
        const itemWorldPos = itemNode.getWorldPosition().clone();

        // 计算贝塞尔曲线控制点
        const LIFT_HEIGHT = 2;
        const randomLift = () => Math.floor(Math.random() * (LIFT_HEIGHT * 2 + 1)) - LIFT_HEIGHT;

        const controlPoint = new Vec3(
            (itemNode.worldPosition.x + handOverPos.x) / 2 + randomLift(),
            (itemNode.worldPosition.y + handOverPos.y) / 2 + 6,
            (itemNode.worldPosition.z + handOverPos.z) / 2 + randomLift()
        );

        // 执行贝塞尔曲线动画
        tween(itemNode)
            .to(0.1, {
                // scale: new Vec3(1, 1, 1)
            }, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    const position = MathUtil.bezierCurve(
                        itemWorldPos,
                        controlPoint,
                        handOverPos,
                        ratio
                    );
                    target.worldPosition = position;
                }
            })
            .call(() => {
                // backpack.indexLength--;
                // this.randomizeItemsInBackpack(backpackIndex, count - 1);
            })
            .start();

    }
    restoreItemsInBackpack1(originalPos1, itemNode, character: Character) {


        // 遍历所有物品，执行恢复动画

        const originalPos = originalPos1
        if (!originalPos) return;

        const currentPos = itemNode.getWorldPosition().clone();

        // 贝塞尔曲线控制点
        const controlPoint = new Vec3(
            (currentPos.x + originalPos.x) / 2,
            (currentPos.y + originalPos.y) / 2 + 5,
            (currentPos.z + originalPos.z) / 2
        );
        // for(let i = 0 ;i <5;i++){
        //     this.scheduleOnce(()=>{
        //         Global.soundManager.playPickUpSound()
        //     },i*0.1)
        // }
        // Global.soundManager.playPickUpSound()
        tween(itemNode)
            .to(0.3, {}, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    let woodParent = (character as Character).node.getChildByName("backpack");
                    const newOriginalPos = new Vec3(
                        woodParent.worldPosition.x,
                        originalPos.y,
                        woodParent.worldPosition.z
                    );
                    const position = MathUtil.bezierCurve(
                        currentPos,
                        controlPoint,
                        newOriginalPos,
                        ratio
                    );
                    target.worldPosition = position;
                }
            })
            .start();


        // 恢复完成后，重置indexLength

    }
    // randomizeItemsInBackpack(target, count: number = 1) {
    //     const backpack = target;
    //     const parentWorldPos = backpack.getWorldPosition();
    //     // 生成相对于父节点的随机偏移量
    //     let relativeOffset: Vec3;
    //     do {
    //         relativeOffset = new Vec3(
    //             Math.floor(Math.random() * 7) - 3, // -3 到 3
    //             -0.35,
    //             Math.floor(Math.random() * 7) - 3  // -3 到 3
    //         );
    //     } while (relativeOffset.x === 0 && relativeOffset.z === 0);

    //     // 计算相对于父节点的目标位置
    //     let handOverPos = new Vec3(
    //         parentWorldPos.x + relativeOffset.x,
    //         parentWorldPos.y + relativeOffset.y,
    //         parentWorldPos.z + relativeOffset.z
    //     );

    //     const itemNode = backpack.parentNode.children[backpack.indexLength];
    //     const itemWorldPos = itemNode.getWorldPosition().clone();

    //     // 计算贝塞尔曲线控制点
    //     const LIFT_HEIGHT = 2;
    //     const randomLift = () => Math.floor(Math.random() * (LIFT_HEIGHT * 2 + 1)) - LIFT_HEIGHT;

    //     const controlPoint = new Vec3(
    //         (itemNode.worldPosition.x + handOverPos.x) / 2 + randomLift(),
    //         (itemNode.worldPosition.y + handOverPos.y) / 2 + 6,
    //         (itemNode.worldPosition.z + handOverPos.z) / 2 + randomLift()
    //     );

    //     // 执行贝塞尔曲线动画
    //     tween(itemNode)
    //         .to(0.1, {
    //             // scale: new Vec3(1, 1, 1)
    //         }, {
    //             easing: 'cubicInOut',
    //             onUpdate: (target: Node, ratio: number) => {
    //                 const position = MathUtil.bezierCurve(
    //                     itemWorldPos,
    //                     controlPoint,
    //                     handOverPos,
    //                     ratio
    //                 );
    //                 target.worldPosition = position;
    //             }
    //         })
    //         .call(() => {
    //             // backpack.indexLength--;
    //             // this.randomizeItemsInBackpack(backpackIndex, count - 1);
    //         })
    //         .start();
    // }

    //收集玉米
    async collectCorn(character: Entity) {
        const prefab = await ResourceManager.instance.loadPrefab(Global.cornPrefabPath);
        let woodParent1 = (character as Character).node.getChildByName("backpack1");
        //let woodParent = (character as Character).node.getChildByName("backpack");
        //  if (woodParent.children.length <= 0) {
        // let poss1 = woodParent1.position.clone()
        // let poss = woodParent.position.clone()
        // woodParent.setPosition(poss1)
        // woodParent1.setPosition(poss)

        //   }

        for (let i = 0; i < 4; i++) {
            this.scheduleOnce(() => {
                Global.soundManager.playPickUpSound()
                let woodNode = instantiate(prefab);
                const originalScale = woodNode.scale.clone();
                const shrunkenScale = originalScale.clone().multiplyScalar(0.75);
                let pos = this.initPos.clone();
                pos.y += 0.23 * (character as Character).cornNum;
                (character as Character).cornNum++;
                Global.playerBodyCornAll++;
                woodNode.setPosition(pos);
                woodNode.setRotationFromEuler(0, 90, 0);
                woodNode.parent = woodParent1;
                tween(woodNode)
                    .to(0.1, { scale: shrunkenScale })
                    .to(0.1, { scale: originalScale })
                    .start();
            }, i * 0.05);
        }
    }
    //开始移动 找树
    strtMoveTree() {
        (this.target as EnemyTree).setFindState(false)
        this.move((character: Entity) => {
            this.cutTree();
        })
    }
    //开始移动到交付点
    strtMoveHandOver() {
        this.move((character: Entity) => {
            character.target = null;
            this.handOver();
        })
    }
    // //到树地块的传送点
    // moveTransmit() {
    //     this.move((character: Entity) => {
    //         this.setFindTarget(false);
    //         this.BehaviourType = BehaviourType.Idel;
    //         this.idle();
    //     })
    // }
    //移动到玉米地块的位置
    moveCornPos() {
        this.move((character: Entity) => {
            this.setFindTarget(false);
            this.BehaviourType = BehaviourType.CutCorn;
            this.idle();
        })
    }
    // //寻找怪物
    // findEnemy() {
    //     this.move((character: Entity) => {
    //         this.useSkill(()=>{
    //              eventMgr.emit(EventType.ENTITY_ENEMY_DIE,this);

    //         });
    //     })
    // }
    //寻找怪物

    findEnemyPos(enemy: enemyCharacter, enemyParentNode) {
        this.move((character: Entity) => {
            Global.characterPosNum++;

            this.setFindTarget(false);
            this.BehaviourType = BehaviourType.Idel;
            this.idle();
            if (Global.characterPosNum >= 4) {
                Global.isUpgrade = true;

                //  enemyParentNode.active = true;
                // Global.warnUI.playWarnFadeAnimation();

            }
        })
    }
    //到达交付点
    findEnemyHandOver() {
        this.move((character: Entity) => {
            this.cornHandOver();
        })
    }


}


