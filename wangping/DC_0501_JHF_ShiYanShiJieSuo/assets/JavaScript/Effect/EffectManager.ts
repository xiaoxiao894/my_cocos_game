import { _decorator, Component, Node, ParticleSystem, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('EffectManager')
export class EffectManager extends Component {
    @property(ParticleSystem)
    node1: ParticleSystem = null;

    @property(ParticleSystem)
    node2: ParticleSystem = null;

    @property(ParticleSystem)
    node3: ParticleSystem = null;

    @property(ParticleSystem)
    node4: ParticleSystem = null;

    @property(ParticleSystem)
    node5: ParticleSystem = null;

    @property(ParticleSystem)
    node6: ParticleSystem = null;

    @property(ParticleSystem)
    node7: ParticleSystem = null;

    @property(ParticleSystem)
    node8: ParticleSystem = null;

    @property(ParticleSystem)
    node9: ParticleSystem = null;

    @property(ParticleSystem)
    node10: ParticleSystem = null;

    @property(ParticleSystem)
    node11: ParticleSystem = null;

    @property(ParticleSystem)
    node12: ParticleSystem = null;

    @property(ParticleSystem)
    node13: ParticleSystem = null;

    @property(ParticleSystem)
    node14: ParticleSystem = null;

    @property(ParticleSystem)
    node15: ParticleSystem = null;

    @property(ParticleSystem)
    node16: ParticleSystem = null;

    @property(ParticleSystem)
    node17: ParticleSystem = null;

    start() {
        DataManager.Instance.effectManager = this;
        this.effectScene1Nomal(true);
    }

    effectScene1Play() {
        this.node4?.play();
        tween(this.node5.node).to(0.1, { scale: new Vec3(0.75,0.75,0.75) }).start();
        
        this.node1.simulationSpeed = 1;
        
        this.node2.simulationSpeed = 1;
    }

    public effectScene1Nomal(first: boolean = false) {
        
        
        this.node4.stop();
        
        
        if (first) {
            this.node1.play();
            this.node2.play();
            this.node3.play();
            this.node5.play();
            this.node5.node.setScale(new Vec3(0.5,0.5,0.5));
            this.node6.play();
            this.scheduleOnce(()=>{
                this.node1.simulationSpeed = 0;
                this.node2.simulationSpeed =0;
            })
        }else{
            tween(this.node5.node).to(0.1, { scale: new Vec3(0.5,0.5,0.5) }).start();
            this.node1.simulationSpeed = 0;
            this.node2.simulationSpeed =0;
        }
    }

    effectScene2() {
        this.node7?.play();
        this.node8?.play();
        this.node9?.play();
        this.node10?.play();
        this.node11?.play();
        this.node12?.play();
        this.node13?.play();
    }

    effectScene3() {
        this.node14?.play();
        this.node15?.play();
        this.node16?.play();
        this.node17?.play();
    }

    update(deltaTime: number) {

    }
}


