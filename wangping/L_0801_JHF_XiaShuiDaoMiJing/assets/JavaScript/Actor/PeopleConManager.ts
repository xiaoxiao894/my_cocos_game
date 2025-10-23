import { _decorator, Animation, Component, instantiate, Label, Material, MeshRenderer, Node, Pool, SkinnedMeshRenderer, Sprite, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, PathEnum } from '../Enum/Index';
import { ItemPeople } from './ItemPeople';
import { PeopleEnum } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
const { ccclass, property } = _decorator;

@ccclass('PeopleConManager')
export class PeopleConManager extends Component {
    @property(Material)
    dungbeetle01Mtl: Material = null;

    @property(Material)
    dungbeetle02Mtl: Material = null;

    @property(Node)
    barbecueCon2: Node = null;

    @property(Node)
    coinCon: Node = null;

    @property(Node)
    tempPeopleConNode: Node = null;

    coinRowCount = 3;
    coinColCount = 4;

    private peoplePool: Pool<Node> | null = null;
    private peoplePool1: Pool<Node> | null = null;
    private bubbleItemMap: Map<Node, number> = new Map();
    private peopleCount: number = 10;

    startPoint = new Vec3(42, 0, 35);
    endPoint = new Vec3(-42, 0, 35);

    queuePosition = [
        new Vec3(6.5, 0, 35),
        new Vec3(14.5, 0, 35),
        new Vec3(22.5, 0, 35),
        new Vec3(30.5, 0, 35),
        new Vec3(38.5, 0, 35),
    ];

    private countMin = 1;
    private countMax = 4;
    maxBubbleCount: number = 3;
    private _isDelivering = false;
    private _currentPerson: Node | null = null;
    private _deliveryCooldown: number = 0.2;
    private _lastDeliveryTime: number = 0;
    private _activeFlyingItems: Set<Node> = new Set();
    private _deliveredCoinCount: number = 0;

    start() {
        DataManager.Instance.peopleConManager = this;
    }

    init() {
        this.peoplePool = new Pool(() => {
            const peoplePrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.People);
            const people = instantiate(peoplePrefab!);

            return people;
        }, this.peopleCount, (node: Node) => {
            node.removeFromParent();
        });

        this.peoplePool1 = new Pool(() => {
            const peoplePrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.People1);
            const people = instantiate(peoplePrefab!);

            return people;
        }, this.peopleCount, (node: Node) => {
            node.removeFromParent();
        });
    }

    private _lastMaterials: number[] = []; // 存储前两个使用的材质编号（0 或 1）

    create() {
        if (!this.peoplePool || !this.peoplePool1) return;
        // let node = this.peoplePool.alloc();

        // const minion1 = node.getChildByName("Minion");
        // const minion2 = minion1?.getChildByName("Minion");
        // const dungbeetleMaxNode = minion2?.getChildByName("dungbeetle.max");
        // const dungbeetle = dungbeetleMaxNode?.getChildByName("dungbeetle")
        // // const dungbeetle = dungbeetleMaxNode?.getChildByName("Partner");
        // // const jack = dungbeetle?.getChildByName("jack");
        // // const jack1 = jack.getChildByName("jack");

        // if (!dungbeetle) {
        //     // console.warn("未能找到 dungbeetle 节点");
        //     return node;
        // }

        // 生成不与前两个重复的材质编号
        let newMatIndex: number;
        do {
            newMatIndex = Math.random() > 0.5 ? 1 : 0;
        } while (
            this._lastMaterials.length >= 2 &&
            this._lastMaterials[0] === newMatIndex &&
            this._lastMaterials[1] === newMatIndex
        );

        // 更新材质记录
        this._lastMaterials.push(newMatIndex);
        if (this._lastMaterials.length > 2) {
            this._lastMaterials.shift(); // 保持最多两个记录
        }

        let node = null;
        if (newMatIndex) {
            node = this.peoplePool.alloc();
        } else {
            node = this.peoplePool1.alloc();
        }
        // const newMaterial = newMatIndex === 0 ? this.dungbeetle01Mtl : this.dungbeetle02Mtl;
        // this.replaceDungbeetleMaterials(dungbeetle, newMaterial);

        if (node.parent === null) node.setParent(this.node);
        node.active = true;
        return node;
    }


    onDestroy() {
        this.peoplePool.destroy();
    }

    onProjectileDead(node) {
        node.active = false;
        this.peoplePool.free(node);
    }

    // 替换材质函数
    replaceMaterial(targetNode: Node, newMaterial: Material) {
        if (!targetNode) return;

        const meshRenderer = targetNode.getComponent(SkinnedMeshRenderer);
        if (meshRenderer) {
            meshRenderer.setMaterial(newMaterial, 0);
        }
    }

    // 替换一组 dungbeetle LOD 材质
    replaceDungbeetleMaterials(dungbeetle: Node, newMaterial: Material) {
        const names = [
            "dungbeetle_01_LOD0",
            "dungbeetle_01_LOD1",
            "dungbeetle_01_LOD2",
            "dungbeetle_01_slg",
        ];

        for (const name of names) {
            const child = dungbeetle.getChildByName(name);
            this.replaceMaterial(child, newMaterial);
        }
    }

    update(dt: number) {
        if (!this.peoplePool) return;

        const children = this.node.children;
        const desiredCount = 5;

        if (children.length === 0) {
            for (let i = 0; i < desiredCount; i++) {
                const person = this.create();
                person.active = true;
                person.setPosition(this.queuePosition[i]);

                const manager = person.getComponent(ItemPeople);
                if (manager) {
                    manager.changState(PeopleEnum.Walk);
                    manager.changState(PeopleEnum.Idle);
                    manager.bubbleValue = MathUtil.getRandom(this.countMin, this.countMax);
                    this.bubbleItemMap.set(person, 0);
                }
            }
        }

        for (let i = 0; i < children.length; i++) {
            const person = children[i];
            const bubble = person.getChildByName("Bubble");
            if (bubble) bubble.active = (i === 0);

            const label = bubble?.getChildByName("Label");
            const labelCom = label?.getComponent(Label);
            const manager = person.getComponent(ItemPeople);

            if (labelCom && manager) {
                labelCom.string = `${manager.bubbleValue}`;
            }
        }

        if (!DataManager.Instance.hasPersonInPlot1) return;
        if (!this._isDelivering) {
            this.processDeliveryLogic(dt);
        }

        if (!this._isDelivering && this._activeFlyingItems.size === 0 && this._currentPerson) {
            const currentCount = this.bubbleItemMap.get(this._currentPerson) ?? 0;
            const required = this._currentPerson.getComponent(ItemPeople)?.bubbleValue ?? 999;

            if (currentCount >= required) {
                const person = this._currentPerson;
                const manager = person.getComponent(ItemPeople);
                if (manager) manager.changState(PeopleEnum.Walk);

                this._isDelivering = true;

                const bubble = person.getChildByName("Bubble");
                if (!bubble || !bubble.isValid || !bubble.activeInHierarchy) {
                    // console.warn("气泡不存在或未激活，无法作为金币起点");
                    return;
                }

                const startPos = bubble.getWorldPosition();

                const stackManager = this.coinCon["__stackManager"];
                if (!stackManager) {
                    // console.warn("coinCon 缺少 stackManager");
                    return;
                }

                for (let i = 0; i < required; i++) {
                    const coin = DataManager.Instance.coinManager.create();
                    if (!coin) continue;
                    coin.active = false;
                    coin[`__isReady`] = false;

                    const slot = stackManager.assignSlot(coin);
                    if (!slot) {
                        // console.warn("金币堆叠槽位已满");
                        continue;
                    }

                    const endPos = stackManager.getSlotWorldPos(slot, this.coinCon);
                    const control = startPos.clone().lerp(endPos, 0.5).add3f(0, 15, 0);
                    const t = { value: 0 };

                    setTimeout(() => {
                        this._activeFlyingItems.add(coin);
                        this.coinCon.addChild(coin);

                        tween(t)
                            .to(0.4, { value: 1 }, {
                                onUpdate: () => {
                                    coin.active = true;
                                    const oneMinusT = 1 - t.value;
                                    const pos = new Vec3(
                                        oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t.value * control.x + t.value * t.value * endPos.x,
                                        oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t.value * control.y + t.value * t.value * endPos.y,
                                        oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t.value * control.z + t.value * t.value * endPos.z
                                    );
                                    coin.setWorldPosition(pos);
                                },
                                onComplete: () => {
                                    coin.setWorldPosition(endPos);
                                    const localPos = new Vec3();
                                    this.coinCon.inverseTransformPoint(localPos, endPos);
                                    coin.setPosition(localPos);
                                    this._activeFlyingItems.delete(coin);

                                    DataManager.Instance.soundManager.coinPutSound();
                                }
                            })
                            .call(() => {
                                coin[`__isReady`] = true;
                            })
                            .start();
                    }, i * this._deliveryCooldown * 700);
                }

                this._deliveredCoinCount += required;

                const hideList = ["Right", "Label", "Base01", "DuckIcon"];
                hideList.forEach(name => {
                    const child = bubble.getChildByName(name);
                    if (child) child.active = false;
                    if (child.name === "Right") child.active = true;
                });

                setTimeout(() => {
                    this.tempPeopleConNode.addChild(person);
                    this.bubbleItemMap.delete(person);
                    this._isDelivering = false;
                    this._currentPerson = null;
                }, 1000);

                tween(person)
                    .call(() => {
                        this.scheduleOnce(() => {
                            this.reorderQueue();
                        }, 0.5)
                    })
                    .to(2.5, { position: this.endPoint })
                    .call(() => {
                        person.removeFromParent();
                    })
                    .start();
            }
        }
    }

    reorderQueue() {
        const children = [...this.node.children].filter(p => p !== this._currentPerson);

        for (let i = 0; i < children.length; i++) {
            const person = children[i];
            const manager = person.getComponent(ItemPeople);
            tween(person)
                .stop()
                .call(() => {
                    manager?.changState(PeopleEnum.Walk);
                })
                .to(0.3, { position: this.queuePosition[i] })
                .call(() => {
                    manager?.changState(PeopleEnum.Idle);
                })
                .start();
        }

        const newPerson = this.create();
        const bubble = newPerson.getChildByName("Bubble");
        if (bubble) bubble.active = false;
        newPerson.active = true;
        newPerson.setPosition(this.startPoint);

        // DataManager.Instance.soundManager.summonSoldiersSound();
        // const level = newPerson.getChildByName("TX_shengjiLZ");
        // level.active = true;
        // const levelAni = level.getComponent(Animation);
        // if (levelAni) {
        //     levelAni.play("TX_shengjiLZ");
        // }

        const manager = newPerson.getComponent(ItemPeople);
        if (manager) {
            manager.changState(PeopleEnum.Walk);
            manager.bubbleValue = MathUtil.getRandom(this.countMin, this.countMax);
            this.bubbleItemMap.set(newPerson, 0);
        }

        const targetPos = this.queuePosition[this.queuePosition.length - 1];
        tween(newPerson)
            .to(0.8, { position: targetPos })
            .call(() => {
                manager?.changState(PeopleEnum.Idle);
            })
            .start();
    }

    processDeliveryLogic(dt: number) {
        const children = this.node.children;
        if (children.length === 0 || !this.barbecueCon2 || this.barbecueCon2.children.length === 0) return;

        const person = children[0];
        if (!this._currentPerson) {
            this._currentPerson = person;
        } else if (this._currentPerson !== person) {
            return;
        }

        const bubble = person.getChildByName("Bubble");
        if (!bubble) return;

        const manager = person.getComponent(ItemPeople);
        if (!manager) return;

        const labelValue = manager.bubbleValue;
        let currentCount = this.bubbleItemMap.get(person) ?? 0;

        if (currentCount >= labelValue) return;

        const now = performance.now() / 1000;
        if (now - this._lastDeliveryTime < this._deliveryCooldown) return;
        this._lastDeliveryTime = now;

        currentCount += 1;
        this.bubbleItemMap.set(person, currentCount);

        const item = this.barbecueCon2.children[this.barbecueCon2.children.length - 1];
        if (!item?.isValid) return;

        const itemWorldPos = item.getWorldPosition();
        item.removeFromParent();
        this.node.addChild(item);
        item.setWorldPosition(itemWorldPos);

        const endPos = bubble.getWorldPosition();
        const control = itemWorldPos.clone().lerp(endPos, 0.5).add3f(0, 15, 0);

        let t = { value: 0 };
        this._activeFlyingItems.add(item);

        tween(t)
            .to(0.1, { value: 1 }, {
                onUpdate: () => {
                    const oneMinusT = 1 - t.value;
                    const pos = new Vec3(
                        oneMinusT * oneMinusT * itemWorldPos.x + 2 * oneMinusT * t.value * control.x + t.value * t.value * endPos.x,
                        oneMinusT * oneMinusT * itemWorldPos.y + 2 * oneMinusT * t.value * control.y + t.value * t.value * endPos.y,
                        oneMinusT * oneMinusT * itemWorldPos.z + 2 * oneMinusT * t.value * control.z + t.value * t.value * endPos.z
                    );
                    item.setWorldPosition(pos);
                },
                onComplete: () => {
                    const base1 = bubble.getChildByName("Base01");
                    if (base1) {
                        const base1Sprite = base1.getComponent(Sprite);
                        if (base1Sprite) {
                            base1Sprite.fillRange = currentCount / labelValue;
                        }
                    }

                    // 收集音效
                    DataManager.Instance.soundManager.grassDeliverSoundPlay();

                }
            })
            .call(() => {
                item.removeFromParent();
                const current = this.bubbleItemMap.get(person) ?? 0;
                const max = manager.bubbleValue;
                if (current > max) {
                    this.bubbleItemMap.set(person, max);
                }
                this._activeFlyingItems.delete(item);
            })
            .start();
    }
}