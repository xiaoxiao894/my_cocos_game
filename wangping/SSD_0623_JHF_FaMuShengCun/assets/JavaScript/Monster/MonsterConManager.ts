import { _decorator, Component, director, Node, Quat, Tween, tween, Vec3 } from 'cc';
import { EntityTypeEnum, EventNames } from '../Enum/Index';
import Pool from '../Pool/Pool';
import { Simulator } from '../RVO/Simulator';
import { Vector2 } from '../RVO/Common';
import { MathUtil } from '../Util/MathUtil';
import Util from '../Common/Util';
import { MonsterItem } from './MonsterItem';
import { EventManager } from '../Global/EventManager';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

const SPIN_KEY = '__spinTween';

@ccclass('MonsterConManager')
export class MonsterConManager extends Component {
    @property(Node)
    monsterBirthPoint: Node = null;

    @property(Node)
    monsterParent: Node = null;

    @property(Node)
    coinConNode: Node = null;

    private selectLocationIndex = 0;

    private _monsterPools: Pool[] = [];
    private _monsterTypes: EntityTypeEnum[] = [EntityTypeEnum.Elephant, EntityTypeEnum.Bear, EntityTypeEnum.Bear_B, EntityTypeEnum.Bear_L];
    private _dropPool: Pool;
    private _bloodPool: Pool;

    private _speedCfg = [7, 5.5, 5.5, 5.5];
    private _radiusCfg = [3, 2, 2.5, 1.8];

    private _coinsList = [];

    private initMonsterPos = [
        { pos: new Vec3(-18.466, 0, -25.856), type: EntityTypeEnum.Elephant },
        { pos: new Vec3(-10.782, 0, -25.856), type: EntityTypeEnum.Bear_L },
        { pos: new Vec3(-2.515, 0, -25.856), type: EntityTypeEnum.Bear_B },
        { pos: new Vec3(8.038, 0, -25.209), type: EntityTypeEnum.Bear },
        { pos: new Vec3(16.237, 0, -25.687), type: EntityTypeEnum.Bear },
    ]

    protected start(): void {
        DataManager.Instance.monsterManager = this;
    }

    public init() {
        this._monsterPools = [];
        for (let i = 0; i < this._monsterTypes.length; i++) {
            this._monsterPools.push(new Pool(this._monsterTypes[i]));
        }

        this._dropPool = new Pool(EntityTypeEnum.Coin);
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));

        // for (let i = 0; i < this.initMonsterPos.length; i++) {
        //     const { pos } = this.initMonsterPos[i];

        //     DataManager.Instance.monsterManager.creatMonster(true, true, pos, true);
        // }
        for (let i = 0; i < this.node.children.length; i++) {
            const monster = this.node.children[i];
            const monsterItem = monster.getComponent(MonsterItem);
            if (!monsterItem) return;
            let validPos: Vec3 = monster.worldPosition;

            const idx = this._monsterPools.findIndex(item => {
                return item[`_prefab`].name == monster.name;
                // return item == monster.name;
            })

            monsterItem.init(idx, true, false);

            // const newNode = new Node("tempNode");
            // newNode.setScale(1, 0, 1);
            // director.getScene().addChild(newNode);
            // newNode.addChild(monster)
            // tween(newNode)
            //     .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            //     .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            //     .call(() => {
            //         this.monsterParent.addChild(monster);
            //         newNode.removeFromParent();
            //         newNode.destroy();
            const mass = 1;
            const agentId = Simulator.instance.addAgent(
                Util.v3t2(validPos),
                this._radiusCfg[idx],
                this._speedCfg[idx],
                null,
                mass
            );

            const agentObj = Simulator.instance.getAgentByAid(agentId);
            agentObj.neighborDist = this._radiusCfg[idx] * 2;

            monsterItem.agentHandleId = agentId;
            // })
            // .start();
        }
    }

    creatMonster(isDissolveOnce, isAfferentPos = false, pos = new Vec3(0, 0, 0), isCustomHp = false) {
        const randomNum = this.getWeightedRandom();
        const pool = this._monsterPools[randomNum];
        if (!pool) {
            // console.warn(`No monster pool found for type ${randomNum}`);
            return;
        }

        const node: Node = pool.getItem();
        const monster: MonsterItem = node.getComponent(MonsterItem);
        if (!monster) return;

        let validPos: Vec3 = null;
        if (isAfferentPos) {
            validPos = pos;
            node.setWorldPosition(validPos);
        } else {
            const birthPoints = this.monsterBirthPoint.children;
            if (this.selectLocationIndex >= birthPoints.length) {
                this.selectLocationIndex = 0;
            }

            const birthPoint = birthPoints[this.selectLocationIndex];
            validPos = birthPoint.getWorldPosition();
            node.setWorldPosition(validPos);
            this.selectLocationIndex++;
        }

        monster.init(randomNum, true, isCustomHp);

        const newNode = new Node("tempNode");
        newNode.setScale(1, 0, 1);
        director.getScene().addChild(newNode);
        newNode.addChild(node)
        tween(newNode)
            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .call(() => {
                this.monsterParent.addChild(node);
                newNode.removeFromParent();
                newNode.destroy();
                const mass = 1;
                const agentId = Simulator.instance.addAgent(
                    Util.v3t2(validPos),
                    this._radiusCfg[randomNum],
                    this._speedCfg[randomNum],
                    null,
                    mass
                );

                const agentObj = Simulator.instance.getAgentByAid(agentId);
                agentObj.neighborDist = this._radiusCfg[randomNum] * 2;

                monster.agentHandleId = agentId;
            })
            .start();
    }

    getWeightedRandom(): number {
        const weights = [25, 25, 25, 25]; // 对应 0, 1, 2 的权重
        const total = weights.reduce((a, b) => a + b, 0);
        const rand = Math.random() * total;

        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                return i; // i 就是结果：0, 1, 或 2
            }
        }

        return 1; // 理论上不会走到这里，但加上以防万一
    }

    public killMonsters(nodes: Node[], end) {
        for (let node of nodes) {
            if (!node || !node.isValid) {
                continue;
            }
            let monster: MonsterItem = node.getComponent(MonsterItem);
            if (monster) {
                monster.deathAni(end);
            }
        }
    }

    public recycleMonster(index: number, node: Node) {
        if (this._monsterPools[index]) {
            this._monsterPools[index].putItem(node);
        }
    }

    private _bornSpeed: number = 1;
    private _bornTimeLimit: number = 1;
    private _bornTime: number = 0;
    protected update(dt: number): void {
        if (DataManager.Instance.isStartGame) {
            if (this._monsterPools.length > 0) {
                const currentMonsterCount = this.monsterParent.children.length;

                if (currentMonsterCount < DataManager.Instance.monsterNum) {
                    this._bornTime += dt;
                    if (this._bornTime > DataManager.Instance.bornTimeLimit) {
                        this._bornTime = 0;

                        // 可创建的数量不超过最大限制
                        const spawnCount = Math.min(this._bornSpeed, DataManager.Instance.monsterNum - currentMonsterCount);
                        for (let i = 0; i < spawnCount; i++) {
                            this.creatMonster(false);
                        }
                    }
                }
            }

            // rvo 更新逻辑坐标
            Simulator.instance.run(dt);

            for (let index = 0; index < this.monsterParent.children.length; index++) {
                const monster = this.monsterParent.children[index];
                monster?.getComponent(MonsterItem)?.moveByRvo(dt);
            }
            EventManager.inst.emit(EventNames.ArmyMoveByRVO, dt);
        }
    }

    public dropItem(pos: Vec3, end) {
        const node = this._dropPool.getItem();
        node['__isReady'] = false;
        node['__fallingTarget'] = false;
        this.coinConNode.addChild(node);
        node.eulerAngles = new Vec3(90, 0, 0);
        node.setWorldPosition(new Vec3(pos.x, pos.y + 0.5, pos.z));

        const startY = pos.y + 0.5;
        const peakY = startY + 3;      // 第一次跃起高度
        const bounceY = startY + 0.7;  // 回落后的弹跳高度
        const targetPos = new Vec3(pos.x, pos.y, pos.z - 3);

        const startRot = node.rotation.clone();
        const p0 = end //.worldPosition //.clone();// node.worldPosition.clone(); // 起点（此时在地面）
        const p2 = targetPos.clone();          // 终点
        // 控制点：取中点并抬高一些，形成明显弧线；你也可以把 2.5 调高/调低
        const p1 = new Vec3(
            (p0.x + p2.x) * 0.5,
            Math.max(p0.y, p2.y) + 15,
            (p0.z + p2.z) * 0.5
        );
        const totalSpinDeg = 720;
        const tmpQ = new Quat();

        this.startSelfRotate(node, 180);

        const param = { t: 0 };
        tween(param)
            .to(0.5, { t: 1 }, {
                easing: 'quadInOut',
                onUpdate: () => {
                    const t = param.t;
                    const u = 1 - t;
                    // 二次贝塞尔：B(t) = u^2 * p0 + 2*u*t * p1 + t^2 * p2
                    const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
                    const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
                    const z = u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z;
                    node.setWorldPosition(x, y, z);

                    // —— 同步做 360° 翻滚 —— 
                    // 1) 默认绕 X 轴翻滚；如需改轴：X翻滚(ang,0,0) / Y自转(0,ang,0) / Z滚动(0,0,ang)
                    const angle = totalSpinDeg * t;
                    Quat.fromEuler(tmpQ, angle, 0, 0); // 绕 X 轴
                    const curQ = new Quat();
                    Quat.multiply(curQ, startRot, tmpQ);
                    node.setRotation(curQ); // 局部旋转
                },
                // onComplete: () => {
                //     node['__isReady'] = true;
                //     node['__fallingTarget'] = true;
                //     this._coinsList.push(node);
                // }
            })
            .call(() => {
                // 先做一次“起落-回弹”的弹性效果
                tween(node)
                    .to(0.15, { position: new Vec3(targetPos.x, peakY, targetPos.z) }, { easing: 'quadOut' })  // 向上弹起
                    .to(0.15, { position: new Vec3(targetPos.x, startY, targetPos.z) }, { easing: 'quadIn' })  // 回落
                    .to(0.07, { position: new Vec3(targetPos.x, bounceY, targetPos.z) }, { easing: 'quadOut' })// 二次弹起
                    .to(0.07, { position: new Vec3(targetPos.x, startY, targetPos.z) }, { easing: 'quadIn' })  // 回到地面
                    .delay(0.5)
                    .call(() => {
                        // 弹跳结束后，沿二次贝塞尔弧线飞向 targetPos
                        node[`__isReady`] = true;
                        this._coinsList.push(node);
                    })
                    .start();
            })
            .start();

    }

    // public dropItem(pos: Vec3) {
    //     let node = this._dropPool.getItem();
    //     node[`__isReady`] = false;
    //     node[`__fallingTarget`] = false;
    //     this.coinConNode.addChild(node);
    //     node.setWorldPosition(pos);

    //     const targetPos = new Vec3(pos.x, pos.y, pos.z - 3);

    //     // 原始位置
    //     const startY = pos.y;
    //     const peakY = startY + 3;     // 第一次跃起高度
    //     const bounceY = startY + 0.7;   // 回落后的弹跳高度

    //     tween(node)
    //         .to(0.25, { position: new Vec3(pos.x, peakY, pos.z) }, { easing: 'quadOut' })   // 向上弹起
    //         .to(0.2, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })    // 回落
    //         .to(0.15, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
    //         .to(0.15, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
    //         .call(() => {
    //             node[`__isReady`] = true;
    //             this._coinsList.push(node);
    //         })
    //         .start();
    // }

    public getDrops() {
        let newList = this._coinsList.splice(0, Math.min(this._coinsList.length, 1));
        return newList;
    }

    public startSelfRotate(node: Node, speedDegPerSec = 60, axis: 'x' | 'y' | 'z' = 'y') {
        if (!node?.isValid) return;
        this.stopSelfRotate(node); // 避免重复叠加

        const dur = 10; // tween 动画时长
        const delta = speedDegPerSec * dur; // 总旋转角度
        const by = axis === 'x' ? new Vec3(delta, 0, 0)
            : axis === 'y' ? new Vec3(0, delta, 0)
                : new Vec3(0, 0, delta);

        const tw = tween(node)
            .repeatForever(tween(node).to(dur, { eulerAngles: by }))
            .start();

        (node as any)[SPIN_KEY] = tw;
    }


    public stopSelfRotate(node: Node) {
        const tw: Tween<Node> | undefined = (node as any)?.[SPIN_KEY];
        if (tw) {
            tw.stop();
            delete (node as any)[SPIN_KEY];
        }
    }

}


