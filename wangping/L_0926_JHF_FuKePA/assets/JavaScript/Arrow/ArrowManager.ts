import { _decorator, Component, find, instantiate, math, Node, Quat, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

/**
 * plot1 解锁煤油灯
 * plot2 解锁武器
 * plot3 解锁新地块
 * plot4 交付生肉
 * plot5 收集熟肉
 * plot6 交付熟肉
 * plot7 收集金币
 */

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

    @property(Node)
    coinCon: Node = null;

    @property(Node)
    collectMeatCon: Node = null;

    @property(Node)
    monstersCon: Node = null;

    @property(Node)
    deliveryRoastDuckCon: Node = null;

    @property(Node)
    deliveryMeatCon: Node = null;

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

    private _pathStart: Vec3 = new Vec3();
    private _pathEnd: Vec3 = new Vec3();
    private _pathDir: Vec3 = new Vec3(1, 0, 0);
    private _pathLen: number = 0;
    private _flowOffset: number = 0;     // 循环
    private _flowEnabled: boolean = false;

    private _guidePointCon: Node = null;
    start() {
        // 临时
        DataManager.Instance.arrowTargetNode = this;

        this._guidePointCon = find("Root/GuidePointCon");
    }

    update(deltaTime: number) {
        // 先推进已有路径的箭头流动
        this._tickArrowFlow(deltaTime);

        if (!DataManager.Instance.arrowTargetNode && !DataManager.Instance.player && !DataManager.Instance.rules) return;

        if (DataManager.Instance.cameraGuiding) {
            this.setArrowCount(0);
            this._flowEnabled = false; // 停止流动
            DataManager.Instance.arrow3DManager?.node && (DataManager.Instance.arrow3DManager.node.active = false);
            DataManager.Instance.currentArrowPointing = null;
            this._lastArrowTarget = null;
            return;
        }

        const guideList = DataManager.Instance.rules;
        const inGuide = !!(guideList && guideList.length > 0 && DataManager.Instance.isEnterPromptArea);

        if (inGuide) {
            const targetData = guideList.find(item => item.isDisplay);

            const coinBackpack = this.searchBackpackItem(TypeItemEnum.GoldCoin);            // 金币
            const roastBackpack = this.searchBackpackItem(TypeItemEnum.Roast);              // 烤肉
            const meatBackpack = this.searchBackpackItem(TypeItemEnum.Meat);                // 肉

            const coinNum = coinBackpack ? coinBackpack.children.length : 0;
            const roastNum = roastBackpack ? roastBackpack.children.length : 0;
            const meatNum = meatBackpack ? meatBackpack.children.length : 0;
            // —— 分支一：指向解锁点（targetData.plot）——
            if ((targetData && coinNum >= targetData.coinNumber) || (targetData && targetData.colliderName == PlotEnum.Plot3 && coinNum >= targetData.initCoinNum / 2)) {
                const node = this._guidePointCon?.children.find(item => item.name == targetData.colliderName) as Node | null;
                if (node) {
                    if (this.shouldHideForTarget(node, false)) {
                        this.hideArrow();
                        DataManager.Instance.currentArrowPointing = node;
                        this._lastArrowTarget = node;
                        return;
                    }
                    // 显示箭头
                    DataManager.Instance.arrow3DManager.node.active = true;
                    this.createArrowPathTo(node.worldPosition);
                    DataManager.Instance.arrow3DManager.floatingHeightOffset = 10;
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                    DataManager.Instance.currentArrowPointing = node;
                    this._lastArrowTarget = node;
                    return;
                }
            }
            // // —— 分支二：身上和指定区域金币 > 当前已经解锁地块的区域 —— 
            else if ((targetData && this.coinCon.children.length + coinNum >= targetData.coinNumber) || (this.coinCon.children.length > 150)) {
                const node = this._guidePointCon?.children.find(item => item.name == PlotEnum.Plot7) as Node | null;
                if (this.shouldHideForTarget(node, false)) {
                    this.hideArrow();
                    DataManager.Instance.currentArrowPointing = node;
                    this._lastArrowTarget = node;
                    return;
                }
                // const height = this.coinCon.children[this.coinCon.children.length - 10] ?
                //     this.coinCon.children[this.coinCon.children.length - 10].worldPosition.y + 5 : 5;
                // DataManager.Instance.arrow3DManager.floatingHeightOffset = height;

                this._getSmoothChildHeight(this.coinCon, deltaTime);
                DataManager.Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(node.worldPosition);
                DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                DataManager.Instance.currentArrowPointing = node;
                this._lastArrowTarget = node;
                return;
            }
            // —— 分支三：玩家身上的熟肉 * 倍数 + 身上的金币 > 当前已经解锁的地贴 —— 
            else if ((targetData && roastNum * DataManager.Instance.sceneManager.coinYieldMultiplier + coinNum >= targetData.coinNumber) || (roastNum > 50)) {
                const node = this._guidePointCon?.children.find(item => item.name == PlotEnum.Plot6) as Node | null;
                if (this.shouldHideForTarget(node, /*isTree*/ false)) {
                    this.hideArrow();
                    DataManager.Instance.currentArrowPointing = node;
                    this._lastArrowTarget = node;
                    return;
                }
                // const height = this.deliveryRoastDuckCon.children[this.deliveryRoastDuckCon.children.length - 10] ?
                //     this.deliveryRoastDuckCon.children[this.deliveryRoastDuckCon.children.length - 10].worldPosition.y + 5 : 5;
                // DataManager.Instance.arrow3DManager.floatingHeightOffset = height;
                this._getSmoothChildHeight(this.deliveryRoastDuckCon, deltaTime);
                DataManager.Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(node.worldPosition);
                DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                DataManager.Instance.currentArrowPointing = node;
                this._lastArrowTarget = node;
                return;
            }
            // // —— 分支四：桌子上产出熟肉 * 倍数 + 身上的金币 >  当前已经解锁的地贴  —— 
            else if ((targetData && this.collectMeatCon.children.length * DataManager.Instance.sceneManager.coinYieldMultiplier + coinNum >= targetData.coinNumber) || (this.collectMeatCon.children.length > 50)) {
                const node = this._guidePointCon?.children.find(item => item.name == PlotEnum.Plot5) as Node | null;
                if (this.shouldHideForTarget(node, false)) {
                    this.hideArrow();
                    DataManager.Instance.currentArrowPointing = node;
                    this._lastArrowTarget = node;
                    return;
                }
                // const height = this.collectMeatCon.children[this.collectMeatCon.children.length - 10] ?
                //     this.collectMeatCon.children[this.collectMeatCon.children.length - 10].worldPosition.y + 5 : 5;
                // DataManager.Instance.arrow3DManager.floatingHeightOffset = height;
                this._getSmoothChildHeight(this.collectMeatCon, deltaTime);
                DataManager.Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(node.worldPosition);
                DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                DataManager.Instance.currentArrowPointing = node;
                this._lastArrowTarget = node;
                return;
            }
            // 生肉数量 + 倍数 + 身上的金币 > 当前已经解锁的地贴
            else if ((targetData && meatNum * DataManager.Instance.sceneManager.coinYieldMultiplier + coinNum > targetData.coinNumber) ||
                (targetData && meatNum > 50)) {
                const node = this._guidePointCon?.children.find(item => item.name == PlotEnum.Plot4) as Node | null;
                if (this.shouldHideForTarget(node, false)) {
                    this.hideArrow();
                    DataManager.Instance.currentArrowPointing = node;
                    this._lastArrowTarget = node;
                    return;
                }
                // const height = this.deliveryMeatCon.children[this.deliveryMeatCon.children.length - 10] ?
                //     this.deliveryMeatCon.children[this.deliveryMeatCon.children.length - 10].worldPosition.y + 5 : 5;
                this._getSmoothChildHeight(this.deliveryMeatCon, deltaTime);
                // DataManager.Instance.arrow3DManager.floatingHeightOffset = height;
                DataManager.Instance.arrow3DManager.node.active = true;
                this.createArrowPathTo(node.worldPosition);
                DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, node.worldPosition, true);
                DataManager.Instance.currentArrowPointing = node;
                this._lastArrowTarget = node;
                return;
            } else
            // —— 分支五：去砍树（回退，找树永不隐藏箭头）——
            {
                const playerNode = DataManager.Instance.player?.node;
                const nearestMonster = playerNode ? this.getNearMonster(playerNode) : null;

                if (nearestMonster) {
                    // 找树不隐藏：无论是否在区域内都显示
                    this.createArrowPathTo(nearestMonster.worldPosition);
                    DataManager.Instance.arrow3DManager.node.active = true;
                    DataManager.Instance.arrow3DManager.floatingHeightOffset = 15;
                    DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, nearestMonster.worldPosition, false);

                    DataManager.Instance.currentArrowPointing = nearestMonster;
                    this._lastArrowTarget = nearestMonster;
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
    getNearMonster(player: Node): Node | null {
        if (!player?.isValid || !this.monstersCon?.isValid) return null;

        const playerPos = player.worldPosition;
        let nearest: Node | null = null;
        let minDistSq = Number.POSITIVE_INFINITY;

        for (const monster of this.monstersCon.children) {
            if (!monster?.isValid || !monster.activeInHierarchy) continue;

            const d = Vec3.squaredDistance(playerPos, monster.worldPosition);
            if (d < minDistSq) {
                minDistSq = d;
                nearest = monster;
            }
        }

        return nearest;
    }

    private _arrowHeightCurrent = 5; // 缓存当前高度

    /**
     * 平滑获取容器中倒数第 N 个子节点的高度 + 偏移
     * @param container 子节点容器
     * @param deltaTime 每帧 dt
     * @param indexFromEnd 倒数第几个（默认 10）
     * @param offsetY 额外加的高度（默认 5）
     */
    private _getSmoothChildHeight(
        container: Node,
        deltaTime: number,
        indexFromEnd: number = 10,
        offsetY: number = 5
    ): number {
        const children = container.children;
        const idx = children.length - indexFromEnd;

        const target = idx >= 0 && children[idx] ? children[idx].worldPosition.y + offsetY : offsetY;

        // 平滑插值，k 越大响应越快，越小越柔顺
        const k = Math.min(1, deltaTime * 5);
        this._arrowHeightCurrent = math.lerp(this._arrowHeightCurrent, target, k);
        DataManager.Instance.arrow3DManager.floatingHeightOffset = this._arrowHeightCurrent;

        return this._arrowHeightCurrent;
    }

}
