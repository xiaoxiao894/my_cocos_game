export class Ball {
    id: number;
    position: [number, number, number]; // [x, y, z]
    radius: number;
    supportedBy: Set<number>; // 支撑此球的球体ID（-1表示底面）
    supporting: Set<number>; // 此球支撑的球体ID

    constructor(id: number, x: number, y: number, z: number, radius: number) {
        this.id = id;
        this.position = [x, y, z];
        this.radius = radius;
        this.supportedBy = new Set();
        this.supporting = new Set();
    }
}

export class SpherePackingSimulator {
    L: number; // 盒子长度
    W: number; // 盒子宽度
    R: number; // 球体半径
    balls: Ball[]; // 所有球体
    private candidateCount: number; // 随机候选位置数量

    constructor(L: number, W: number, R: number, candidateCount: number = 20) {
        if (R >= L / 2 || R >= W / 2) {
            throw new Error("球体半径必须小于盒子长宽的一半");
        }
        this.L = L;
        this.W = W;
        this.R = R;
        this.balls = [];
        this.candidateCount = candidateCount;
    }

    /**
     * 计算在给定位置放置新球所需的高度和支撑球体
     * @param x 候选位置x坐标
     * @param y 候选位置y坐标
     * @param existingBalls 现有球体数组
     * @returns [高度, 支撑球体ID集合]
     */
    private calculateHeightAndSupports(
        x: number,
        y: number,
        existingBalls: Ball[]
    ): [number, Set<number>] {
        let minHeight = this.R; // 底面高度
        const supports = new Set<number>();

        // 检查与底面接触
        if (minHeight === this.R) {
            supports.add(-1); // -1 表示底面支撑
        }

        // 检查与现有球体的接触
        for (const ball of existingBalls) {
            const dx = x - ball.position[0];
            const dy = y - ball.position[1];
            const horizontalDist = Math.sqrt(dx * dx + dy * dy);

            // 水平距离小于两倍半径才可能接触
            if (horizontalDist < 2 * this.R) {
                const verticalGap = Math.sqrt(4 * this.R * this.R - horizontalDist * horizontalDist);
                const contactHeight = ball.position[2] + verticalGap;

                // 更新最小高度和支撑
                if (contactHeight > minHeight) {
                    minHeight = contactHeight;
                    supports.clear();
                    supports.add(ball.id);
                } else if (Math.abs(contactHeight - minHeight) < 1e-5) {
                    supports.add(ball.id);
                }
            }
        }

        return [minHeight, supports];
    }

    /**
     * 放置一个新球
     * @param ballId 球体ID
     */
    private placeBall(ballId: number) {
        let bestPosition: [number, number] | null = null;
        let bestHeight = Infinity;
        let bestSupports: Set<number> | null = null;

        // 生成候选位置并评估
        for (let i = 0; i < this.candidateCount; i++) {
            const x = this.R + Math.random() * (this.L - 2 * this.R);
            const y = this.R + Math.random() * (this.W - 2 * this.R);

            const [height, supports] = this.calculateHeightAndSupports(x, y, this.balls);

            if (height < bestHeight) {
                bestHeight = height;
                bestPosition = [x, y];
                bestSupports = supports;
            }
        }

        if (!bestPosition || !bestSupports) {
            throw new Error("无法找到有效放置位置");
        }

        // 创建新球并添加到数组
        const newBall = new Ball(ballId, ...bestPosition, bestHeight, this.R);
        newBall.supportedBy = bestSupports;
        this.balls.push(newBall);

        // 更新支撑关系
        for (const supportId of bestSupports) {
            if (supportId !== -1) {
                const supportBall = this.balls[supportId];
                supportBall.supporting.add(ballId);
            }
        }
    }

    /**
     * 放置N个球体
     * @param N 球体数量
     */
    placeBalls(N: number) {
        // 放置第一个球在中心
        const firstBall = new Ball(0, this.L / 2, this.W / 2, this.R, this.R);
        firstBall.supportedBy.add(-1); // 由底面支撑
        this.balls.push(firstBall);

        // 放置后续球体
        for (let i = 1; i < N; i++) {
            this.placeBall(i);
        }
    }

    /**
     * 获取当前所有球体的位置和支撑关系
     * @returns 球体状态数组
     */
    getBallStates(): Array<{
        id: number;
        position: [number, number, number];
        supports: number[]; // 支撑此球的球体ID（空表示底面）
        supporting: number[]; // 此球支撑的球体ID
    }> {
        return this.balls.map(ball => ({
            id: ball.id,
            position: [...ball.position] as [number, number, number],
            supports: [...ball.supportedBy].filter(id => id !== -1), // 排除底面标记
            supporting: [...ball.supporting]
        }));
    }
}

// // 使用示例
// const simulator = new SpherePackingSimulator(10, 8, 1);

// // 放置5个球
// simulator.placeBalls(5);
// console.log("初始状态:", simulator.getBallStates());

// // 移除球体1和3
// simulator.removeBalls([1, 3]);
// console.log("移除后状态:", simulator.getBallStates());

export interface Ball3DPosition {
    x: number;  // X轴坐标
    y: number;  // Y轴坐标（对应高度）
    z: number;  // Z轴坐标
    layer: number;  // 所在层数 (从0开始)
}

export class Pyramid3DBallStacker {
    radius: number;  // 球体半径
    spacingMultiplier: number;  // 球体之间的间隔倍数 (通常为2表示刚好接触)
    positions: Ball3DPosition[];  // 球体位置数组

    constructor(radius: number, spacingMultiplier: number = 2) {
        this.radius = radius;
        this.spacingMultiplier = spacingMultiplier;
        this.positions = [];
    }

    // 计算金字塔中所有球体的3D位置
    calculatePositions(pyramidHeight: number): Ball3DPosition[] {
        this.positions = [];

        for (let layer = 0; layer <= pyramidHeight; layer++) {
            const ballsPerLayer = layer * (layer + 1) / 2;
            const layerOffsetX = -layer * this.radius * this.spacingMultiplier / 2;
            const layerOffsetZ = -layer * this.radius * this.spacingMultiplier / 2;

            // 计算当前层的高度 (垂直方向)
            const layerY = layer * this.radius * Math.sqrt(6) / 3 * this.spacingMultiplier;

            // 生成当前层的球体位置
            for (let i = 0; i < layer; i++) {
                for (let j = i; j < layer; j++) {
                    // 计算水平坐标 (X轴) 和深度坐标 (Z轴)
                    const x = layerOffsetX + j * this.radius * this.spacingMultiplier;
                    const z = layerOffsetZ + (layer - i - 1) * this.radius * this.spacingMultiplier;

                    this.positions.push({
                        x,
                        y: layerY,
                        z,
                        layer
                    });
                }
            }
        }

        return this.positions;
    }

    // 获取球体的排列信息
    getBallPositions(): Ball3DPosition[] {
        return this.positions;
    }
}
