import { _decorator, Component, DirectionalLight, director, instantiate, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
import { MoneyRobotFaceCamera } from '../Camera/MoneyRobotFaceCamera';
import { MedicationRobotFaceCamera } from '../Camera/MedicationRobotFaceCamera';
const { ccclass, property } = _decorator;

@ccclass('GenerateRobotsController')
export class GenerateRobotsController extends Component {

    start() {
        DataManager.Instance.generateRobotsController = this;
    }

    // 创建提款机器人
    createWithdrawMoneyRobot() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.WithdrawMoneyRobot);

        const withdrawMoneyRobot = instantiate(prefab);
        director.getScene().addChild(withdrawMoneyRobot)

        DataManager.Instance.sceneManager.UIpropertyMoneyRobot.active = true;
        DataManager.Instance.sceneManager.UIpropertyMoneyRobot.getComponent(MoneyRobotFaceCamera).init(withdrawMoneyRobot);
    }

    // 创建收集药剂机器人
    createCollectingMedicationRobot() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.CollectingMedicationRobot);
        const collectingMedicationRobot = instantiate(prefab);
        director.getScene().addChild(collectingMedicationRobot);

        DataManager.Instance.sceneManager.UIpropertyMedicationRobot.active = true;
        DataManager.Instance.sceneManager.UIpropertyMedicationRobot.getComponent(MedicationRobotFaceCamera).init(collectingMedicationRobot);
    }
}

