import { _decorator, Component, Material, MeshRenderer, Node } from 'cc';
import { DissolveEffect } from '../Res/DissolveEffect/scripts/DissolveEffect';
const { ccclass, property } = _decorator;

@ccclass('blockRed')
export class blockRed extends Component {
    @property(DissolveEffect)
    dissolveEffect: DissolveEffect[] = [];

    protected start(): void {
        this.setMaterByIndex(0, true);
    }
    setRed() {
        this.setMaterByIndex(1);

        this.scheduleOnce(() => {
            this.setMaterByIndex(0);
        }, 0.1);

    }
    private setMaterByIndex(matIndex: number, needReset: boolean = false) {
        if (!this.dissolveEffect) {
            return;
        }
        this.dissolveEffect.forEach((d: DissolveEffect) => {
            d.init();

            let mesh: MeshRenderer = d.node.getComponent(MeshRenderer);
            if (mesh) {
                let matInstance: Material = mesh.getMaterialInstance(0);
                if (matIndex === 1) {
                    matInstance.setProperty('showType', 1.0);
                } else if (matIndex === 0) {
                    matInstance.setProperty('showType', 0.0);
                    matInstance.setProperty('dissolveThreshold', 0.0);
                } else if (matIndex === 2) {
                    matInstance.setProperty('showType', 0.0);
                    matInstance.setProperty('dissolveThreshold', 0.0);
                    d.play(0.8)
                }

            }

            if (needReset) {
                d.reset();
            }
        });

    }
    update(deltaTime: number) {

    }
}


