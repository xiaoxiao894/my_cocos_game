import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlagDelayParticle')
export class FlagDelayParticle extends Component {

    @property(Node)
    particle: Node

    @property
    delayTime: number = 1.0

    start() {
        this.particle.active = false;
    }

    protected onEnable(): void {
        this.scheduleOnce(()=>{
            this.particle.active = true;
        }, this.delayTime);
    }

    update(deltaTime: number) {
    }
}

