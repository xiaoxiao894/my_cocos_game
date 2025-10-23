import { _decorator, Component, Node, Quat, Vec3, Sprite, UIOpacity, instantiate } from 'cc';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('ArroePath')
export class ArroePath extends Component {

    // 箭头的律动频率
    @property
    flowSpeed: number = 3;

    @property({ tooltip: "箭头间距" })
    spacing: number = 2.0;

    arrowNodes: Node[] = [];

    targetPos = null; // 开关动态效果

    private _pathStart: Vec3 = new Vec3();
    private _pathEnd: Vec3 = new Vec3();
    private _pathDir: Vec3 = new Vec3(1, 0, 0);
    private _pathLen: number = 0;
    private _flowOffset: number = 0;     // 循环
    public _flowEnabled: boolean = false;

    update(dt: number) {
        this._tickArrowFlow(dt)
    }
    /** 记录新路径、生成/排布箭头，并启动实时跟随 */
    createArrowPathTo(targetPos: Vec3) {
        const player = App.playerController.getPlayer().node;
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
        const prefab = App.poolManager.getNode(GlobeVariable.entifyName.Guid_ArrowPath);
        if (!prefab) return;

        // 只在尾部增/删，已有索引不变 -> 不重排
        while (this.arrowNodes.length < targetCount) {
            const arrow = instantiate(prefab);
            arrow.setParent(App.sceneNode.guideParent);

            this.arrowNodes.push(arrow);
        }

        while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop()!;
            arrow.destroy();
        }
    }


    clearArrows() {
        if (this.arrowNodes.length === 0) return;

        this.arrowNodes.forEach(arrow => {
            App.poolManager.returnNode(arrow);
            arrow.removeFromParent();
        });
        this.arrowNodes.length = 0;
    }

    private _tickArrowFlow(dt: number) {
        if (!this._flowEnabled || this.arrowNodes.length === 0) return;

        const spacing = Math.max(0.05, this.spacing || 0.5);

        const speed = Math.max(0.001, this.flowSpeed);
        this._flowOffset += speed * dt;
        this._flowOffset = ((this._flowOffset % spacing) + spacing) % spacing;

        // 起点实时跟随人物脚下
        const player = App.playerController.getPlayer().node;
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
            pos.y = 0.2;

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

    // 组件销毁时清理资源
    onDestroy() {
        this.clearArrows();
    }
}