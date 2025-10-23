import { _decorator, Component, Node } from 'cc';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import TweenTool from '../../Tool/TweenTool';
// import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
const { ccclass, property } = _decorator;

@ccclass('GameOverPanel')
export class GameOverPanel extends Component {

    public static instance: GameOverPanel;

    constructor() {
        super();
        GameOverPanel.instance = this;
    }


    protected start(): void {
        this.node.active = false;
    }

    @property(Node)
    public winNode: Node;
    @property(Node)
    public loseNode: Node;

    show(isWin: boolean) {
        this.node.active = true;
        UnityUpComponent.isStop = true;
        TweenTool.scaleShake(this.node);
        if (isWin) {
            this.winNode.active = true;
            this.loseNode.active = false;
            AudioManager.inst.playOneShot(SoundEnum.Sound_win);
        } else {
            this.winNode.active = false;
            this.loseNode.active = true;
            AudioManager.inst.playOneShot(SoundEnum.Sound_loser);
        }
        // SuperPackage.Instance.DownloadTCE();

    }

}


