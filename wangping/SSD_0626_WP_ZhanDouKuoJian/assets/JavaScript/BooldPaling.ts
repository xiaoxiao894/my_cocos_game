import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BooldPaling')
export class BooldPaling extends Component {
    @property(Node)
    bloodPaling: Node = null;

    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property({type:Number,tooltip:"最大血量"})

    bloodHpMax: number = 50;

    @property({type:Number,tooltip:"当前血量"})
    bloodHp: number = 50;

    subscribeBool(num: number = 1) {
        this.bloodHp -= num;
        this.bloodPaling.active = true;
        this.progressBar.progress = this.bloodHp / this.bloodHpMax;

    }


    start() {

    }

    update(deltaTime: number) {

    }
}


