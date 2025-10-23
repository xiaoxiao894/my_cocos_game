import { _decorator, Animation, Button, Component, director, EventHandler, instantiate, Label, Node, Prefab, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { CollisionEntityEnum, EntityTypeEnum } from '../Enum/Index';
import { MathUtil } from '../Util/MathUtil';
import { ItemAreaManager } from '../Area/ItemAreaManager';
import { PartnerManager } from '../Actor/PartnerManager';
import { Actor } from '../Actor/Actor';
import { StateDefine } from '../Actor/StateDefine';
import { LanguageManager } from '../Language/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('CardConManager')
export class CardConManager extends Component {
    @property(Node)
    maskBg: Node = null;

    @property(Prefab)
    bornEffect: Prefab = null;

    otherNode = null;

    opacity = null;

    private _isCreatingCards = false;
    private isUnlockDeliveryAreas6 = true;
    private maskBgOpacity = null;
    start() {
        DataManager.Instance.cardConManager = this;

        this.opacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);

        this.maskBgOpacity = this.maskBg.getComponent(UIOpacity) || this.maskBg.addComponent(UIOpacity);
        this.maskBg.active = false;
    }

    // 生成两张卡片
    createCards(otherNode) {
        if (this._isCreatingCards) return;
        this._isCreatingCards = true;

        if (this.node.children.length > 0) this.node.removeAllChildren();

        const actor = DataManager.Instance.player.node.getComponent(Actor);
        actor.changState(StateDefine.Idle);
        actor.stopMove();
        DataManager.Instance.isDeactivateVirtualJoystick = true;
        this.node.active = true;
        this.otherNode = otherNode;

        // 显示并渐显遮罩背景
        this.maskBg.active = true;
        this.maskBgOpacity.opacity = 0;
        tween(this.maskBgOpacity)
            .to(1, { opacity: 120 }, { easing: 'quadOut' })
            .start();

        const results = MathUtil.staticgetTwoDistinctRandom(DataManager.Instance.cardDatas);
        if (!results) return;

        results.forEach((cardData, index) => {
            this.scheduleOnce(() => {
                const cardPrefab = DataManager.Instance.prefabMap.get(cardData.card);
                if (!cardPrefab) {
                    console.warn('未找到卡片预制体:', cardData.card);
                    return;
                }

                const cardNode = instantiate(cardPrefab);
                cardNode.setParent(this.node);

                // 设置位置（左右分布）
                cardNode.setPosition(index === 0 ? -140 : 140, 0, 0);

                // 添加点击事件
                this.addCardClickEvent(cardNode, cardData);

                const card = cardNode.children[0];
                const labelCom = card.getChildByName("Label").getComponent(Label);
                if (labelCom?.string == "Stagbeetle") {
                    const text = LanguageManager.t('Stagbeetle');
                    if (text) {
                        labelCom.string = text;
                    }
                } else if (labelCom?.string == "Beetle") {
                    const text = LanguageManager.t('Beetle');
                    if (text) {
                        labelCom.string = text;
                    }
                } else if (labelCom?.string == "Beetlewarrior") {
                    const text = LanguageManager.t('Beetlewarrior');
                    if (text) {
                        labelCom.string = text;
                    }
                }
                const ani = card.getComponent(Animation);
                if (ani) {
                    ani.play("cardCS");
                }
                const effect = card.getChildByName("Effect");
                if (effect) {
                    const sprite = effect.getChildByName("Sprite");

                    if (sprite) {
                        const spriteAni = sprite.getComponent(Animation);
                        if (spriteAni) {
                            spriteAni.play("Effect");
                            spriteAni.once(Animation.EventType.FINISHED, () => {
                                sprite.active = false;
                            });
                        }
                    }
                }

                DataManager.Instance.soundManager?.CardEjectSoundPlay();
            }, index * 0.5)
        });
    }

    addCardClickEvent(node: Node, cardData: any) {
        const button = node.getComponent(Button) || node.addComponent(Button);

        const handler = new EventHandler();
        handler.target = this.node;
        handler.component = "CardConManager";
        handler.handler = 'onCardClick';
        handler.customEventData = JSON.stringify(cardData);

        button.clickEvents = [handler];
    }

    // 点击处理函数
    onCardClick(event: Event, customData) {
        customData = JSON.parse(customData);
        // const cardIndex = DataManager.Instance.cardDatas.findIndex(item => {
        //     return item.card == customData.card;
        // })

        const target = event.target;
        target[`__isClick`] = true;

        // if (cardIndex < 0) return;

        // DataManager.Instance.cardDatas.splice(cardIndex, 1);

        for (let i = 0; i < this.node.children.length; i++) {
            const cardCon = this.node.children[i];
            const card = cardCon.children[0];
            const ani = card.getComponent(Animation);
            if (ani) {
                if (cardCon[`__isClick`]) {
                    ani.play("cardXS")
                } else {
                    ani.play("cardXS02")
                }
            }
        }

        DataManager.Instance.soundManager.ClickCardSoundPlay();

        this.scheduleOnce(() => {
            this.addPartner(customData.partner)
            this._isCreatingCards = false;
        }, 1)
    }

    // 添加伙伴
    addPartner(name: EntityTypeEnum) {
        this.node.active = false;

        tween(this.maskBgOpacity)
            .to(1, { opacity: 0 }, { easing: 'quadIn' })
            .call(() => {
                this.maskBg.active = false;
            })
            .start();

        const prefab = DataManager.Instance.prefabMap.get(name);
        const partner = instantiate(prefab);
        const partnerManager = partner.getComponent(PartnerManager) || partner.addComponent(PartnerManager);
        partnerManager.init();
        partner.setParent(this.otherNode);

        const worldPos = partner.worldPosition;
        const effectPrafab = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_shengjiLZ);
        const skillExplosion = instantiate(effectPrafab);
        director.getScene().addChild(skillExplosion);
        skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y + 1.5, worldPos.z));

        const anim = skillExplosion?.getComponent(Animation);
        if (anim) {
            anim.play(`TX_shengjiLZ`);
            anim.once(Animation.EventType.FINISHED, () => {
                skillExplosion.destroy();
            });
        } else {
            // 没动画时，延迟回收
            this.scheduleOnce(() => {
                skillExplosion.destroy();
            }, 1);
        }

        // 解锁地块6
        if (this.isUnlockDeliveryAreas6) {
            this.isUnlockDeliveryAreas6 = false;

            const deliveryAreas6 = this.otherNode.parent.getChildByName(CollisionEntityEnum.DeliveryAreas6);
            if (deliveryAreas6) {
                const itemAreaManager = deliveryAreas6.getComponent(ItemAreaManager);
                itemAreaManager?.displayAni();
            }
        }

        if (this.node.children.length > 0) this.node.removeAllChildren();

        DataManager.Instance.isDeactivateVirtualJoystick = false;
        DataManager.Instance.soundManager.CreatePartnerSoundPlay();
    }
}