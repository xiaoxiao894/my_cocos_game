import { _decorator, Component, instantiate, Mat4, Node, Prefab, tween, Vec3 } from 'cc';
import ItemPool from "../Common/ItemPool";
import { EntityTypeEnum, EventNames, HeroEnum } from "../Enum/Index";
import { DataManager } from '../Global/DataManager';
import { MoneyItem } from '../Common/DataTypes';
import { EventManager } from '../Global/EventManager';
import { MathUtil } from '../Utils/MathUtil';
import { MonsterItem } from './Items/MonsterItem';
const { ccclass, property } = _decorator;

@ccclass('MoneyManeger')
export class MoneyManeger extends Component {

    @property(Node)
    moneyParent: Node = null;

    @property(Node)
    monsterParent: Node = null;

    @property(Node)
    batmanParent: Node = null;

    @property(Node)
    womanParent: Node = null;

    private _moneyInitNum: number = 200; //初始钱数

    private _moneyNum: number = 0;
    private _moneyPool: ItemPool;

    //钱的尺寸
    private _moneyWidth: number = 1.5;
    private _moneyLength: number = 2.7;
    private _moneyHeight: number = 0;

    //钱池个数
    private _moneyLengthNum: number = 4;
    private _moneyWidthNum: number = 5;

    //漫威英雄大战小绿怪

    //小绿怪间隔时间
    private _monsterTimer: number = 1.5;
    private _monsterTime: number = 0;

    private _monsterPool: ItemPool = null;

    private _givingMoney: number = 0;

    private _monsterPos: Vec3 = null;

    private _moneyLackPos: Vec3[] = [];

    private _maxMoney: Vec3;

    //出生位置
    private _startPos: Vec3 = new Vec3(-20, 0, -20);
    //终点位置
    private _endPos: Vec3 = new Vec3(-15.223, 0, 7.568);

    private _startPos1: Vec3 = new Vec3(-17, 0, -14)
    private _endPos1: Vec3 = new Vec3(-10.874, 0, 7.641)

    protected start(): void {
        DataManager.Instance.MoneyManeger = this;
    }

    protected onEnable(): void {
        EventManager.inst.on(EventNames.MonsterGiveMoney, this.onMonsterDead, this);
        EventManager.inst.on(EventNames.CreatMonster, this.creatMonsterByType, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventNames.MonsterGiveMoney, this.onMonsterDead, this);
        EventManager.inst.off(EventNames.CreatMonster, this.creatMonsterByType, this);
    }

    public init(): void {

        this._moneyNum = 0;

        this._moneyHeight = DataManager.Instance.MoneyHeight; //获取钱的高度
        this._moneyPool = new ItemPool(EntityTypeEnum.Money, 100);
        //初始钱堆
        for (let i = 0; i < this._moneyInitNum; i++) {
            this.addMoney();
        }

        //英雄和怪
        let batmanPrefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Batman);
        let batmanNode: Node = instantiate(batmanPrefab);
        this.batmanParent.addChild(batmanNode);

        let womanPrefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Woman);
        let womanNode: Node = instantiate(womanPrefab);
        this.womanParent.addChild(womanNode);

        this._monsterPool = new ItemPool(EntityTypeEnum.Monster, 1);
        this.creatMonster(1, HeroEnum.Batman);
        this.creatMonster(2, HeroEnum.Batman);
        this.creatMonster(3, HeroEnum.Batman);

        this.creatMonster(1, HeroEnum.WonderWoman);
        this.creatMonster(2, HeroEnum.WonderWoman);
        this.creatMonster(3, HeroEnum.WonderWoman);
    }

    private addMoney(worldPos?: Vec3): void {
        let moneyItem: Node = this._moneyPool.getItem();

        moneyItem.setParent(this.moneyParent);

        if (worldPos) {
            moneyItem.setWorldPosition(worldPos);
        } else {
            let pos = this.getNextPosWithLength();

            moneyItem.setPosition(pos);
        }

        if (!this._maxMoney) {
            this._maxMoney = moneyItem.getPosition().clone();
        } else {
            if (this.isPositionGreater(moneyItem.getWorldPosition(), this._maxMoney)) {
                this._maxMoney = moneyItem.getWorldPosition().clone();
            }
        }
        this._moneyNum++;
    }

    private isPositionGreater(pos1: Vec3, pos2: Vec3): boolean {
        if (pos1.y > pos2.y) return true;
        if (pos1.y < pos2.y) return false;

        // y 相等时比较 x
        if (pos1.x > pos2.x) return true;
        if (pos1.x < pos2.x) return false;

        // x 和 y 相等时比较 z
        return pos1.z > pos2.z;
    }

    private getNextPosWithLength(addNum:number = 0): Vec3 {
        let count:number = addNum+this._moneyNum;
        let pos = new Vec3(0, 0, 0);
        //本层数量
        let nowLayerNumber = count % (this._moneyLengthNum * this._moneyWidthNum);
        pos.y = Math.floor(count / (this._moneyLengthNum * this._moneyWidthNum)) * this._moneyHeight; //钱的高度
        pos.z = nowLayerNumber % this._moneyWidthNum * this._moneyWidth + this._moneyWidth / 2; //钱的宽度
        pos.x = Math.floor(nowLayerNumber / this._moneyWidthNum) * this._moneyLength + this._moneyLength / 2; //钱的长度
        return pos;
    }

    private removeMoney(): Vec3 {
        if (this._moneyNum > 0) {
            this.moneyParent.children.sort((a: Node, b: Node) => {
                // 1. 优先比较 y，大的在后
                if (a.position.y !== b.position.y) {
                    return a.position.y - b.position.y; // 升序（y小的在前）
                }

                // 2. y 相等时，比较 x，大的在后
                if (a.position.x !== b.position.x) {
                    return a.position.x - b.position.x; // 升序（x小的在前）
                }

                // 3. x 和 y 都相等时，比较 z，大的在后
                return a.position.z - b.position.z; // 升序（z小的在前）
            });
            let moneyItem: Node = this.moneyParent.children[this.moneyParent.children.length - 1];
            this._moneyNum--;
            if (moneyItem) {
                let pos = moneyItem.worldPosition.clone();
                this._moneyPool.putItem(moneyItem);
                this.updateMoneyLack(pos);
                return pos;
            } else {
                return this.removeMoney();
            }

        } else {
            return null;
        }
    }

    private updateMoneyLack(pos: Vec3) {
        //如果当前没有这个坐标再加入
        if (this._moneyLackPos.includes(pos)) {
            return;
        }
        this._moneyLackPos.push(pos);
        this._moneyLackPos.sort((a, b) => {
            // 1. 优先比较 y，大的在后
            if (a.y !== b.y) {
                return a.y - b.y; // 升序（y小的在前）
            }

            // 2. y 相等时，比较 x，大的在后
            if (a.x !== b.x) {
                return a.x - b.x; // 升序（x小的在前）
            }

            // 3. x 和 y 都相等时，比较 z，大的在后
            return a.z - b.z; // 升序（z小的在前）
        });

        for (let i = 0; i < this._moneyLackPos.length; i++) {
            let item = this._moneyLackPos[i];
            if (this.isPositionGreater(item, this._maxMoney)) {
                this._moneyLackPos.splice(i, this._moneyLackPos.length - i);
                break;
            }
        }

    }

    public playerGetMoney(): MoneyItem | null {
        let worldPos = this.removeMoney();
        if (worldPos == null) {
            return null;
        } else {
            return {
                pos: worldPos,
                money: this._moneyPool.getItem()
            };
        }
    }

    public recycleMoney(money: Node): void {
        this._moneyPool.putItem(money);
    }

    private _playingAniNum: number = 0;

    //加钱
    giveMoney(node): void {
        this._givingMoney--;
        let moneyItem: Node = this.moneyParent.children[this.moneyParent.children.length - 1];
        let targetPos = this.getNextMoneyPos(this._playingAniNum);
        let pos: Vec3 = node.getWorldPosition().clone();  //this._monsterPos.clone();
        //播动画
        const centerPosX = (pos.x + targetPos.x) / 2;
        const centerPosY = 25;
        const centerPosZ = (pos.z + targetPos.z) / 2;
        const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ)
        let money: Node = this._moneyPool.getItem();
        money.setParent(DataManager.Instance.HomeMap.effectNode); //设置父节点
        this._playingAniNum++;
        tween(money)
            .to(0.45, { position: targetPos }, {
                easing: `cubicInOut`,
                onUpdate: (target, ratio) => {
                    const targetNode = target as Node;
                    const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio)

                    targetNode.worldPosition = position;
                }
            })
            .call(() => {
                this._playingAniNum--;
                this.recycleMoney(money);
                this.addMoney(targetPos);
            })
            .start();
    }

    private getNextMoneyPos(aniNum:number): Vec3 {
        if (this._moneyLackPos.length > 0) {
            return this._moneyLackPos.shift();
        } else {
            let targetPos = this.getNextPosWithLength(aniNum);
            let worldPos = new Vec3();
            const worldMatrix = new Mat4();
            this.moneyParent.getWorldMatrix(worldMatrix);

            // 将本地坐标转换为世界坐标
            Vec3.transformMat4(worldPos, targetPos, worldMatrix);

            return worldPos;
        }
    }

    private creatMonster(num: number = 0, hero) {
        if (!this._monsterPool) {
            return;
        }
        let node: Node = this._monsterPool.getItem();
        let monster: MonsterItem = node.getComponent(MonsterItem);
        if (monster) {
            if (num === 1) {
                if (hero == HeroEnum.Batman) {
                    monster.firstMonsterInit(this._startPos, this._endPos, hero);
                } else {
                    monster.firstMonsterInit(this._startPos1, this._endPos1, hero);
                }
            } else {
                if (hero == HeroEnum.Batman) {
                    monster.init(num, this._startPos, this._endPos, hero);
                } else {
                    monster.init(num, this._startPos1, this._endPos1, hero)
                }
            }

            this.monsterParent.addChild(node);
        }
    }

    private onMonsterDead(node: Node) {
        if (!this._monsterPos) {
            this._monsterPos = node.getWorldPosition().clone();
        }
        //this.recycleMonster(node);
        //给个钱
        this._givingMoney += 1;

    }

    public recycleMonster(node: Node) {
        this._monsterPool.putItem(node);
    }

    public creatMonsterByType(type:HeroEnum){
        this.creatMonster(0, type);
    }


    // protected update(dt: number): void {
    //     this._monsterTime += dt;
    //     if (this._monsterTime >= this._monsterTimer) {
    //         this._monsterTime = 0;
    //         this.creatMonster(0, HeroEnum.Batman);
    //         this.scheduleOnce(() => {
    //             this.creatMonster(0, HeroEnum.WonderWoman);
    //         }, 0.33)
    //     }

    //     // if (this._givingMoney > 0) {
    //     //     this.giveMoney();
    //     // }
    // }
}