import { _decorator, Component, Label, Node, Tween, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import super_html_playable from '../Common/super_html_playable';
import { LanguageManager } from '../Language/LanguageManager';
import { SoundManager } from '../Common/SoundManager';
import { PeopleEnum } from '../Actor/StateDefine';
import { PlotEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('GameEndManager')
export class GameEndManager extends Component {
    @property(Node)
    bg: Node = null;

    @property(Node)
    icon: Node = null;

    @property(Node)
    download: Node = null;

    @property(Node)
    win: Node = null;

    @property(Node)
    hand: Node = null;

    @property(Node)
    downloadLabel: Node = null;

    @property(Node)
    tryagainLabel: Node = null;

    start() {
        DataManager.Instance.gameEndManager = this;

        const downloadLabel = this.download?.getChildByName("DownloadLabel")?.getComponent(Label);
        const text1 = LanguageManager.t('download');
        if (downloadLabel && text1) {
            downloadLabel.string = text1;
        }

        const tryAgainLabel = this.download?.getChildByName("TryAgainLabel")?.getComponent(Label);
        const text2 = LanguageManager.t('tryAgain');
        if (tryAgainLabel && text2) {
            tryAgainLabel.string = text2;
        }

        this.node.active = false;
    }

    init(str: string) {
        if (str == 'download') {
            this.tryagainLabel.active = false;
            this.downloadLabel.active = true;

            // 胜利
            this.victorySound();
        } else {
            this.tryagainLabel.active = true;
            this.downloadLabel.active = false;
        }

        this.hand.active = false;
        this.node.active = true;
        // 背景淡入
        const opacityCom = this.bg.getComponent(UIOpacity) || this.bg.addComponent(UIOpacity);
        opacityCom.opacity = 0;
        tween(opacityCom)
            .to(0.1, { opacity: 150 })
            .start();


        // 初始缩放
        this.icon.setScale(0, 0, 0);
        this.win.setScale(0, 1, 1);
        this.download.setScale(0, 1, 1);

        tween(this.icon)
            .to(0.3, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();

        tween(this.download)
            .delay(0.3)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();

        tween(this.win)
            .delay(0.1)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.hand.active = true;
                this.playFingerAndButtonAnim();
            })
            .start();
    }

    // 手指+按钮循环提示动画
    playFingerAndButtonAnim() {
        tween(this.hand)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(0.9, 0.9, 0.9) })
                    .to(0.3, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    onClickButton() {
        if (this.tryagainLabel.active) {
            this.resetSceneContent();
        } else {
            super_html_playable.download();
        }
    }

    // 重置场景上所有内容
    resetSceneContent() {
        Tween.stopAll();
        // 重置数据
        this.resetData();
        // 人物是否在墙内
        DataManager.Instance.isPlayerInDoor = true;
        // 重置灯
        DataManager.Instance.isDisplayKeroseneLamp = false;
        // 重置血条
        DataManager.Instance.playerHealthBarManager.resetHealthBar();
        // 重置人物
        DataManager.Instance.player.resetPlayer();
        // 重置怪物
        DataManager.Instance.monsterConMananger.resetMonsterCon();
        // 重置地块
        DataManager.Instance.plotsManager.resetPlots();
        // 重置容器
        DataManager.Instance.placingManager.resetPlacing();
        // 重置肉容器
        DataManager.Instance.meatManager.resetMeatCon();
        // 重置记录数据
        DataManager.Instance.uiGameManager.resetProperty();
        // 重置虚拟摇杆提示
        DataManager.Instance.uiJoyStick.tipToucch();
        // 重置人物容器
        DataManager.Instance.peopleConManager.resetPeopleCon();
        // 重置自动烤肉机器
        DataManager.Instance.makeMeatChunksManager.resetMakeMeatChunks();

        this.node.active = false;
        DataManager.Instance.isPlayAgain = false;
    }

    resetData() {
        for (let i = 0; i < DataManager.Instance.rules.length; i++) {
            const data = DataManager.Instance.rules[i];

            if (i == 0) {
                data.isDisplay = true;
            } else {
                data.isDisplay = false;
            }

            if (data.colliderName == PlotEnum.Plot2) {
                data.coinNumber = 45;
            } else {
                data.coinNumber = data.initCoinNum;
            }
        }
    }

    // 胜利音效
    public victorySound() {
        // 胜利音效
        SoundManager.inst.playAudio("win");
    }
}


