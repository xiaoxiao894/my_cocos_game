import { _decorator, assetManager, Component, find, instantiate, math, Node, Quat, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('ArrowManager')
export class ArrowManager extends Component {
    @property(Node)
    arrowNode: Node = null;

    @property(Node)
    target: Node = null;

    @property
    spacing: number = 2.0;

    arrowNodes: Node[] = [];
    start() {
        // 临时
        DataManager.Instance.arrowTargetNode = this.target;
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.arrowTargetNode && !DataManager.Instance.player) return;

        if (DataManager.Instance.guideTargetIndex == -1) {
            const nearestMonster = this.getNearMonster(DataManager.Instance.player.node);
            if (nearestMonster) {
                this.createArrowPathTo(nearestMonster.worldPosition);
                DataManager.Instance.arrow3DManager.node.active = true;
                DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, nearestMonster.worldPosition)

                this.conditionalJudgment();
            } else {
                this.setArrowCount(0); // 没有怪，清空箭头
                DataManager.Instance.arrow3DManager.node.active = false;
            }
            return;
        } else {
            // // 不在找怪
            if (DataManager.Instance.guideTargetList && DataManager.Instance.guideTargetList.length > 0) {
                const targetData = DataManager.Instance.guideTargetList.find(item => {
                    return item.isDisplay;
                })

                if (targetData && targetData.node) {
                    DataManager.Instance.arrow3DManager.node.active = true;
                    if (targetData.isDisplayPath) {
                        this.createArrowPathTo(targetData.node.worldPosition);
                    }
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, targetData.node.worldPosition)
                } else {
                    this.setArrowCount(0); // 没有怪，清空箭头
                    DataManager.Instance.arrow3DManager.node.active = false;
                }
            }
        }


        // const end = DataManager.Instance.guideTargetList[DataManager.Instance.guideTargetIndex].worldPosition;

        // const dir = new Vec3();
        // Vec3.subtract(dir, end, start);
        // const totalLength = dir.length();

        // if (totalLength < 0.01) {
        //     this.setArrowCount(0);
        //     return;
        // }

        // const count = Math.floor(totalLength / this.spacing);
        // this.setArrowCount(count);

        // dir.normalize();

        // if (this.arrowNodes.length <= 0) return;

        // for (let i = 0; i < count; i++) {
        //     const arrow = this.arrowNodes[i];
        //     const pos = new Vec3();
        //     Vec3.scaleAndAdd(pos, start, dir, this.spacing * i);
        //     arrow.setWorldPosition(pos);

        //     const rot = new Quat();
        //     Quat.fromViewUp(rot, dir, Vec3.UP);
        //     arrow.setWorldRotation(rot);
        // }
    }

    // 条件判断
    conditionalJudgment() {
        const player = DataManager.Instance.player.node;
        if (DataManager.Instance.guideTargetIndex == -1) {
            const backpack1 = player.getChildByName("Backpack1");

            if (backpack1 && backpack1.children.length >= 5) {
                DataManager.Instance.guideTargetIndex++;
            }
        }
    }

    createArrowPathTo(targetPos: Vec3) {
        const player = DataManager.Instance.player?.node;
        if (!player) return;

        const start = player.worldPosition;
        const dir = new Vec3();
        Vec3.subtract(dir, targetPos, start);
        const totalLength = dir.length();

        if (totalLength < 0.01) {
            this.setArrowCount(0);
            return;
        }

        const count = Math.floor(totalLength / this.spacing);
        this.setArrowCount(count);

        dir.normalize();

        for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            if (!arrow) continue;

            const pos = new Vec3();
            Vec3.scaleAndAdd(pos, start, dir, this.spacing * (i + 1)); // 避免从脚下起始
            arrow.setWorldPosition(pos);

            const rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
        }
    }

    setArrowCount(targetCount: number) {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.PathArrow);
        if (!prefab) return;

        while (this.arrowNodes.length < targetCount) {
            const arrow = instantiate(prefab);
            arrow.setParent(this.node);
            this.arrowNodes.push(arrow);
        }

        while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop()!;
            arrow.destroy();
        }
    }

    //  动态获取离主角最近的怪
    getNearMonster(player: Node): Node | null {
        const monsterParent = find("ThreeDNode/MonsterCon");
        if (!monsterParent || monsterParent.children.length === 0) return null;

        let nearestMonster: Node | null = null;
        let minDistSqr = Infinity;

        const playerPos = player.worldPosition;

        for (let i = 0; i < monsterParent.children.length; i++) {
            const monster = monsterParent.children[i];
            if (!monster || !monster.isValid) continue;

            const monsterPos = monster.worldPosition;

            const dx = monsterPos.x - playerPos.x;
            const dz = monsterPos.z - playerPos.z;
            const distSqr = dx * dx + dz * dz;

            if (distSqr < minDistSqr) {
                minDistSqr = distSqr;
                nearestMonster = monster;
            }
        }

        return nearestMonster;
    }
}


