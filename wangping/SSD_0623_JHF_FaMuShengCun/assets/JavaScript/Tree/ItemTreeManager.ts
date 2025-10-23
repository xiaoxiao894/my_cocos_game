import { _decorator, Animation, AsyncDelegate, Collider, Component, find, instantiate, Node, RigidBody, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { MathUtil } from '../Util/MathUtil';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('ItemTreeManager')
export class ItemTreeManager extends Component {
    // 最大攻击数
    maxAttackNum = 3;
    // 当前攻击数
    private _curAttackNum = 0;

    // 是否被
    private isBeingCutDown: boolean = false;

    private _isAniPlaying: boolean = false;
    private _crookedTween;

    private _index: number = -1;

    public init(index: number) {
        this._index = index;
    }

    public get Index(): number {
        return this._index;
    }

    // 受击动画
    affectedAni(isPlayer: boolean = false, role) {
        if (this.isBeingCutDown) {
            return;
        }
        this._curAttackNum++;
        this.attackTreeAni(this._curAttackNum);

        //动画
        const amplitude: number = 10;

        const treePos = this.node.worldPosition.clone();
        const playerPos = role.worldPosition.clone();
        const direction = playerPos.subtract(treePos).normalize();

        // Convert direction to euler angles (only using x and z for leaning)
        const leanAngle = new Vec3(
            direction.x * amplitude,
            0,
            direction.z * amplitude
        );

        const fanLeanAngle = new Vec3(
            direction.x * -5,
            0,
            direction.z * -5
        );

        this._isAniPlaying = true;
        if (this._crookedTween) {
            this._crookedTween.stop();
        }
        tween(this.node)
            .to(0.08, { eulerAngles: leanAngle })
            .to(0.12, { eulerAngles: fanLeanAngle })
            .to(0.04, { eulerAngles: new Vec3(0, 0, 0) })
            .call(() => {
                this._isAniPlaying = false;
            })
            .start();

        if (this._curAttackNum >= this.maxAttackNum) {
            this.isBeingCutDown = true;

            // 可以去找其他不在区域内的树
            DataManager.Instance.curCutDownTree++;
            if (DataManager.Instance.curCutDownTree >= 56) {
                DataManager.Instance.searchTreeManager.searchNumber = 100;
            }

            // 清理自身的刚体
            const ssdTree = this.node.getChildByName("SSDshu");
            if (ssdTree) {
                const boxCollider = ssdTree.getComponent(Collider);
                if (boxCollider) {
                    boxCollider.enabled = false;
                }

                const rigidBody = ssdTree.getComponent(RigidBody);
                if (rigidBody) {
                    rigidBody.enabled = false;
                }
            }

            // const tree = this.node.getChildByPath("angleNode/shu");
            // tree.active = false;
            DataManager.Instance.gridSystem.removeNode(this.node);
            DataManager.Instance.woodManager.generateWoods(isPlayer, this.node, role);

            const { r, c } = DataManager.Instance.treeManager.findRemoveTree(this.node);
            if (r === -1) return; 

            // 保存当前树的位置和旋转
            const oldTreePos = this.node.getWorldPosition().clone();
            const oldTreeRot = this.node.getRotation().clone();
            const oldParent = this.node.parent;
            const oldIdx = this.node.parent.children.indexOf(this.node);
            const treeNum = (this.node as any)[`__treeNum`];

            // if (this.node && this.node.isValid) {
            //     this.node.destroy();
            // }

            // 延迟10秒重新生成一棵树
            this.scheduleOnce(() => {
                const treePrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Tree);
                if (treePrefab && oldParent) {
                    const newTree = instantiate(treePrefab);
                    newTree.setWorldPosition(oldTreePos);
                    newTree.setRotation(oldTreeRot);
                    oldParent.addChild(newTree);
                    // newTree[`__treeNum`] = treeNum;
                    // oldParent.insertChild(newTree, oldIdx);

                    const newTreeAni = newTree.getComponent(Animation);
                    newTreeAni.play();
                    newTreeAni.once(Animation.EventType.FINISHED, () => {
                        DataManager.Instance.gridSystem.updateNode(newTree);

                        DataManager.Instance.treeMatrix[r][c] = newTree;
                    })
                }
            }, 20);
        }
    }

    // 攻击树动画
    attackTreeAni(curAttackNum) {
        const ssdTree = this.node.getChildByName("SSDshu")
        if (ssdTree) {
            const ssdTreeAni = ssdTree.getComponent(Animation);

            if (ssdTreeAni) {
                if (curAttackNum == 1) {
                    ssdTreeAni.play("shuKF001");
                } else if (curAttackNum == 2) {
                    ssdTreeAni.play("shuKF002");
                } else if (curAttackNum == 3) {
                    ssdTreeAni.play("shuKF003");
                }
            }
        }
    }

    public playAni(angle: Vec3): void {
        if (this.isBeingCutDown || this._isAniPlaying) {
            return;
        }
        this._crookedTween = tween(this.node).to(0.2, { eulerAngles: angle }).to(0.2, { eulerAngles: new Vec3(0, 0, 0) }).start();
    }

    public get isBeingCut(): boolean {
        return this.isBeingCutDown;
    }

}


