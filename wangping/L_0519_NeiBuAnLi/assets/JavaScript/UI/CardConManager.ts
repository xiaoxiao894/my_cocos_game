import { _decorator, Button, Component, EventHandler, instantiate, Node, Sprite, UIOpacity } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
import { MathUtil } from '../Util/MathUtil';
const { ccclass, property } = _decorator;

@ccclass('CardConManager')
export class CardConManager extends Component {

    opacity = null;
    start() {
        DataManager.Instance.cardConManager = this;

        this.opacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
    }

    // 生成两张卡片
    createCards() {
        this.node.active = true;

        const results = MathUtil.staticgetTwoDistinctRandom(DataManager.Instance.cardDatas);
        if (!results) return;

        results.forEach((cardData, index) => {
            const cardPrefab = DataManager.Instance.prefabMap.get(cardData.card);
            if (!cardPrefab) {
                console.warn('未找到卡片预制体:', cardData.card);
                return;
            }

            const cardNode = instantiate(cardPrefab);
            cardNode.setParent(this.node);

            // 设置位置（左右分布）
            cardNode.setPosition(index === 0 ? -170 : 170, 0, 0);

            // 添加点击事件
            this.addCardClickEvent(cardNode, cardData);
        });
    }

    addCardClickEvent(node: Node, cardData: any) {
        const button = node.getComponent(Button) || node.addComponent(Button);

        const handler = new EventHandler();
        handler.target = this.node;
        handler.component = this.constructor.name;
        handler.handler = 'onCardClick';
        handler.customEventData = cardData;

        button.clickEvents = [handler];
    }

    // 点击处理函数
    onCardClick(event: Event, customData) {
        this.node.active = false;

        DataManager.Instance.partnerManager.addPartner(customData.partner)

        const cardIndex = DataManager.Instance.cardDatas.findIndex(item => {
            return item.card == customData.card;
        })

        if (cardIndex < 0) return;

        DataManager.Instance.cardDatas.splice(cardIndex, 1);
    }

}


