import { _decorator, Component, find, instantiate, Node, Quat, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, TypeItemEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('ArrowManager')
export class ArrowManager extends Component {
    @property(Node)
    arrowNode: Node = null!;

    @property(Node)
    target: Node = null!;

    @property
    spacing: number = 0.5;

    @property
    flowSpeed: number = 4;

    @property
    arrowHeight: number = 0.2;      // 箭头Y高度

    // —— 脚下遮罩 ——
    // 半径（米）：半径内不显示任何箭头
    @property({ tooltip: '脚下遮罩半径（米），半径内不显示箭头' })
    maskRadius: number = 0.8;

    // 羽化长度（米）：0=硬边；>0 时在 [maskRadius, maskRadius+maskFeather] 线性由 0→1
    @property({ tooltip: '遮罩羽化长度（米），0 表示硬边' })
    maskFeather: number = 0.0;


    arrowNodes: Node[] = [];

    private _plot1: Node | null = null;
    private _plot7: Node | null = null;
    private _coinCon: Node | null = null;

    // 解锁帮手地块
    _unlockHelper = true;

    // 玩家进入同一区域后隐藏箭头的半径
    hideRadius: number = 3;

    // 是否启用“进入同一区域就隐藏箭头”
    hideWhileInside: boolean = true;

    // 记录上一次指向的目标（用于识别是否刚刚切换目标）
    private _lastArrowTarget: Node | null = null;

    //
    private _pathStart: Vec3 = new Vec3();
    private _pathEnd: Vec3 = new Vec3();
    private _pathDir: Vec3 = new Vec3(1, 0, 0);
    private _pathLen: number = 0;
    private _flowOffset: number = 0;     // 循环
    private _flowEnabled: boolean = false;

    start() {
        // 临时
        DataManager.Instance.arrowTargetNode = this;

        // 交付木头
        this._plot1 = find('THREE3DNODE/Unlock/Plot1');

        // 收集金币
        this._plot7 = find('THREE3DNODE/Unlock/Plot7');

        // 场地金币
        this._coinCon = find('THREE3DNODE/PlacingCon/SceneCoinCon');
    }

    update(deltaTime: number) {
        // 先推进已有路径的箭头流动
        this._tickArrowFlow(deltaTime);

        if (!DataManager.Instance.arrowTargetNode && !DataManager.Instance.player && !DataManager.Instance.guideTargetList) return;

        if (DataManager.Instance.cameraGuiding) {
            this.setArrowCount(0);
            this._flowEnabled = false; // 停止流动
            DataManager.Instance.arrow3DManager?.node && (DataManager.Instance.arrow3DManager.node.active = false);
            DataManager.Instance.currentArrowPointing = null;
            this._lastArrowTarget = null;
            return;
        }

        const guideList = DataManager.Instance.guideTargetList;
        const inGuide = !!(guideList && guideList.length > 0 && DataManager.Instance.isEnterPromptArea);

        if (inGuide) {
            const targetData = guideList.find(item => item.isDisplay);

            const coinTransitionCon = find('THREE3DNODE/CoinTransitionCon');
            const coinBackpack = this.searchBackpackItem(TypeItemEnum.Coin);
            const woodBackpack = this.searchBackpackItem(TypeItemEnum.Wood);

            // —— 分支一：指向解锁点（targetData.plot）——
            if ((targetData && coinBackpack && coinBackpack.children.length >= targetData.initCoinNum / 2) ||
                (targetData && coinBackpack && coinBackpack.children.length >= targetData.coinNum)) {
                const unlock = find('THREE3DNODE/Unlock');
                const node = unlock?.children.find(item => item.name == targetData.plot) as Node | null;

                if (node) {
                    if (this.shouldHideForTarget(node, /*isTree*/ false)) {
                        this.hideArrow();
                        DataManager.Instance.currentArrowPointing = node;
                        this._lastArrowTarget = node;
                        return;
                    }
                    // 显示箭头
                    DataManager.Instance.arrow3DManager.node.active = true;
                    this.createArrowPathTo(node.worldPosition);
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                    DataManager.Instance.currentArrowPointing = node;
                    this._lastArrowTarget = node;
                    return;
                }
            }
            // —— 分支二：满足金币条件则指向 plot7 —— 
            else if ((this._coinCon?.children.length ?? 0) + (coinTransitionCon?.children.length ?? 0) > 0
                // (
                //     coinTransitionCon &&
                //     targetData &&
                //     (targetData.coinNum <= ((coinBackpack?.children.length ?? 0) + (this._coinCon?.children.length ?? 0) + (coinTransitionCon?.children.length ?? 0)))
                // ) || (
                //     coinTransitionCon && !DataManager.Instance.isUnlockHelper &&
                //     targetData && (1 <= ((coinBackpack?.children.length ?? 0) + (this._coinCon?.children.length ?? 0) + (coinTransitionCon?.children.length ?? 0)))
                // )
            ) {
                DataManager.Instance.onlyGuidanceOnce = false;
                if (this._plot7) {
                    // if (this.shouldHideForTarget(this._plot7, /*isTree*/ false)) {
                    //     // this.hideArrow();
                    //     DataManager.Instance.currentArrowPointing = this._plot7;
                    //     this._lastArrowTarget = this._plot7;
                    //     return;
                    // }
                    DataManager.Instance.arrow3DManager.node.active = true;
                    this.createArrowPathTo(this._plot7.worldPosition);
                    let worldPos = new Vec3(this._plot7.worldPosition.x, this._plot7.worldPosition.y, this._plot7.worldPosition.z - 1);
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, worldPos, true);
                    DataManager.Instance.currentArrowPointing = this._plot7;
                    this._lastArrowTarget = this._plot7;
                    return;
                }
            }
            // —— 分支三：仅场地或背包金币满足，指向 plot7 —— 
            else if (targetData && this._coinCon && targetData.coinNum < this._coinCon.children.length) {
                if (this._plot7) {
                    if (this.shouldHideForTarget(this._plot7, /*isTree*/ false)) {
                        this.hideArrow();
                        DataManager.Instance.currentArrowPointing = this._plot7;
                        this._lastArrowTarget = this._plot7;
                        return;
                    }
                    DataManager.Instance.arrow3DManager.node.active = true;
                    this.createArrowPathTo(this._plot7.worldPosition);
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, this._plot7.worldPosition, true);
                    DataManager.Instance.currentArrowPointing = this._plot7;
                    this._lastArrowTarget = this._plot7;
                    return;
                }
            }
            // —— 分支四：木材满载则指向 plot1 —— 
            else if (woodBackpack && woodBackpack.children.length >= 10) {
                if (this._plot1) {
                    if (this.shouldHideForTarget(this._plot1, /*isTree*/ false)) {
                        this.hideArrow();
                        DataManager.Instance.currentArrowPointing = this._plot1;
                        this._lastArrowTarget = this._plot1;
                        return;
                    }
                    DataManager.Instance.arrow3DManager.node.active = true;
                    this.createArrowPathTo(this._plot1.worldPosition);
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, this._plot1.worldPosition, true);
                    DataManager.Instance.currentArrowPointing = this._plot1;
                    this._lastArrowTarget = this._plot1;
                    return;
                }
            }
            // —— 分支五：去砍树（回退，找树永不隐藏箭头）——
            {
                const playerNode = DataManager.Instance.player?.node;
                const nearestTree = playerNode ? this.getNearTree(playerNode) : null;

                if (nearestTree && nearestTree.worldPosition && DataManager.Instance.unlockPowerTowersNum < 2 && !DataManager.Instance.isUnlockHelper) {
                    // 找树不隐藏：无论是否在区域内都显示
                    this.createArrowPathTo(nearestTree.worldPosition);
                    DataManager.Instance.arrow3DManager.node.active = true;
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, nearestTree.worldPosition, false);

                    DataManager.Instance.currentArrowPointing = nearestTree;
                    this._lastArrowTarget = nearestTree;
                    this.conditionalJudgment();
                    return;
                } else {
                    this.setArrowCount(0);
                    this._flowEnabled = false; // 停止流动
                    DataManager.Instance.arrow3DManager.node.active = false;
                    DataManager.Instance.currentArrowPointing = null;
                    this._lastArrowTarget = null;
                    return;
                }
            }
        } else {
            this.setArrowCount(0);
            this._flowEnabled = false; // 停止流动
            DataManager.Instance.arrow3DManager.node.active = false;
            DataManager.Instance.currentArrowPointing = null;
            this._lastArrowTarget = null;
        }
    }

    private shouldHideForTarget(target: Node, isTree: boolean): boolean {
        if (isTree) return false; // 找树不隐藏
        if (!this.hideWhileInside) return false;

        const targetChanged = target !== this._lastArrowTarget;
        if (targetChanged) return false;

        return this.isPlayerInsideTarget(target);
    }

    private isPlayerInsideTarget(target: Node | null): boolean {
        const player = DataManager.Instance.player?.node;
        if (!this.hideWhileInside || !player || !target || !target.isValid) return false;
        return Vec3.distance(player.worldPosition, target.worldPosition) <= this.hideRadius;
    }

    private hideArrow() {
        this._flowEnabled = false;  // 停止流动
        this.setArrowCount(0);
        if (DataManager.Instance.arrow3DManager?.node) {
            DataManager.Instance.arrow3DManager.node.active = false;
        }
    }

    // 查找背包物品
    searchBackpackItem(typeItem: string) {
        const playerNode = DataManager.Instance.player.node;
        const backpack1 = playerNode.getChildByName('Backpack1');
        const backpack2 = playerNode.getChildByName('Backpack2');
        const backpack3 = playerNode.getChildByName('Backpack3');

        const backpacks: Node[] = [backpack1, backpack2, backpack3].filter(Boolean) as Node[];
        let sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);

        return sourceBackpack;
    }

    private _findBackpackWithItem(backpacks: Node[], typeItem: string): Node | null {
        for (const bag of backpacks) {
            if (bag.children.some(child => child.name.includes(typeItem))) {
                return bag;
            }
        }
        return null;
    }

    // 条件判断
    conditionalJudgment() {
        const player = DataManager.Instance.player.node;
        if (DataManager.Instance.guideTargetIndex == -1) {
            const backpack1 = player.getChildByName('Backpack1');
            if (backpack1 && backpack1.children.length >= 5) {
                DataManager.Instance.guideTargetIndex++;
            }
        }
    }
    /** 记录新路径、生成/排布箭头，并启动实时跟随 */
    createArrowPathTo(targetPos: Vec3) {
        const player = DataManager.Instance.player?.node;
        if (!player) return;

        player.getWorldPosition(this._pathStart);
        this._pathEnd.set(targetPos);

        Vec3.subtract(this._pathDir, this._pathEnd, this._pathStart);
        this._pathLen = this._pathDir.length();

        if (this._pathLen < 0.01) {
            this.setArrowCount(0);
            this._flowEnabled = false;
            return;
        }

        this._pathDir.normalize();

        // 固定间距推算数量
        const spacing = Math.max(0.05, this.spacing || 0.5);
        const totalCount = Math.max(2, Math.floor(this._pathLen / spacing) + 1);

        // 不重置 _flowOffset（保持连续流动）
        this.setArrowCount(totalCount);

        // 首帧排一次
        this._layoutArrows();
        this._flowEnabled = true;
    }

    setArrowCount(targetCount: number) {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.PathArrow);
        if (!prefab) return;

        // 只在尾部增/删，已有索引不变 -> 不重排
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

    private _tickArrowFlow(dt: number) {
        if (!this._flowEnabled || this.arrowNodes.length === 0) return;

        const spacing = Math.max(0.05, this.spacing || 0.5);

        const speed = Math.max(0.001, this.flowSpeed);
        this._flowOffset += speed * dt;
        this._flowOffset = ((this._flowOffset % spacing) + spacing) % spacing;

        // 起点实时跟随人物脚下
        const player = DataManager.Instance.player?.node;
        if (!player) return;
        player.getWorldPosition(this._pathStart);

        // 重算方向与长度
        Vec3.subtract(this._pathDir, this._pathEnd, this._pathStart);
        this._pathLen = this._pathDir.length();
        if (this._pathLen < 0.01) {
            this.setArrowCount(0);
            return;
        }
        this._pathDir.normalize();

        // 根据最新长度按固定间距更新尾部数量
        const needCount = Math.max(2, Math.floor(this._pathLen / spacing) + 1);
        if (needCount !== this.arrowNodes.length) {
            this.setArrowCount(needCount);
        }

        this._layoutArrows();
    }

    private _layoutArrows() {
        const rot = new Quat();
        Quat.fromViewUp(rot, this._pathDir, Vec3.UP);

        const count = this.arrowNodes.length;
        if (count <= 0 || this._pathLen < 0.0001) return;

        const spacing = Math.max(0.05, this.spacing || 0.5);
        const fadeInRange = spacing * 1.0;
        const fadeOutRange = spacing * 1.2;
        const NEWBORN_KEY = '__arrow_newborn__';

        const base = new Vec3();
        const pos = new Vec3();

        const distInfos: { i: number; dToEnd: number }[] = [];

        for (let i = 0; i < count; i++) {
            // let dist = (i === 0) ? 0 : (i - 1) * spacing + this._flowOffset;

            let dist = i * spacing + this._flowOffset;

            if (dist >= this._pathLen) dist = dist % this._pathLen;
            else if (dist < 0) dist = (dist % this._pathLen + this._pathLen) % this._pathLen;

            Vec3.multiplyScalar(base, this._pathDir, dist);
            Vec3.add(pos, this._pathStart, base);
            pos.y = this.arrowHeight;

            const arrow = this.arrowNodes[i];
            arrow.setWorldPosition(pos);
            arrow.setWorldRotation(rot);


            const ui = arrow.getComponent(UIOpacity) || arrow.addComponent(UIOpacity);

            const isNewborn = !!(arrow as any)[NEWBORN_KEY];
            if (isNewborn) {
                if (dist <= fadeInRange) {
                    const tIn = Math.max(0, Math.min(1, dist / fadeInRange));
                    ui.opacity = Math.floor(255 * tIn);
                    if (tIn >= 1) {
                        // 走出淡入区后
                        delete (arrow as any)[NEWBORN_KEY];
                    }
                } else {
                    ui.opacity = 0; // 还没到脚下，保持不可见
                }
                continue;
            }

            let alpha = 255;

            if (i !== 0 && dist <= fadeInRange) {
                const tIn = Math.max(0, Math.min(1, dist / fadeInRange));
                alpha = Math.min(alpha, Math.floor(255 * tIn));
            }

            const dToEnd = this._pathLen - dist;
            if (dToEnd <= fadeOutRange) {
                const tOut = Math.max(0, Math.min(1, dToEnd / fadeOutRange));
                alpha = Math.min(alpha, Math.floor(255 * tOut));
            }

            distInfos.push({ i, dToEnd });
            ui.opacity = alpha;
        }

        for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            const ui = arrow.getComponent(UIOpacity) || arrow.addComponent(UIOpacity);
            ui.opacity = 255;
        }

        distInfos.sort((a, b) => a.dToEnd - b.dToEnd);
        const last3 = distInfos.slice(0, Math.min(3, distInfos.length));

        const fades = [80, 140, 200];
        for (let k = 0; k < last3.length; k++) {
            const idx = last3[k].i;
            const arrow = this.arrowNodes[idx];
            const ui = arrow.getComponent(UIOpacity) || arrow.addComponent(UIOpacity);
            ui.opacity = fades[k];
        }
    }
    // 动态获取离主角最近的树
    getNearTree(player: Node): Node | null {
        if (DataManager.Instance.treeMatrix.length <= 0) return null;

        const treeMRow = DataManager.Instance.treeMatrix.length;
        const treeMCol = DataManager.Instance.treeMatrix[0].length;
        for (let c = treeMCol - 1; c >= 0; c--) {
            for (let r = 0; r < treeMRow; r++) {
                const treeNode = DataManager.Instance.treeMatrix[r][c];
                if (treeNode) {
                    return treeNode;
                }
            }
        }
        return null;
    }
}
