import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { App } from './App';
import { GlobeVariable } from './core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('electricEffect')
export class electricEffect extends Component {
    @property(Node)
    electricNodePath: Node = null;

    @property(Boolean)
    isLight: boolean = false;


    private _speed: number = 10;

    private initTime: number = 0;
    private initTiemLimit: number = 0.8;


    start() {
        this.electricNodePath ||= this.node;
        
    }

    update(deltaTime: number) {
        this.initTime += deltaTime;
        if (this.initTime >= this.initTiemLimit) {
            this.initTime = 0;
            this.cretorElectric(() => {
                // console.log("============================>", "创建完成");
            })
        }


    }
    cretorElectric(callback: () => void) {
        if (this.electricNodePath == null) {
            return;
        }
        let prefab = App.poolManager.getNode(GlobeVariable.entifyName.bulletEffect);
        const sphereLight = prefab.getChildByName("Sphere Light");
        const electricity = prefab.getChildByName("Electricity-001");
        sphereLight.active = this.isLight;
        electricity.active = !this.isLight;
        prefab.setPosition(this.electricNodePath.children[0].position);

        prefab.parent = this.electricNodePath.parent;
        let seq = tween(prefab)

        for (let i = 1; i < this.electricNodePath.children.length; i++) {
            const from = this.electricNodePath.children[i - 1].worldPosition;
            const to = this.electricNodePath.children[i].worldPosition;
            const distance = Vec3.distance(from, to);
            const moveTime = distance / this._speed;

            const direction = new Vec3();
            Vec3.subtract(direction, to, from);
            direction.normalize();

            // const angleY = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
            // console.log("============================>", angleY);
            seq = seq.then(
                tween(prefab)
                    .to(moveTime, { worldPosition: to }, { easing: 'linear' })
                    .call(() => {

                        // 若需要旋转，设置欧拉角
                        // let snappedAngle = Math.round(angleY / 90) * 90;
                        // electricTower.setRotationFromEuler(new Vec3(0, snappedAngle, 0));

                        // electricTower.setRotationFromEuler(new Vec3(0, angleY, 0));
                    })
            );
        }
        seq = seq.call(() => {
            if (callback) {
                callback();
            }
            App.poolManager.returnNode(prefab);
            if (prefab) prefab.removeFromParent();
        })
        seq.start();

    }
}


