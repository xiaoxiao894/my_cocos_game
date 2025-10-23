import { _decorator,  Prefab, Vec3 } from 'cc';
import Singleton from '../Base/Singleton';
import { UIManager } from '../UI/UIManager';
import { SceneManager } from '../Scene/SceneManager';
import { CameraMain } from '../Camera/CameraMain';
import { EnemyManager } from '../Enemy/EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    /** 敌人管理类 */
    enemyManger:EnemyManager = null;

    lastEnemyPos: Vec3 = null;

    /** 主摄像机 */
    public cameraMain: CameraMain = null;
    /** 子弹总数 */
    public bulletTotalNum: number = 10;
    /** 子弹数量 */
    public bulletNum: number = 0;
    /** 游戏结束 */
    public isGameEnd: boolean = false;

    prefabMap: Map<string, Prefab> = new Map();
    UIManager: UIManager;
    sceneMananger: SceneManager;
    expansionRadius = 0;
    
}


