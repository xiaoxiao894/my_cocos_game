import { _decorator, assert, AudioSource, Component, Node } from 'cc';
import { Global } from './core/Global';

const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {

    // 背景音乐
    @property({ type: AudioSource, tooltip: '背景音乐' })
    BgSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '砍树' })
    cutTreeSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '砍玉米' })
    cutCronSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '人物奔跑' })
    playrRunSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '敌人出现' })
    enemySound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '攻击敌人声音' })
    attackEnemySound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '建筑掉落声音' })
    animationSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '交付' })
    handOverSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '拾取' })
    pickUpSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: '升级' })
    upSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: ' 警告声音' })
    warnSound: AudioSource = null;

    @property({ type: AudioSource, tooltip: ' 破碎音效' })
    shatterSound: AudioSource = null;

    playShatterSound(){
        if (this.shatterSound.state !== AudioSource.AudioState.PLAYING) {
            this.shatterSound.playOneShot(this.shatterSound.clip, 1);
        }
    }
    /** 播放背景音乐 */
    playBgMusic() {
        if (this.BgSound.state !== AudioSource.AudioState.PLAYING) {
            this.BgSound.play();
        }
    }
    playCutTreeSound(){
        if (this.cutTreeSound.state !== AudioSource.AudioState.PLAYING) {
            //this.cutTreeSound.play();
            this.cutTreeSound.playOneShot(this.cutTreeSound.clip, 1);
        }
    }
    playWarnSound(){
        if (this.warnSound.state !== AudioSource.AudioState.PLAYING) {
            //this.cutTreeSound.play();
            this.warnSound.playOneShot(this.warnSound.clip, 1);
        }
    }

    playCutCronSound(){
        if (this.cutCronSound.state !== AudioSource.AudioState.PLAYING) {
            //this.cutCronSound.play();
            this.cutCronSound.playOneShot(this.cutCronSound.clip, 1);
        }
    }
    playPlayerRunSound(){
        if (this.playrRunSound.state !== AudioSource.AudioState.PLAYING) {
            this.playrRunSound.play();
           // this.playrRunSound.playOneShot(this.playrRunSound.clip, 1);
        }
    }
    playEnemySound(){
        if (this.enemySound.state !== AudioSource.AudioState.PLAYING) {
            this.enemySound.play();
        }
    }
    playAttackEnemySound(){
        if (this.attackEnemySound.state !== AudioSource.AudioState.PLAYING) {
            this.attackEnemySound.play();
        }
    }
    playAnimationSound(){
        if (this.animationSound.state !== AudioSource.AudioState.PLAYING) {
            //this.animationSound.play();
            this.animationSound.playOneShot(this.animationSound.clip, 1);
        }
    }
    playHandOverSound(){
        if (this.handOverSound.state !== AudioSource.AudioState.PLAYING) {
            //this.handOverSound.play();
            this.handOverSound.playOneShot(this.handOverSound.clip, 1);
        }
    }
    playPickUpSound(){
        if (this.pickUpSound.state !== AudioSource.AudioState.PLAYING) {
            //this.pickUpSound.play();
            this.pickUpSound.playOneShot(this.pickUpSound.clip, 1);
        }
    }
    playPickUpSound1(){
        if (this.pickUpSound.state !== AudioSource.AudioState.PLAYING) {
            this.pickUpSound.play();
            //this.pickUpSound.playOneShot(this.pickUpSound.clip, 1);
        }
    }
    playUpSound(){
        if (this.upSound.state !== AudioSource.AudioState.PLAYING) {
            this.upSound.play();
        }
    }
    // /** 播放选择插销音效 */
    // playPlugSound() {
    //     if (this.plugSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.plugSound.play();
    //     }
    // }

    // /** 播放插入插销音效 */
    // playSocketSound() {
    //     if (this.socketSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.socketSound.play();
    //     }
    // }

    // /** 播放背景音效 */
    // playVictorySound() {
    //     if (this.victorySound.state !== AudioSource.AudioState.PLAYING) {
    //         this.victorySound.play();
    //     }
    // }
    // /** 播放通电音效 */
    // playElectricSound() {
    //     if (this.electricSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.electricSound.play();
    //     }
    // }

    // /** 播放围墙出生音效 */
    // playPalingSound() {
    //     if (this.palingSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.palingSound.play();
    //     }
    // }

    // /** 播放解锁音效 */
    // playLockSound() {
    //     if (this.lockSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.lockSound.play();
    //     }
    // }

    // /** 播放欢呼音效 */
    // playCheerSound() {
    //     if (this.cheerSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.cheerSound.play();
    //     }
    // }

    // /** 播放洒水音效 */
    // playWateringSound() {
    //     if (this.wateringSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.wateringSound.play();
    //     }
    // }
    // /** 播放洒水音效3次 */
    // playWateringSoundThreeTimes() {
    //     let playCount = 0;
    //     const totalPlays = 3;
    //     const interval = 0.5; // 每次播放之间的间隔时间（秒）

    //     const playNext = () => {
    //         if (playCount < totalPlays) {
    //             this.wateringSound.playOneShot(this.wateringSound.clip, 1);
    //             playCount++;

    //             // 使用 scheduleOnce 来安排下一次播放
    //             this.scheduleOnce(() => {
    //                 playNext();
    //             }, interval);
    //         }
    //     };

    //     playNext();
    // }

    // /** 播放生长音效 */
    // playGrowSound() {
    //     if (this.growSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.growSound.play();
    //     }
    // }

    // /** 播放升级音效 */
    // playUpgradeSound() {
    //     if (this.upSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.upSound.play();
    //     }
    // }

    // /** 播放矿石音效 */
    // playOreSound() {
    //     if (this.oreSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.oreSound.play();
    //     }
    // }
    // /** 播放3次矿石音效 */
    // playOreSoundThreeTimes() {
    //     let playCount = 0;
    //     const totalPlays = 3;
    //     const interval = 0.5; // 每次播放之间的间隔时间（秒）

    //     const playNext = () => {
    //         if (playCount < totalPlays) {
    //             this.oreSound.playOneShot(this.oreSound.clip, 1);
    //             playCount++;

    //             // 使用 scheduleOnce 来安排下一次播放
    //             this.scheduleOnce(() => {
    //                 playNext();
    //             }, interval);
    //         }
    //     };

    //     playNext();
    // }

    // /** 播放围墙电流音效 */
    // playPalingElectricSound() {
    //     if (this.palingElectric.state !== AudioSource.AudioState.PLAYING) {
    //         // this.palingElectric.play();
    //         this.palingElectric.playOneShot(this.palingElectric.clip, 1);
    //     }
    // }

    // /** 播放攻击围墙音效 */
    // playAttackPalingSound() {
    //     if (this.attackPaling.state !== AudioSource.AudioState.PLAYING) {
    //         this.attackPaling.play();
    //     }
    // }

    // /** 播放熊音效 */
    // playBearSound() {
    //     if (this.bearSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.bearSound.play();
    //     }
    // }

    // /** 播放大象音效 */
    // playElephantSound() {
    //     if (this.elephantSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.elephantSound.play();
    //     }
    // }

    // /** 播放狗音效 */
    // playDogSound() {
    //     if (this.dogSound.state !== AudioSource.AudioState.PLAYING) {
    //         this.dogSound.play();
    //     }
    // }

    // // /** 播放资源投放音效 */
    // playResourceSound() {
    //     if (this.resourceSound.state !== AudioSource.AudioState.PLAYING) {

    //         this.resourceSound.playOneShot(this.resourceSound.clip, 1);
    //     }
    // }
    // //     /**
    // //  * 播放资源投放音效
    // //  * @param num - 控制音效播放次数和音量大小的参数
    // //  */
    // //     playResourceSound(num: number) {



    // //         // 播放指定次数的音效，每次降低音量
    // //         for (let i = 0; i < num; i++) {
    // //             // 计算当前音量 (随次数增加而降低)
    // //            // const volume = Math.max(0.2, 1 - (i * 0.1)); // 最低音量0.2

    // //             // 使用 setTimeout 安排每次播放
    // //             const timer = setTimeout(() => {
    // //                 // 使用 playOneShot 方法，不需要检查音频源状态
    // //                 this.resourceSound.playOneShot(this.resourceSound.clip, 0.5);
    // //             }, i * 20); // 200毫秒间隔，可根据需要调整

    // //         }
    // //     }

    
    protected start(): void {
        Global.soundManager = this;
    }
}