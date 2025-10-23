import { _decorator, Component, ProgressBar, Sprite, SpriteFrame, tween } from 'cc';
import { LanguageManager } from '../core/LanguageManager';
//import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingComponent')
export class LoadingComponent extends Component {

    @property(Sprite)
    icon: Sprite = null;

    @property(ProgressBar)
    progress: ProgressBar = null;

    // @property(Sprite)
    // iconSprite: Sprite = null;

    @property(SpriteFrame)
    logoKo: SpriteFrame = null;

    @property(SpriteFrame)
    logozH: SpriteFrame = null;

    @property(SpriteFrame)
    logoEngLish: SpriteFrame = null;

    start() {
        // DataManager.Instance.isStartGame = false;
        // DataManager.Instance.UIPropertyManager.adaptationLanguageLogo(this.icon);
        const language = LanguageManager.t('Language');
        if (language == "ko") {
            this.icon.spriteFrame = this.logoKo;
        } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
            this.icon.spriteFrame = this.logozH;
        } else if (language) {
            this.icon.spriteFrame = this.logoEngLish;
        }
        this.progress.progress = 0;
        tween(this.progress).to(1, { progress: 0.6 }).start();
        this.scheduleOnce(() => {
            this.node.active = false;
            //DataManager.Instance.isStartGame = true;
        }, 1);
    }
}


