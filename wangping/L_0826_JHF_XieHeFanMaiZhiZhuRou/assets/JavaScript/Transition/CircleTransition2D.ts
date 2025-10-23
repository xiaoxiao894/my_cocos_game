import { _decorator, Component, Node, UITransform, Graphics, Mask, tween, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

/** 与调用处完全对齐的圆形转场组件 */
@ccclass('CircleTransition2D')
export class CircleTransition2D extends Component {
    @property({ tooltip: '全屏黑幕 Sprite（本节点子节点，受Mask裁剪）' })
    blackCover!: Node;

    @property(UITransform) maskUI!: UITransform;   // 本节点 UITransform
    @property(Mask) mask!: Mask;                   // Mask（GRAPHICS_STENCIL + inverted）
    @property(Graphics) gfx!: Graphics;            // Graphics（画圆）

    @property({ tooltip: '最小重绘半径变化，避免无谓重绘' })
    pixelEps: number = 0.6;

    private _isPlaying = false;
    private _currentRadius = 0;
    private _centerLocal: Vec2 = new Vec2(0, 0);   // 圆心（本地坐标，锚点在中心）

    onLoad() {
        this.maskUI = this.maskUI ?? this.getComponent(UITransform)!;
        this.mask   = this.mask   ?? this.getComponent(Mask)!;
        this.gfx    = this.gfx    ?? this.getComponent(Graphics)!;

        this.mask.type = Mask.Type.GRAPHICS_STENCIL;
        this.mask.inverted = true;

        this._fitToVisibleSize();
        this._fitBlackCover();
        this._centerLocal.set(0, 0);   // 默认居中
        this._drawRadius(0);
        this.node.active = false;
    }

    onEnable() {
        view.on('design-resolution-changed', this._onResized, this);
        view.on('canvas-resize', this._onResized, this);
    }
    onDisable() {
        view.off('design-resolution-changed', this._onResized, this);
        view.off('canvas-resize', this._onResized, this);
    }

    // ================= 对齐你的调用签名 =================

    /** 关场：从 startRadiusPx → 0（全黑） */
    playClose(centerPx?: Vec2, startRadiusPx?: number, duration = 0.8, onComplete?: () => void) {
        if (this._isPlaying) return;
        this._isPlaying = true;

        // 解析圆心（new Vec2(0,0) 或 undefined => 屏幕中心）
        const centerScreen = this._resolveCenter(centerPx);
        this._setCenterByScreenPx(centerScreen.x, centerScreen.y);

        // 半径：未传则自动计算“刚好全屏”的半径
        const startR = (startRadiusPx ?? this._radiusForFullOpen(centerScreen));

        this.node.active = true;
        if (this.blackCover) this.blackCover.active = true;

        this._setRadiusInternal(startR);
        this._tweenRadius(0, duration, () => {
            this._isPlaying = false;
            onComplete && onComplete();
        });
    }

    /** 开场：从 0 → endRadiusPx（足够全开则隐藏黑幕） */
    playOpen(centerPx?: Vec2, endRadiusPx?: number, duration = 0.8, onComplete?: () => void) {
        if (this._isPlaying) return;
        this._isPlaying = true;

        const centerScreen = this._resolveCenter(centerPx);
        this._setCenterByScreenPx(centerScreen.x, centerScreen.y);

        const endR = (endRadiusPx ?? this._radiusForFullOpen(centerScreen));

        this.node.active = true;
        if (this.blackCover) this.blackCover.active = true;

        // 避免从 0 起跳模板异常
        this._setRadiusInternal(Math.max(0.0001, this._currentRadius));

        this._tweenRadius(endR, duration, () => {
            // 洞已覆盖全屏 => 黑幕可隐藏、节点可关闭
            if (this.blackCover) this.blackCover.active = false;
            this.node.active = false;
            this._isPlaying = false;
            onComplete && onComplete();
        });
    }

    // ================= 内部实现 =================

    /** 把传入 centerPx 解析为“屏幕像素坐标”的圆心 */
    private _resolveCenter(centerPx?: Vec2): Vec2 {
        // 将 “undefined” 或 “(0,0)” 都当作“屏幕中心”
        if (!centerPx || (centerPx.x === 0 && centerPx.y === 0)) {
            const vs = view.getVisibleSize();
            return new Vec2(vs.width * 0.5, vs.height * 0.5);
        }
        return centerPx;
    }

    /** 设置圆心到屏幕像素坐标（不移动节点，只更新本地圆心） */
    private _setCenterByScreenPx(x: number, y: number) {
        const parent = this.node.parent;
        if (!parent) { this._centerLocal.set(0, 0); return; }
        const parentUI = parent.getComponent(UITransform);
        if (parentUI) {
            const local = parentUI.convertToNodeSpaceAR(new Vec3(x, y, 0));
            // 本地圆心 = 父AR局部 - 本节点位置
            const selfPos = this.node.position;
            this._centerLocal.set(local.x - selfPos.x, local.y - selfPos.y);
        } else {
            const vs = view.getVisibleSize();
            this._centerLocal.set(x - vs.width * 0.5, y - vs.height * 0.5);
        }
        if (this._currentRadius > 0) this._drawRadius(this._currentRadius);
    }

    /** 计算“刚好全屏”的半径（以屏幕像素坐标的圆心计算） */
    private _radiusForFullOpen(centerPx: Vec2): number {
        const vs = view.getVisibleSize();
        const corners = [
            new Vec2(0, 0),
            new Vec2(vs.width, 0),
            new Vec2(0, vs.height),
            new Vec2(vs.width, vs.height),
        ];
        let maxDist = 0;
        for (const c of corners) {
            const d = Math.hypot(c.x - centerPx.x, c.y - centerPx.y);
            if (d > maxDist) maxDist = d;
        }
        return maxDist + 6; // 冗余防露边
    }

    /** 节点尺寸设置为可视区（基线大小） */
    private _fitToVisibleSize() {
        const vs = view.getVisibleSize();
        this.maskUI.anchorX = 0.5;
        this.maskUI.anchorY = 0.5;
        this.maskUI.setContentSize(vs.width, vs.height);
        // 居中：把节点放到父几何中心，避免父锚点差异
        const p = this.node.parent?.getComponent(UITransform);
        if (p) {
            const cx = (0.5 - p.anchorX) * p.width;
            const cy = (0.5 - p.anchorY) * p.height;
            this.node.setPosition(cx, cy, 0);
        } else {
            this.node.setPosition(0, 0, 0);
        }
    }

    /** 黑幕全屏 */
    private _fitBlackCover() {
        if (!this.blackCover) return;
        const ui = this.blackCover.getComponent(UITransform);
        if (!ui) return;
        const vs = view.getVisibleSize();
        ui.anchorX = 0.5; ui.anchorY = 0.5;
        ui.setContentSize(vs.width, vs.height);
        this.blackCover.setPosition(0, 0, 0);
        this.blackCover.active = true;
    }

    private _onResized() {
        this._fitToVisibleSize();
        this._fitBlackCover();
        if (this._currentRadius > 0) this._drawRadius(this._currentRadius);
    }

    /** 带防抖设置半径并重绘 */
    private _setRadiusInternal(r: number) {
        if (Math.abs(r - this._currentRadius) < this.pixelEps) return;
        this._currentRadius = r;
        this._drawRadius(r);
    }

    /** 真正绘制圆洞（反向遮罩，圆心用本地坐标） */
    private _drawRadius(radius: number) {
        const g = this.gfx;
        g.clear();
        if (radius <= 0) return; // 0 => 全黑
        g.lineWidth = 0;
        g.circle(this._centerLocal.x, this._centerLocal.y, radius);
        g.fill();
    }

    /** 半径补间 */
    private _tweenRadius(targetRadius: number, duration: number, onComplete?: () => void) {
        const holder = { r: this._currentRadius };
        tween(holder)
            .to(duration, { r: targetRadius }, {
                easing: 'quadInOut',
                onUpdate: () => this._setRadiusInternal(holder.r),
            })
            .call(() => onComplete && onComplete())
            .start();
    }
}
