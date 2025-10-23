import { _decorator, Animation, Color, Component, find, instantiate, Label, Node, Pool, SkeletalAnimation, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, PlotEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('BoardConManager')
export class BoardConManager extends Component {
    @property(Node)
    landmarkNode: Node = null;

    @property(Node)
    fireNode: Node = null;

    @property(Label)
    line: Label = null;

    // 分母
    @property(Label)
    denominatorLabel: Label = null;

    // 分子
    @property(Label)
    moleculeLabel: Label = null;

    @property(SkeletalAnimation)
    conveyorAni: SkeletalAnimation = null;

    private _boardPool: Pool<Node> | null = null;
    private _boardCount: number = 300;
    private _isOnceFire = true;
    private _curBoardCount = 0;
    private _speed: number = 4.7;
    private _direction: Vec3 = new Vec3();
    private _endPos: Vec3;

    private _boardList: Node[] = [];
    private _conveyorAniPlaying: boolean = false;

    private _plots = ["Plot0", "Plot2", "Plot3", "Plot4", "Plot9"]
    private _unlock = null;
    // 1 , 0.7, 0.5 , 0.4
    private _elapsedTime: number = 0;
    private _curSecond: number = 0;
    start(): void {
        DataManager.Instance.boardManager = this;
        this._unlock = find("THREE3DNODE/Unlock");
    }

    boardManagerInit() {
        this._boardPool = new Pool(() => {
            const boardPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Board);
            return instantiate(boardPrefab)
        }, this._boardCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    createboard() {
        if (!this._boardPool) return;

        const node = this._boardPool.alloc();
        if (node.parent == null) node.setParent(this.node);
        node.active = true;

        return node;
    }

    onDestroy() {
        this._boardPool.destroy();
    }

    // 回收木桩
    onboardDead(node) {
        node.active = false;
        this._boardPool.free(node);
    }

    public boardAni(startNode: Node, endNode: Node) {
        const board = this.createboard();
        if (!board) return;

        board.setPosition(startNode.position)
        board.setScale(0, 0, 0);
        if (!DataManager.Instance.isConveyerBeltUpgrade) {
            board.setRotationFromEuler(0, 90, 0);
        } else {
            board.setRotationFromEuler(0, 0, 0);
        }

        if (!this._endPos) {
            this._endPos = endNode.worldPosition.clone();
            Vec3.subtract(this._direction, endNode.worldPosition, startNode.worldPosition)
            this._direction = this._direction.normalize();
        }
        tween(board)
            .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .call(() => {
                this._boardList.push(board);
                // if (!this._conveyorAniPlaying) {
                //     this.conveyorAni.play();
                //     this._conveyorAniPlaying = true;
                // }
            })
            .start();
    }

    // 放在类里
    private _tmp = new Vec3();

    private _applyFractionFontSize(denLen: number) {
        if (denLen >= 4) {
            const s = 30;
            this.denominatorLabel.fontSize = s;
            this.denominatorLabel.lineHeight = s;
            this.line.fontSize = s;
            this.line.lineHeight = s;
            this.moleculeLabel.fontSize = s;
            this.moleculeLabel.lineHeight = s;
        } else if (denLen >= 3) {
            const s = 40;
            this.denominatorLabel.fontSize = s;
            this.denominatorLabel.lineHeight = s;
            this.line.fontSize = s;
            this.line.lineHeight = s;
            this.moleculeLabel.fontSize = s;
            this.moleculeLabel.lineHeight = s;
        }
    }

    private _handleArrive(board: Node, dm: typeof DataManager.Instance) {
        // 到达后的收尾动画与状态更新
        tween(board)
            .to(0.05, { scale: new Vec3(0, 0, 0) }, { easing: 'quadOut' })
            .call(() => {
                this._curSecond += 2;
                this._curBoardCount += 1;
                this.moleculeLabel.color = new Color(0, 255, 0, 255)
                this.denominatorLabel.color = new Color(0, 255, 0, 255);
                this.line.color = new Color(0, 255, 0, 255);

                DataManager.Instance.curQuantityFirewood = Math.max(DataManager.Instance.curQuantityFirewood - 1, 0);

                if (this.moleculeLabel) {
                    this.moleculeLabel.string = `${this._curBoardCount}`;
                }


                // 根据分母长度调整字形
                const denLen = this.denominatorLabel?.string?.length ?? 0;
                this._applyFractionFontSize(denLen);

                // 清理木板
                this.onboardDead(board);
                if (board?.isValid) board.removeFromParent();

                // 仅触发一次火焰动画
                const fireAni = this.fireNode?.getComponent(Animation);
                if (fireAni && this.node?.isValid && this.node.children.length > 0 && this._isOnceFire) {
                    this._isOnceFire = false;
                    this.fireNode.active = true;
                    fireAni.play("TX_huoyan-001");
                }

                dm.isTowerAttack = true;
            })
            .start();
    }

    update(dt: number): void {
        if (Number(this.denominatorLabel.string) + 1 <= Number(this.moleculeLabel.string) + DataManager.Instance.curQuantityFirewood) {
            DataManager.Instance.isContinueFillFireWood = false;
        } else {
            DataManager.Instance.isContinueFillFireWood = true;
        }

        const dm = DataManager.Instance;
        if (!dm.curReduceTemplateTimeArr) return;

        // 缓存经常用到的量
        const level = dm.conveyorLevel || 1;
        const speedStep = this._speed * dt * level;

        // === 更新木桩（木板）位置，从后往前安全移除 ===
        for (let i = this._boardList.length - 1; i >= 0; i--) {
            const board = this._boardList[i];
            if (!board?.isValid) {
                this._boardList.splice(i, 1);
                continue;
            }

            // dir = endPos - boardPos
            Vec3.subtract(this._tmp, this._endPos, board.worldPosition);

            // 到达判定：与前进方向点积 < 0 说明超越终点
            if (Vec3.dot(this._tmp, this._direction) < 0) {
                // 出列并处理抵达
                this._boardList.splice(i, 1);
                this._handleArrive(board, dm);
            } else {
                // 未到：沿方向推进
                Vec3.scaleAndAdd(this._tmp, board.worldPosition, this._direction, speedStep);
                board.setWorldPosition(this._tmp);
            }
        }

        // 没有触发塔攻击则不继续倒计时
        if (!dm.isTowerAttack) return;

        if (this._curBoardCount > 0) {
            this._elapsedTime += dt;

            // 取当前模板减时；默认 2
            const reduceTime = dm.curReduceTemplateTimeArr[dm.curReduceTemplateTimeIndex] ?? 2;

            if (this._elapsedTime >= reduceTime) {
                this._elapsedTime = 0;
                this._curBoardCount = Math.max(0, this._curBoardCount - 1);

                if (this.moleculeLabel) {
                    this.moleculeLabel.string = `${this._curBoardCount}`;
                }

                // 当分子==分母时收尾
                const denominatorNum = Number(this.denominatorLabel?.string ?? "0");
                if (this._curBoardCount === denominatorNum) {
                    DataManager.Instance.isContinueFillFireWood = false;

                }
            }
        } else {
            this.moleculeLabel.color = new Color(255, 0, 0, 255)
            this.denominatorLabel.color = new Color(255, 0, 0, 255);
            this.line.color = new Color(255, 0, 0, 255);

            this._isOnceFire = true;           // 重置为可再次触发一次
            if (this.fireNode) this.fireNode.active = false;
            dm.isTowerAttack = false;

            // 归零秒数并清理线圈
            this._curSecond = 0;
            this.cleanElectricCoil();
        }
    }


    // 清理电圈
    cleanElectricCoil() {
        if (!this._unlock) return;

        for (let i = 0; i < this._plots.length; i++) {
            const name = this._plots[i];

            const plot = this._unlock.children.find(item => {
                return item.name == name;
            })

            if (plot) {
                const elementCon = plot.getChildByName("ElementCon");
                if (!elementCon) continue;

                const node = elementCon.getChildByName("Node");
                if (!node) continue;

                const dtai = node.getChildByName("DTani");
                if (!dtai) continue;

                const dianhuan = dtai.getChildByName("TX_dianhuan");
                if (!dianhuan) continue;

                dianhuan.active = false;

                const dianqiu = dtai.getChildByName("TX_dianqiu");
                if (!dianqiu) continue;

                dianqiu.active = false;
            }
        }
    }

    denominatorUpgradeAni(minNum: number, maxNum: number, interval: number = 0.05) {
        const label = this.denominatorLabel;
        if (!label || !label.isValid) return;

        for (let i = minNum; i <= maxNum; i++) {
            this.scheduleOnce(() => {
                label.string = String(i);
            }, (i - minNum) * interval);
        }
    }
}


