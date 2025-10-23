import { _decorator, Collider, Component, find, Label, Node, RigidBody, Sprite } from 'cc';
import { DataManager } from '../Global/DataManager';
import { Actor } from '../Actor/Actor';
const { ccclass, property } = _decorator;

@ccclass('PlotsManager')
export class PlotsManager extends Component {
    private _plotsRoot = null;
    start(): void {
        DataManager.Instance.plotsManager = this;

        this._plotsRoot = find('Root/Phy/Plots');
    }

    resetPlots() {
        for (let p = 0; p < this.node.children.length; p++) {
            const plot = this.node.children[p];

            if (!plot) continue;

            const childPlot = plot.getChildByName("Plot");
            if (childPlot) {
                childPlot.active = true;
                const progress = childPlot.getChildByName("DK_jindu");
                if (!progress) continue;

                const progressSprite = progress.getComponent(Sprite);
                if (!progressSprite) continue;

                progressSprite.fillRange = 0;

                const label = childPlot.getChildByName("Label");
                const labelCom = label.getComponent(Label);
                if (!labelCom) continue;

                const plotData = DataManager.Instance.rules.find(itme => {
                    return itme.colliderName == plot.name;
                })

                if (plotData) {
                    labelCom.string = `${plotData.coinNumber}`;
                }
            }

            const elementCon = plot.getChildByName("ElementCon");
            if (elementCon) elementCon.setScale(0, 0, 0);

            const flame = elementCon?.getChildByName("TX_huomiao2");
            if (flame) flame.active = false;

            const fire = elementCon?.getChildByName("TX_huoyan");
            if (fire) fire.active = false;

            const upgrade = elementCon?.getChildByName("TX_shengji_01");
            if (upgrade) upgrade.active = false;

            if (p >= 2) {
                plot.active = false;
            } else {
                plot.active = true;
            }
        }

        const playerActor = DataManager.Instance.player.getComponent(Actor);
        if (!playerActor) return;

        ['Plot1', 'Plot4', 'Plot5', 'Plot8', 'Plot9'].forEach(name => {
            const plot = this._plotsRoot.getChildByName(name);
            if (!plot) return;

            plot.getComponent(Collider).enabled = false;
            plot.getComponent(RigidBody).enabled = false
        });
    }
}


