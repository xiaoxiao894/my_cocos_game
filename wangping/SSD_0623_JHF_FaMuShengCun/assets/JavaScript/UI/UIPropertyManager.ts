import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { DataManager } from '../Global/DataManager';
import { LanguageManager } from '../Language/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('UIPropertyManager')
export class UIPropertyManager extends Component {
    @property(Label)
    propertyLabel: Label = null;

    @property(Label)
    downloadLabel: Label = null;

    @property(Node)
    kLabelNode: Node = null;

    @property(Sprite)
    pageIconSpr: Sprite = null;

    _total = 0;

    protected onLoad(): void {
        DataManager.Instance.UIPropertyManager = this;
    }

    start() {
        const text = LanguageManager.t('Download');
        if (this.downloadLabel && text) {
            this.downloadLabel.string = text;
        }

        this.adaptationLanguageLogo(this.pageIconSpr);
        this._total = 0;

        this.propertyLabel.string = `${this._total}`;

        this.scheduleOnce(() => {
            if (this.kLabelNode) this.kLabelNode.active = false;
        }, 5)
    }

    collectProperty() {
        this._total++;
        this.propertyLabel.string = `${this._total}`;
    }

    deliverProperty() {
        this._total--;
        if (this._total >= 0) {
            this.propertyLabel.string = `${this._total}`;
        }
    }

    update(deltaTime: number) {

    }

    // 适配语言logo
    adaptationLanguageLogo(sprite) {
        const language = LanguageManager.t('Language');
        if (language == "ko") {
            sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[0]
        } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
            sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[1]
        } else if (language) {
            sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[2]
        }


        //   if (language == "ko") {
        //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[0]
        // } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
        //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[1]
        // } else if (language) {
        //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[2]
        // }
    }
}


