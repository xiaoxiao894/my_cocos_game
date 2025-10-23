import { _decorator, CCBoolean, CCFloat, Component, Node, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PalingAnimation')
export class PalingAnimation extends Component {
    // 存储所有活动的Tween
    private activeTweens: Tween<Node>[] = [];

    // 动画配置参数
    @property({ type: Node, tooltip: '要显示动画的子节点组，如果为空则使用当前节点的所有子节点' })
    public targetNode: Node = null;

    @property({ tooltip: '动画持续时间(秒)' })
    public duration: number = 0.2;

    @property({ tooltip: '起始位置Y轴偏移量' })
    public startOffsetY: number = 3;

    /**
     * 开始播放连续显示动画，并返回动画完成的Promise
     */
    public startAnimation(): Promise<void> {
        return new Promise((resolve) => {
            // 停止所有正在运行的动画
            this.stopAllAnimations();

            // 获取要处理的节点
            const nodeToAnimate = this.targetNode || this.node;

            // 确保节点是激活状态
            if (!nodeToAnimate.active) {
                nodeToAnimate.active = true;
            }

            const siblings = nodeToAnimate.children;

            // 如果没有子节点，直接resolve
            if (siblings.length === 0) {
                resolve();
                return;
            }

            // 首先将所有子节点移动到初始位置
            siblings.forEach(sibling => {
                const originalPosition = sibling.position.clone();
                sibling.position = new Vec3(
                    originalPosition.x,
                    originalPosition.y - this.startOffsetY,
                    originalPosition.z
                );
                if(sibling.active == false){
                    sibling.active = true;
                }
            });

            // 递归播放动画，并在最后一个动画完成时resolve
            this.playAnimationSequentially(siblings, 0, resolve);
        });
    }
    //从地底向上出现
    public startMoveDown() {
        const originalPosition = new Vec3(
            this.node.position.x,
            this.node.position.y - this.startOffsetY,
            this.node.position.z,
        );
        const tweenInstance = tween(this.node)
            .by(this.duration, { position: originalPosition }, {
                easing: "quadIn",
                onStart: () => {
                    this.node.active = true; // 确保节点激活
                },
                onComplete: () => {
                    this.node.active = false;
                    // 当前动画完成后，递归播放下一个
                    // this.playAnimationSequentially(siblings, index + 1, resolve);
                }
            })
            .start();
    }

    @property({ type: CCBoolean, tooltip: '跳跃效果开始参数调节 只有跳跃效果生效' })
    public enableBounce: boolean = false;


    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '弹跳动画总时长 ' })
    public totalDuration: number = 1.0;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '弹跳高度 跳跃效果生效' })
    public bounceHeight: number = 3;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '下落时超过起始点的距离 ' })
    public overshootDistance: number = 2;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '上升阶段占总时间的比例 ' })
    public upPhaseRatio: number = 0.4;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '下降阶段占总时间的比例 ' })
    public downPhaseRatio: number = 0.6;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '回弹阶段占总时间的比例 ' })
    public bounceBackRatio: number = 0.1;
    //有跳跃的效果
    startBounce() {
        // 如果没有指定目标节点，使用当前组件所在节点
        const node = this.targetNode || this.node;

        // 确保节点处于激活状态
        node.active = true;

        // 获取当前位置作为起始点
        const startPos = new Vec3(node.position.x, node.position.y, node.position.z);

        // 计算弹跳的最高点
        const peakPos = new Vec3(startPos.x, startPos.y + this.bounceHeight, startPos.z);

        // 计算下落时超过起始点的位置
        const overshootPos = new Vec3(startPos.x, startPos.y - this.overshootDistance, startPos.z);

        // 分阶段设置动画
        tween(node)
            // 上升阶段
            .to(this.totalDuration * this.upPhaseRatio, { position: peakPos }, {
                easing: "backOut"
            })
            // 下降阶段
            .to(this.totalDuration * this.downPhaseRatio, { position: overshootPos }, {
                easing: "bounceOut"
            })
            // 回弹到起始位置
            .to(this.totalDuration * this.bounceBackRatio, { position: startPos }, {
                easing: "quadOut"
            })
            .call(() => {
                // 动画完成后的回调
                // this.playAnimationSequentially(siblings, index + 1, resolve);
            })
            .start();
    }
    /**
     * 递归方法：按顺序播放每个子节点的动画
     * @param siblings 子节点数组
     * @param index 当前播放动画的子节点索引
     * @param resolve 动画完成的resolve函数
     */
    private playAnimationSequentially(siblings: Node[], index: number, resolve: () => void) {
        if (index >= siblings.length) {
            resolve(); // 所有动画播放完毕
            return;
        }

        const sibling = siblings[index];
        const originalPosition = sibling.position.clone();
        originalPosition.y += this.startOffsetY; // 恢复原始位置

        // 创建动画
        const tweenInstance = tween(sibling)
            .to(this.duration, { position: originalPosition }, {
                easing: "quadIn", //"backOut",
                onStart: () => {
                    sibling.active = true; // 确保节点激活
                },
                onComplete: () => {
                    // 当前动画完成后，递归播放下一个
                    this.playAnimationSequentially(siblings, index + 1, resolve);
                }
            })
            .start();

        // 存储tween实例以便后续管理
        this.activeTweens.push(tweenInstance);
    }

    /**
     * 停止所有动画并重置状态
     */
    public stopAllAnimations() {
        this.activeTweens.forEach(tween => tween.stop());
        this.activeTweens = [];
    }

    // 组件销毁时清理资源
    onDestroy() {
        this.stopAllAnimations();
    }
}