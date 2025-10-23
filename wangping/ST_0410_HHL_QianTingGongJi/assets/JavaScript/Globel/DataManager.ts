import { _decorator, Component, Node, Pool, Prefab } from 'cc';
import Singleton from '../Base/Singleton';
import { UIManager } from '../UI/UIManager';
import { FireButtonManager } from '../UI/FireButtonManager';
import { SceneManager } from '../Scene/SceneManager';
import { SoundManager } from '../Sound/SoundManager';
import { TargetNumManager } from '../UI/TargetNumManager';
import { ScaleCameraManager } from '../UI/ScaleCameraManager';
import { SourceManager } from '../UI/SourceManager';
import { FailManager } from '../UI/FailManager';
import { CameraManager } from '../Camera/CameraManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instacne() {
        return super.GetInstance<DataManager>();
    }

    currentBulletCount = 7;
    targetBulletCount = 7;
    isCorrect = false;
    failCount = 1;
    targetFailCount = 2;
    curLevel = 1;
    targetLevel = 2;
    scaleCameraManager: ScaleCameraManager;
    targetNumManager: TargetNumManager
    soundManager: SoundManager
    isTurnSound = true;
    prefabMap: Map<string, Prefab> = new Map();
    UIManager: UIManager;
    fireButtonManager: FireButtonManager;
    sceneMananger: SceneManager;
    prefabPool: Pool<Node> | null = null;
    isDisplayGuidance = true;
    sourceManager: SourceManager;
    failManager: FailManager;
    cameraManager: CameraManager = null;
    expansionRadius = 0;
    minExpansionRaiuds = 0;
    maxExpansionRaiuds = 15;

    scaleOne = 1.1;
    scaleTwo = 1.4;

    scaleStart:boolean = false;

    // 重置当前管卡
    resetPage() {
        // 更新目标
        this.targetNumManager.initTargetNum();

        // 更新声音按钮的状态
        this.UIManager.openSpeakerButton(); 

        // 重置进度条
        this.scaleCameraManager.resetSlider();

        // 初始化船
        this.sceneMananger.createShips();

        this.fireButtonManager.initText();

        DataManager.Instacne.UIManager.node.active = true;
    }
}


