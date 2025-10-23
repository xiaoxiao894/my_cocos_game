import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParticleTool')
export class ParticleTool extends Component {
    // protected onDisable(): void {
    //     this.scheduleOnce(()=>{
    //         this.node.getComponentsInChildren(ParticleSystem).forEach(particle => {
    //             particle.clear();
    //         });
    //     })
    // }
}


