import { _decorator, Animation, Component, instantiate, Label, Material, MeshRenderer, Node, Pool, Quat, SkinnedMeshRenderer, Sprite, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, PathEnum, TypeItemEnum } from '../Enum/Index';
import { ItemPeople } from './ItemPeople';
import { PeopleEnum } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { SimplePoolManager } from '../Util/SimplePoolManager';
import { StackManager } from '../StackSlot/StackManager';
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

    // 人物路径
    startPoint = new Vec3(-2, 0, 53.5);
    turnPoint = new Vec3(-5.266, 0, 28.42)
    endPoint = new Vec3(-5.266, 0, 65.274);

    queuePosition = [
        new Vec3(-2, 0, 28.5),
        new Vec3(-2, 0, 33.5),
        new Vec3(-2, 0, 38.5),
        new Vec3(-2, 0, 43.5),
        new Vec3(-2, 0, 48.5),
    ];

    private countMin = 1;
    private countMax = 4;
    maxBubbleCount: number = 3;
    private _isDelivering = false;
    private _currentPerson: Node | null = null;
    private _deliveryCooldown: number = 0.1;
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

        // if (!DataManager.Instance.hasPersonInPlot1) return;
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
                    return;
                }

                let startPos = bubble.getWorldPosition();

                const stackManager = this.coinCon["__stackManager"];
                if (!stackManager) {
                    return;
                }

                const number = required * (DataManager.Instance.sceneManager.coinYieldMultiplier || 2);

                for (let i = 0; i < number; i++) {
                    const coin = SimplePoolManager.Instance.alloc<Node>(TypeItemEnum.GoldCoin);
                    if (!coin || !coin.isValid) continue;

                    coin.active = false;
                    (coin as any).__isReady = false;
                    (coin as any).__isFlying = false;
                    (coin as any).__flyTw = null;

                    const slot = this.coinCon["__stackManager"]?.assignSlot(coin);
                    if (!slot) {
                        // SimplePoolManager.Instance.free?.(TypeItemEnum.GoldCoin, coin);
                        continue;
                    }

                    const stackManager = this.coinCon["__stackManager"];
                    startPos = startPos ?? bubble.getWorldPosition();
                    let curSlot = slot;
                    let curIndex = stackManager.indexOfSlot(curSlot);

                    const delaySec = i * this._deliveryCooldown * 0.7 / 1000;

                    this.scheduleOnce(() => {
                        // 发射开始
                        if (!coin.isValid) return;
                        this._activeFlyingItems.add(coin);
                        this.coinCon.addChild(coin);

                        const t = { value: 0 };

                        (coin as any).__isFlying = true;

                        const tw = tween(t)
                            .to(0.4, { value: 1 }, {
                                easing: 'cubicOut',
                                onUpdate: () => {
                                    coin.active = true;
                                    const oneMinusT = 1 - t.value;

                                    // —— 降档补洞：若存在更靠前空槽则移动占用（按需，API 存在才执行）——
                                    if (typeof stackManager.findLowestVacantBefore === 'function' &&
                                        typeof stackManager.moveAssignment === 'function') {
                                        const betterIndex = stackManager.findLowestVacantBefore(curIndex);
                                        if (betterIndex >= 0) {
                                            const moved = stackManager.moveAssignment(coin, curIndex, betterIndex);
                                            if (moved) {
                                                curIndex = betterIndex;
                                                const s = stackManager.getSlotByIndex(curIndex);
                                                if (s) curSlot = s;
                                            }
                                        }
                                    }

                                    // 实时读取“当前槽位”的世界坐标作为终点（父节点/布局变化也能跟上）
                                    const endPosNow: Vec3 = stackManager.getSlotWorldPos(curSlot, this.coinCon);

                                    // 控制点：中点抬高（随距离略调整，手感更自然）
                                    const lift = Math.max(12, Vec3.distance(startPos, endPosNow) * 0.15);
                                    const ctrlX = (startPos.x + endPosNow.x) * 0.5;
                                    const ctrlY = (startPos.y + endPosNow.y) * 0.5 + lift;
                                    const ctrlZ = (startPos.z + endPosNow.z) * 0.5;

                                    // 二次贝塞尔
                                    const pos = new Vec3(
                                        oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t.value * ctrlX + t.value * t.value * endPosNow.x,
                                        oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t.value * ctrlY + t.value * t.value * endPosNow.y,
                                        oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t.value * ctrlZ + t.value * t.value * endPosNow.z
                                    );
                                    coin.setWorldPosition(pos);
                                },
                                onComplete: () => {
                                    // 终点对齐：以“当前槽位”的最新世界坐标为准
                                    const endPosNow: Vec3 = stackManager.getSlotWorldPos(curSlot, this.coinCon);
                                    coin.setWorldPosition(endPosNow);

                                    // 不需要再做 inverseTransformPoint → setPosition 的二次转换
                                    // （已经是 coinCon 的子节点，直接 world 对齐即可）

                                    // 小弹跳（可选）
                                    tween(coin)
                                        .to(0.12, { scale: new Vec3(1.15, 1.15, 1.15) }, { easing: 'quadOut' })
                                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                                        .start();

                                    (coin as any).__isFlying = false;
                                    (coin as any).__isReady = true;
                                    (coin as any).__flyTw = null;

                                    this._activeFlyingItems.delete(coin);
                                    // DataManager.Instance.soundManager.coinPutSound?.();
                                }
                            })
                            .start();

                        (coin as any).__flyTw = tw;
                    }, delaySec);
                }

                // for (let i = 0; i < 150; i++) {
                // const number = required * (DataManager.Instance.sceneManager.coinYieldMultiplier || 2);
                // for (let i = 0; i < number; i++) {
                //     const coin = SimplePoolManager.Instance.alloc<Node>(TypeItemEnum.GoldCoin);
                //     if (!coin) continue;
                //     coin.active = false;
                //     coin[`__isReady`] = false;
                //     const slot = stackManager.assignSlot(coin);
                //     if (!slot) {
                //         // console.warn("金币堆叠槽位已满");
                //         continue;
                //     }

                //     const endPos = stackManager.getSlotWorldPos(slot, this.coinCon);
                //     const control = startPos.clone().lerp(endPos, 0.5).add3f(0, 15, 0);
                //     const t = { value: 0 };

                //     this.scheduleOnce(() => {
                //         this._activeFlyingItems.add(coin);
                //         this.coinCon.addChild(coin);

                //         tween(t)
                //             .to(0.4, { value: 1 }, {
                //                 onUpdate: () => {
                //                     coin.active = true;
                //                     const oneMinusT = 1 - t.value;
                //                     const pos = new Vec3(
                //                         oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t.value * control.x + t.value * t.value * endPos.x,
                //                         oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t.value * control.y + t.value * t.value * endPos.y,
                //                         oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t.value * control.z + t.value * t.value * endPos.z
                //                     );
                //                     coin.setWorldPosition(pos);
                //                 },
                //                 onComplete: () => {
                //                     coin.setWorldPosition(endPos);
                //                     const localPos = new Vec3();
                //                     this.coinCon.inverseTransformPoint(localPos, endPos);
                //                     coin.setPosition(localPos);
                //                     this._activeFlyingItems.delete(coin);

                //                     // DataManager.Instance.soundManager.coinPutSound();
                //                 }
                //             })
                //             .call(() => {
                //                 coin[`__isReady`] = true;
                //             })
                //             .start();
                //     }, i * this._deliveryCooldown * 700 / 1000)
                //     // setTimeout(() => {

                //     // }, i * this._deliveryCooldown * 700);
                // }

                this._deliveredCoinCount += required;

                const hideList = ["Right", "Label", "Base01", "DuckIcon"];
                hideList.forEach(name => {
                    const child = bubble.getChildByName(name);
                    if (child) child.active = false;
                    if (child.name === "Right") child.active = true;
                });

                this.scheduleOnce(() => {
                    this.tempPeopleConNode.addChild(person);
                    this.bubbleItemMap.delete(person);
                    this._isDelivering = false;
                    this._currentPerson = null;
                }, 1000 / 1000)
                // setTimeout(() => {

                // }, 1000);

                tween(person)
                    .call(() => {
                        this.scheduleOnce(() => {
                            this.reorderQueue();
                        }, 0.5)
                        this._lookAtTarget(person, this.turnPoint)
                    })
                    .to(0.2, { position: this.turnPoint })
                    .call(() => {
                        this._lookAtTarget(person, this.endPoint)
                    })
                    .to(2, { position: this.endPoint })
                    .call(() => {
                        person.removeFromParent();
                        person.destroy();
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

        let item = null;//this.barbecueCon2.children[this.barbecueCon2.children.length - 1];
        // if (!item?.isValid) return;

        const fromStackManager: StackManager = this.barbecueCon2["__stackManager"];
        if (!fromStackManager) {
            console.warn("from 没有 stackManager，无法取出");
            return;
        }

        const slots = fromStackManager.getAllOccupiedSlots?.() ?? [];
        for (let i = slots.length - 1; i >= 0; i--) {
            const slot = slots[i];
            const node = slot.assignedNode;
            if (node && node.isValid && node['__isReady'] == true) {
                item = node;
                fromStackManager.releaseSlot(node);
                break;
            }
        }

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
                    // DataManager.Instance.soundManager.grassDeliverSoundPlay();
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

    // 看向目标位置
    private _lookAtTarget(node: Node, targetPos: Vec3) {
        if (!node) return;

        const minion = node?.getChildByName("Minion").getChildByName("Minion");
        if (!minion) return;

        const pos = node.worldPosition;
        const forward = new Vec3();
        Vec3.subtract(forward, targetPos, pos)
        forward.y = 0;
        forward.normalize();

        const rotation = new Quat();
        Quat.fromViewUp(rotation, forward, Vec3.UP);

        minion.setWorldRotation(rotation);
    }

    // 重置伙伴容器
    // 放到 PeopleConManager 内
    public resetPeopleCon() {
        // 1) 防抖 & 状态复位
        this._isDelivering = false;
        this._currentPerson = null;
        this._deliveredCoinCount = 0;
        this._lastDeliveryTime = 0;
        this.bubbleItemMap.clear();

        // 2) 停止本管理器与子节点的所有 tween
        const stopTweensDeep = (root: Node | null) => {
            if (!root?.isValid) return;
            // 停止该节点上的所有 tween
            // 注意：Tween 是全局管理的，停止时按 target 节点来停
            // @ts-ignore
            cc.Tween.stopAllByTarget(root);
            for (const child of root.children) stopTweensDeep(child);
        };
        stopTweensDeep(this.node);
        stopTweensDeep(this.coinCon);
        stopTweensDeep(this.tempPeopleConNode);

        // 3) 处理正在飞行的道具（如肉/金币/食材等）
        if (this._activeFlyingItems && this._activeFlyingItems.size > 0) {
            for (const item of this._activeFlyingItems) {
                if (!item?.isValid) continue;
                // 停止该 item 的 tween，移除并销毁
                // @ts-ignore
                cc.Tween.stopAllByTarget(item);
                item.removeFromParent();
                item.destroy();
            }
            this._activeFlyingItems.clear();
        }

        // 4) 清空金币容器（coinCon）里的子节点，并重置其 StackManager（若有）
        if (this.coinCon?.isValid) {
            // 停掉 coinCon 上所有 tween 已在步骤2完成
            // 删除金币节点
            const coinChildren = [...this.coinCon.children];
            for (const coin of coinChildren) {
                if (!coin?.isValid) continue;
                coin.removeFromParent();
                coin.destroy();
            }
            // // 可选：清空堆叠管理（如果存在）
            const stackManager = (this.coinCon as any)['__stackManager'] as StackManager | undefined;
            if (stackManager?.clear) {
                stackManager.clear();
            }
        }

        // 5) 清空当前排队人物（统一销毁，避免误归还到错误的对象池）
        const peopleChildren = [...this.node.children];
        for (const person of peopleChildren) {
            if (!person?.isValid) continue;
            // 停掉 tween 已在步骤2完成
            person.removeFromParent();
            person.destroy();
        }

        // 6) 清空临时人物容器
        if (this.tempPeopleConNode?.isValid) {
            const tempChildren = [...this.tempPeopleConNode.children];
            for (const p of tempChildren) {
                if (!p?.isValid) continue;
                p.removeFromParent();
                p.destroy();
            }
        }

        // 7) 取消本组件内通过 scheduleOnce/schedule 的回调（不影响 setTimeout）
        this.unscheduleAllCallbacks();

        // （可选）如果你后续想立即重建初始队列，可在这里调用一个初始化入口：
        // this._rebuildQueue(); // 自己实现，例如复用 update 里的人物创建逻辑
    }

}