import { _decorator, Component, Node, Prefab } from 'cc';
import { UIJoyStickManager } from '../UI/UIJoyStickManager';
import Singleton from '../Base/Singleton';
import { CameraMain } from '../Camera/CameraMain';
import { MapComponent } from '../HomeMap/MapComponent';
import LaboratoryManeger from '../HomeMap/LaboratoryManeger';
import PeopleManeger from '../HomeMap/PeopleManeger';
import HonorManager from '../HomeMap/HonorManeger';
import { GenerateRobotsController } from '../Actor/GenerateRobotsController';
import { MoneyManeger } from '../HomeMap/MoneyManeger';
import { UIProperty } from '../UI/UIProperty';
import { GuideItem } from '../Common/DataTypes';
import { PromptArrowManager } from '../Arrow/PromptArrowManager';
import { moneyMaxManager } from '../UI/moneyMaxManager';
import { UIpropertyManager } from '../UI/UIpropertyManager';
import { SceneManager } from '../Scene/SceneManager';
import { EffectManager } from '../Effect/EffectManager';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    private moneyHeight: number = 0.42; //钱的高度

    public get MoneyHeight(): number {
        return this.moneyHeight;
    }

    private medicineHeight: number = 1; //药剂的高度

    public get MedicineHeight(): number {
        return this.medicineHeight;
    }

    private honorHeight: number = 0.4; //勋章的高度

    public get HonorHeight(): number {
        return this.honorHeight;
    }

    //解锁需要的数量
    public Helper1NeedNum: number = 15;
    public Helper2NeedNum: number = 30;
    public UnlockAreaNeedNum: number = 80;

    player = null;
    generateRobotsController: GenerateRobotsController
    pt: UIProperty
    jm: UIJoyStickManager
    prefabMap: Map<string, Prefab> = new Map();
    uiPropertyManager: UIpropertyManager;
    sceneManager: SceneManager;
    mainCamera: CameraMain = null;
    HomeMap: MapComponent = null;
    effectManager: EffectManager;
    //钱
    MoneyManeger: MoneyManeger = null;
    //实验室
    LaboratoryManeger: LaboratoryManeger = null;

    //小人儿们
    PeopleManeger: PeopleManeger = null; //人管理器

    //勋章管理器
    HonorManeger: HonorManager = null; //勋章管理器

    // 最大钱的数量
    maxMoneyCount = 20;

    medalsNumber = 0;

    //当前能否交付钱
    public canDeliverMoney: boolean = false;

    // 机器人是否执行动作
    isRobotAction = false;


    // 交付钱完成
    /**
     *  false 没有交付完成
     *  true  已经交付完成
     */
    isDeliveryMoneyCompleted = true;

    public guide: GuideItem[] = [];

    //摄像机引导中
    public cameraGuiding: boolean = false;

    isUnlockPlotOne = false;
    isUnlockPlotTwo = false;
    isUnlockPlotThree = false;

    moneyMaxManager: moneyMaxManager;
    promptArrowManager: PromptArrowManager;

    randomSeed = [0, 1, 2, 3];
    mtlCount = 0;
}

