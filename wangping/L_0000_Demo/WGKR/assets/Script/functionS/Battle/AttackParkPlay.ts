import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AttackParkPlay')
export class AttackParkPlay extends Component {

    private pratList: ParticleSystem[] = []

    protected onLoad(): void {
        let prat = this.node.getComponent<ParticleSystem>(ParticleSystem);
        this.pratList.push(prat)
        let count = this.node.children.length;
        for (let i = 0; i < count; i++) {
            let prat = this.node.children[i].getComponent<ParticleSystem>(ParticleSystem);
            this.pratList.push(prat)
        }
    }

    public play() {
        for (let i = 0; i < this.pratList.length; i++) {
            this.pratList[i].stop();
            this.pratList[i].play();
        }
    }

    public stop() {
        for (let i = 0; i < this.pratList.length; i++) {
            this.pratList[i].stop();
        }
    }
}


