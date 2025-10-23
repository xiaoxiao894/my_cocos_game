import { _decorator, ccenum, CCFloat, Component, instantiate, Node, tween, Vec3 } from 'cc';
import { CommonEvent, BuildingType } from '../../common/CommonEnum';
import { ArcherTower } from '../Role/ArcherTower';

const { ccclass, property } = _decorator;

@ccclass('Transporter')
export class Transporter extends Component {
    @property({ type: Node, displayName: '传送带父节点' })
    public transportParent: Node = null;

    @property({ displayName: '解锁建筑' })
    public unlockBuilding: BuildingType = BuildingType.SwabTransporter;

    @property({ type: Node, displayName: '传送物品起点' })
    public startNode: Node = null;

    @property({ type: Node, displayName: '传送物品终点' })
    public endNode: Node = null;

    @property({ type: Node, displayName: '2D模拟节点' })
    public trans2D: Node = null;

    @property({ type: CCFloat, displayName: '传送时间间隔' })
    public transportInterval: number = 0.5;

    _transportTimeCount: number = 0;
    _startTransport: boolean = false;
    /** 目标建筑 */
    private _targetBuilding: BuildingType = BuildingType.SwabArcherTower;
    /** 目标建筑组件 */
    private _targetBuildingCom: ArcherTower = null;

    _oriScale: Vec3 = null;
    protected onLoad(): void {
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
        this._oriScale = this.node.scale.clone();
        if (this.unlockBuilding == BuildingType.SwabTransporter) {
            this._targetBuilding = BuildingType.SwabArcherTower;
        }
        else if (this.unlockBuilding == BuildingType.ExplosionFruitTransporter) {
            this._targetBuilding = BuildingType.ExplosionFruitDefenseTower;
        }

        this.startNode.active = false;
        this.endNode.active = false;
    }

    start() {
        this.node.active = false;
        this.trans2D.active = false;
        this.scheduleOnce(() => {
            let targetBuildingNode = manager.game.getBuildingNode(this._targetBuilding);
            if (targetBuildingNode) {
                this._targetBuildingCom = targetBuildingNode.getComponent(ArcherTower);
            }
        })
    }

    private onUnlockItem(item: BuildingType): void {
        if (item === this.unlockBuilding) {
            this.node.active = true;
            this.node.setScale(0, 0, 0);
            tween(this.node).to(0.5, { scale: this._oriScale }, { easing: 'backOut' }).call(() => {
                this._start2DTransport();
                this._startTransport = true;
            }).start();
        }
    }

    // 2D图片模拟传送带动画
    private _start2DTransport() {
        this.trans2D.active = true;
    }

    /**
     * 3D模型模拟传送带
     * @deprecated 暂不使用，改用2D图片模拟效果
     */
    private _start3DTransport() {
        const children = this.transportParent.children;
        if (children.length < 2) return;

        // 排序子节点，获取起点和终点位置
        children.sort((a, b) => a.position.z - b.position.z);
        const startPos = children[0].position.clone();
        const endPos = children[children.length - 1].position.clone();

        // 假设统一速度为 1 单位每秒，可根据实际情况调整
        const speed = 0.6;
        const maxToEndDuration = Vec3.distance(startPos, endPos) / speed;
        // 每个节点单独移动
        for (const child of children) {
            // 计算首次移动到终点的时间
            const moveToEndDuration = Vec3.distance(child.position, endPos) / speed;
            tween(child)
                .to(moveToEndDuration, { position: endPos })
                .call(() => {
                    child.setPosition(startPos);
                    tween(child)
                        .to(maxToEndDuration, { position: endPos })
                        .call(() => {
                            child.setPosition(startPos);
                        })
                        .union()
                        .repeatForever()
                        .start();
                })
                .start();
        }
    }

    update(deltaTime: number) {
        this._checkTrans(deltaTime);
    }

    _checkTrans(deltaTime: number) {
        if (!this._startTransport) return;
        if (this._transportTimeCount <= 0) {
            this._transportTimeCount = this.transportInterval;
            this._createTransItem();
        }
        this._transportTimeCount -= deltaTime;
    }

    /** 创建传送物品，从起点运动到终点，然后消失 */
    _createTransItem() {
        const item = instantiate(this.startNode);
        item.parent = this.startNode.parent;
        item.setWorldPosition(this.startNode.worldPosition);
        item.active = true;

        const moveTime = 6.5;
        let self = this;
        tween(item)
            .to(moveTime, { worldPosition: self.endNode.worldPosition })
            .call(() => {
                item.destroy();
                if (self._targetBuildingCom && self._targetBuildingCom.node.active) {
                    self._targetBuildingCom.addArrowByWpos(self.endNode.worldPosition);
                }
            })
            .start();
    }
}


