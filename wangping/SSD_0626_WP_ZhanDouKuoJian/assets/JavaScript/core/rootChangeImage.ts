import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { LanguageManager } from './LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('rootChangeImage')
export class rootChangeImage extends Component {
    adaptationLanguageLogo(sprite) {
        // const language = LanguageManager.t('Language');
        // if (language == "ko") {
        //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[0]
        // } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
        //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[1]
        // } else if (language) {
        //     sprite.spriteFrame = DataManager.Instance.sceneManager.logoIcon[2]
        // }
    }
    @property(SpriteFrame)
    logoKo: SpriteFrame = null;
    
    @property(SpriteFrame)
    logozH: SpriteFrame = null;

    @property(SpriteFrame)
    logoEngLish: SpriteFrame = null;

    @property(Sprite)
    icon: Sprite = null;

    @property(Node)
    download: Node = null;

    @property(Node)
    koLable: Node = null;


    start() {
        const downloadLabel = this.download?.getChildByName("Label")?.getComponent(Label);
        const text = LanguageManager.t('Download');
        if (downloadLabel && text) {
            downloadLabel.string = text;
        }


        const language = LanguageManager.t('Language');
        if (language == "ko") {
           this.icon.spriteFrame = this.logoKo;
        } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
            this.icon.spriteFrame = this.logozH;
        } else if (language) {
            this.icon.spriteFrame = this.logoEngLish;
        }

        this.scheduleOnce(() => {
            if (this.koLable) this.koLable.active = false;
        }, 5)
    }

    update(deltaTime: number) {

    }
}


