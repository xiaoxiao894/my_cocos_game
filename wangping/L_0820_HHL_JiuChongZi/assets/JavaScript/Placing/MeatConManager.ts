import { _decorator, Animation, BoxCollider, Collider, Color, Component, ERigidBodyType, find, Node, RigidBody, SkeletalAnimation, Tween, tween, UIRenderer, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { StackManager } from '../StackSlot/StackManager';
import { MeraItem } from '../Item/MeraItem';
import { MathUtil } from '../Util/MathUtil';

const { ccclass, property } = _decorator;

@ccclass('MeatConManager')
export class MeatConManager extends Component {
    @property(Node)
    outputStartingPoint1: Node = null;

    @property(Node)
    outputStartingPoint2: Node = null;

    @property(Node)
    outputStartingPoint3: Node = null;

    @property(Node)
    stagbeetle: Node = null;

    @property(Node)
    barbecueCon1: Node | null = null;

    @property(Node)
    transitions: Node | null = null;

    barbecueDropRangeX = 10; // 横向偏移范围（宽度）
    barbecueDropRangeZ = 10; // 纵向偏移范围（深度）
    curvePeakY = 18; // 控制点高度

    private _isProcessing = false;
    meraItem = null;

    private _lastDeliveryCompletedTime: number = 0;
    //待生产数量
    _waitProductNum: number = 0;
    //生产时间间隔
    private _productTimer: number = 0.2;
    //生产计时
    private _productTime: number = 0;

    private isPlot10Once = true;

    start(): void {

        this.meraItem = this.stagbeetle.getComponent(MeraItem);

        const row = 2;
        const col = 3;
        const gapX = 2.1;
        const gapZ = 2.1;
        const gapY = 0.5;
        const maxLayer = 20000;

        if (this.node && !this.node["__stackManager"]) {
            this.node["__stackManager"] = new StackManager(row, col, gapX, gapZ, gapY, maxLayer);
        }

        if (this.barbecueCon1 && !this.barbecueCon1["__stackManager"]) {
            this.barbecueCon1["__stackManager"] = new StackManager(row, col, gapX, gapZ, gapY, maxLayer);
        }

        DataManager.Instance.meatConManager = this;
    }

    private _isProducing: boolean = false;
    private _promptAniTimer: number = 0;
    private _promptAniInterval: number = 5;
    private isPlayerDesignatedPlot = false;
    update(deltaTime: number) {
        if (!this.isPlayerDesignatedPlot) {
            this._promptAniTimer += deltaTime;
            if (this._promptAniTimer >= this._promptAniInterval) {
                this._promptAniTimer = 0;
                this.plotPromptAni();
            }
        }

        this.plot10();
        // 强制刷新角度。
        const chips = this.barbecueCon1.children;
        for (const node of chips) {
            if (node[`__lockRotation`]) {
                node.eulerAngles = node[`__lockedEuler`];
            }

            const pos = node.getPosition();
            if (pos.y < 0) {
                pos.y = 0;
                pos.x = pos.x;
                pos.z = pos.z;
                node.setPosition(pos);
            }
        }

        if (!this.meraItem) return;

        // // === 肉块收集逻辑（只要有就执行） ===
        if (!this._isProcessing && this.node.children.length > 0 && DataManager.Instance.hasPersonInPlot10) {
            const meat = this.getTopItem();
            if (meat) {
                const startPos = meat.getWorldPosition();
                const midPos1 = this.getMidPoint(startPos, this.transitions.worldPosition, 2.5);

                meat.setParent(this.node.parent);
                meat.setWorldPosition(startPos);
                this._isProcessing = true;

                const tParam = { t: 0 };
                tween(tParam)
                    .to(0.1, { t: 1 }, {
                        onUpdate: () => {
                            const t = tParam.t;
                            const oneMinusT = 1 - t;
                            const p0 = startPos;
                            const p1 = midPos1;
                            const p2 = this.transitions.worldPosition;

                            const current = new Vec3(
                                oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
                                oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
                                oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z
                            );

                            meat.setWorldPosition(current);
                        },
                        onComplete: () => {
                            this._isProcessing = false;
                            this.meraItem?.addMeat();
                            DataManager.Instance.meatManager.onProjectileDead(meat);
                            this._waitProductNum++;
                            this._lastDeliveryCompletedTime = Date.now(); // 记录交付时间

                            DataManager.Instance.bubbleManager.playScaleOnce();
                            DataManager.Instance.soundManager.meatDeliverSoundPlay();
                        }
                    })
                    .start();
            }
        }

        // === 产药逻辑 ===
        if (this._waitProductNum > 0) {
            this._productTime += deltaTime;

            // 如果未在产出动画中，启动一次动画
            if (!this._isProducing && this._waitProductNum >= 1) {
                this._isProducing = true;
                this.meraItem?.playOperate();  //  只执行一次
            }

            if (this._productTime >= this._productTimer && this._isProducing) {
                this._productTime = 0;
                this.createGrassChips();
                this._waitProductNum--;

                if (this._waitProductNum <= 0) {
                    this._isProducing = false;
                    this.meraItem?.playIdle();  //  停止动画
                }
            }
        } else {
            // 万一中途被打断，确保动画恢复
            if (this._isProducing) {
                this._isProducing = false;
                this.meraItem?.playIdle();
            }
            this._productTime = 0;
        }
    }

    private _isLeafAnimating = false;
    _pendingLeafIdleCount = 0;
    private _occupiedDropSpots: Vec3[] = [];
    createGrassChips() {
        const grassChips = DataManager.Instance.roastDuckManager.create();

        // 出生点
        const startPos = this.outputStartingPoint1.getWorldPosition().clone();
        startPos.x += 2;
        startPos.y += 22;
        grassChips.setWorldPosition(startPos);
        grassChips.setParent(this.barbecueCon1);
        grassChips[`__isReady`] = false;
        grassChips.eulerAngles = new Vec3(0, 0, 0);

        // === 随机落点，不重叠 ===
        const baseTargetPos = this.barbecueCon1.getWorldPosition().clone();
        const radius = 0.9; // 最小间隔距离
        let targetPos: Vec3 | null = null;
        const maxAttempts = 10;

        for (let i = 0; i < maxAttempts; i++) {
            const offsetX = Math.random() * this.barbecueDropRangeX - this.barbecueDropRangeX / 2;
            const offsetZ = Math.random() * this.barbecueDropRangeZ - this.barbecueDropRangeZ / 2;
            const candidate = baseTargetPos.clone().add(new Vec3(offsetX, 0, offsetZ));

            const isTooClose = this._occupiedDropSpots.some(p => Vec3.distance(p, candidate) < radius);
            if (!isTooClose) {
                targetPos = candidate;
                this._occupiedDropSpots.push(candidate);
                break;
            }
        }

        // 兜底处理
        if (!targetPos) {
            targetPos = baseTargetPos.clone();
        }

        // === 控制点 ===
        const controlPoint = new Vec3(
            (startPos.x + targetPos.x) / 2,
            this.curvePeakY,
            (startPos.z + targetPos.z) / 2
        );

        // // === 贝塞尔动画 ===
        const yezi1 = this.outputStartingPoint1.getComponent(SkeletalAnimation);
        const yezi2 = this.outputStartingPoint2.getComponent(SkeletalAnimation);
        const yezi3 = this.outputStartingPoint3.getComponent(SkeletalAnimation);

        // 如果还没在动画中，播放 hit
        if (!this._isLeafAnimating) {
            // DataManager.Instance.soundManager.grassMakeSoundPlay();

            // yezi1?.play('hit');
            // yezi2?.play('hit');
            // yezi3?.play('hit');
            this._isLeafAnimating = true;
        }

        // 动画未完成数量 +1
        this._pendingLeafIdleCount++;

        // 设置随机 Y 轴角度
        const startEuler = new Vec3(0, 0, 0);
        const targetEuler = new Vec3(
            0,
            Math.random() * 360,  // 随机 Y 轴角度
            0
        );
        const currentEuler = new Vec3();

        tween(grassChips)
            .to(0.4, { position: targetPos }, {
                easing: 'cubicInOut',
                onUpdate: (target, ratio) => {
                    const targetNode = target as Node;
                    const pos = MathUtil.bezierCurve(startPos, controlPoint, targetPos, ratio);
                    targetNode.setWorldPosition(pos);

                    //  插值旋转角度，只变 Y
                    currentEuler.set(
                        0,
                        startEuler.y + (targetEuler.y - startEuler.y) * ratio,
                        0
                    );
                    targetNode.eulerAngles = currentEuler;
                },
                onComplete(target) {
                    const targetNode = target as Node;

                    const boxCollider = targetNode.getComponent(BoxCollider);
                    if (boxCollider) {
                        boxCollider.enabled = true;
                    }

                    const rigidbody = targetNode.getComponent(RigidBody);
                    if (rigidbody) {
                        rigidbody.enabled = true;
                        rigidbody.wakeUp();
                    }

                    grassChips[`__lockRotation`] = true;
                    grassChips[`__lockedEuler`] = grassChips.eulerAngles.clone(); // 记录当前角度
                },
            })
            .call(() => {
                //每完成一个，数量 -1
                this._pendingLeafIdleCount--;

                // 
                DataManager.Instance.bubbleManager.reduceNumber();

                // 所有完成后播放 idle
                if (this._pendingLeafIdleCount <= 0) {
                    // yezi1?.play('idle');
                    // yezi2?.play('idle');
                    // yezi3?.play('idle');
                    this._isLeafAnimating = false;
                }
                grassChips[`__isReady`] = true;
            })
            .start();
    }

    private getTopItem(): Node | null {
        const stackManager: StackManager = this.node["__stackManager"];
        const lastSlot = stackManager.getLastOccupiedSlot();
        const node = lastSlot?.assignedNode || null;
        if (node) stackManager.releaseSlot(node);
        return node;
    }

    private getMidPoint(p0: Vec3, p2: Vec3, peakOffsetY: number): Vec3 {
        return new Vec3(
            (p0.x + p2.x) / 2,
            Math.max(p0.y, p2.y) + peakOffsetY,
            (p0.z + p2.z) / 2
        );
    }

    // 是否显示plot10 
    plot10() {
        const plot10 = find("ThreeDNode/PlotCon/Plot10");
        if (!plot10) return;

        if (this.node.children.length > 0 && this.isPlot10Once) {
            this.isPlot10Once = false;

            plot10.active = true;
            plot10.setScale(0, 0, 0);
            tween(plot10)
                .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                .start();
        }
    }

    private _plotTweenList: Tween<Node>[] = [];
    plotPromptAni() {
        if (this.node.children.length > 0 && !DataManager.Instance.hasPersonInPlot10) {
            const list = [
                find("ThreeDNode/PlotCon/Plot10")
            ];

            this._plotTweenList = [];

            for (let i = 0; i < list.length; i++) {
                const plotNode = list[i];
                if (!plotNode) continue;
                const landmark = plotNode?.getChildByName("Landmark");
                const dashedBoxParent = landmark.getChildByName("DashedBoxParent");
                const dashedBox = dashedBoxParent?.getChildByName("DashedBox");

                const dashedBoxAni = dashedBox.getComponent(Animation);
                if (dashedBoxAni) {
                    dashedBoxAni.play("UI_dikuangTS03");
                }

            }
        }
    }

    stopPlotPromptAni() {
        if (this._plotTweenList.length > 0) {
            for (let i = 0; i < this._plotTweenList.length; i++) {
                this._plotTweenList[i].stop();
            }
            this._plotTweenList = [];
        }

        // 可选：重置颜色和缩放
        const plotNames = ["Plot10"];
        for (const name of plotNames) {
            const node = find("ThreeDNode/PlotCon/" + name);
            const landmark = node?.getChildByName("Landmark");
            const dashedBoxParent = landmark.getChildByName("DashedBoxParent")
            const dashedBox = dashedBoxParent?.getChildByName("DashedBox");
            const renderer = dashedBox?.getComponent(UIRenderer);
            if (renderer) {
                renderer.color = new Color(255, 255, 255, 255);  // 重置颜色为白色
            }

            const dashedBoxAni = dashedBox.getComponent(Animation);
            if (dashedBoxAni) {
                dashedBoxAni.stop();
            }
            dashedBox.setScale(2, 2, 2);  // 重置缩放
        }
    }

    // 重置plot动画
    resetPlotPromptAni() {
        const list = [
            find("ThreeDNode/Plot10"),
        ]

        for (let i = 0; i < list.length; i++) {
            const plotNode = list[i];

            if (!plotNode) continue;

            const renderer = plotNode.getComponent(UIRenderer);
            if (renderer) renderer.color = new Color(255, 255, 255, 255);
        }
    }
}


