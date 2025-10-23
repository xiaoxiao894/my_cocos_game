import { _decorator, Component, ProgressBar, Sprite, tween } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingComponent')
export class LoadingComponent extends Component {

    @property(Sprite)
    icon: Sprite = null;

    @property(ProgressBar)
    progress: ProgressBar = null;

    start() {
        DataManager.Instance.isStartGame = false;
        DataManager.Instance.UIPropertyManager.adaptationLanguageLogo(this.icon);
        this.progress.progress = 0;
        tween(this.progress).to(1,{progress:0.6}).start();
        this.scheduleOnce(()=>{
            this.node.active = false;
             DataManager.Instance.isStartGame = true;
        },1);
    }
}


