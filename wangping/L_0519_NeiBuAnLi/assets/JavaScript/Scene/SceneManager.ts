import { _decorator, Component, Prefab, Node, director, Collider, SphereCollider, BoxCollider, CylinderCollider, Vec3, Quat } from 'cc';
import { GamePlayNameEnum, PrefabPathEnum } from '../Enum/Index';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import { GridSystem } from '../Grid/GridSystem';
import { FlowField } from '../Monster/FlowField';
import { Simulator } from '../RVO/Simulator';
import { Vector2 } from '../RVO/Common';
import RVOObstacles from '../Global/RVOObstacles';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {

    @property(Node)
    obstacles: Node = null;

    async start() {
        await Promise.all([this.loadRes()]);
        this.initGame();
        this.initGrid();
    }

    async loadRes() {
        const list = [];
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((Prefab) => {
                DataManager.Instance.prefabMap.set(type, Prefab)
            })

            list.push(p);
        }

        await Promise.all(list);
    }

    initGame() {
        Platform.instance.init();
        if (DataManager.Instance.monsterManager) DataManager.Instance.monsterManager.init();
        //if (this.obstacles) {
            //FlowField.Instance.init(this.obstacles.children);
        //}
        // 测试
        // if (director.getScene().name != GamePlayNameEnum.GamePlayOne) {
        //     DataManager.Instance.cardConManager.createCards();
        // }

        //rvo
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));

        //静态障碍物添加 
        const obstacles = this.obstacles.children;
        for (let i = 0; i < obstacles.length; i++) {
            RVOObstacles.addOneObstacle(obstacles[i]);
        }
        
        Simulator.instance.processObstacles();
    }

    initGrid() {
        DataManager.Instance.gridSystem = new GridSystem(5);
    }
}

