import { _decorator, Component, instantiate, Node, Pool, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('MeatManager')
export class MeatManager extends Component {
    private _meatPool: Pool<Node> | null = null;
    private _meatCount = 300;
    private _dropList: Node[] = [];
    private _autoCollectionList = [];

    start() {
        DataManager.Instance.meatManager = this;
    }

    init() {
        this._meatPool = new Pool(() => {
            const monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Meat);
            return instantiate(monsterPrefab!);
        }, this._meatCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    create() {
        if (!this._meatPool) return;
        let node = this._meatPool.alloc();
        if (node.parent === null) node.setParent(this.node)
        node.active = true;

        return node;
    }

    onDestroy() {
        this._meatPool.destroy();
    }

    // 肉掉落
    meatFallingOff(pos: Vec3, isPlayer) {
        const meat = this.create();
        meat[`__isReady`] = false;
        meat.setWorldPosition(pos);

        const startY = pos.y;
        const peakY = startY + 3;
        const bounceY = startY + 0.7;

        if (isPlayer) {
            // DataManager.Instance.soundManager.meatFallSoundPlay();
        }
        const meatScaleNode = meat.getChildByName("Meat");
        if (meatScaleNode) {
            meatScaleNode.setScale(4.5, 4.5, 4.5);
        }
        tween(meat)
            .to(0.25, { position: new Vec3(pos.x, peakY, pos.z) }, { easing: 'quadOut' })   // 向上弹起
            .to(0.2, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })    // 回落
            .to(0.15, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
            .to(0.15, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
            .call(() => {
                if (isPlayer) {
                    this._dropList.push(meat);
                    meat[`__isReady`] = true;
                } else {
                    // 放到自动收集的队列中，
                    this._autoCollectionList.push(meat);
                }
            })
            .start();
    }

    public getAutoDrops() {
        let newList = this._autoCollectionList.splice(0, this._autoCollectionList.length);
        return newList;
    }

    // 获取掉落物
    public getDrops() {
        let newList = this._dropList.splice(0, this._dropList.length);
        return newList;
    }

    // 回收金币
    public onProjectileDead(node) {
        node.active = false;
        this._meatPool.free(node);
    }
}


