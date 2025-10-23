import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BooldPaling')
export class BooldPaling extends Component {
    @property(Node)
    bloodPaling: Node = null;

    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(Number)
    private bloodHpMax: number = 20;

    @property
    private bloodHp: number = 20;

    @property
    private isBool: boolean = false;


    resetBloodHp() {
        this.bloodHp = this.bloodHpMax;
        this.progressBar.progress = 1;
    }
    continueGame() {
        this.node.active = true;
        this.bloodHp = this.bloodHpMax;
        this.progressBar.progress = 1;
    }
    getBloodHpMax() {
        return this.bloodHpMax;
    }

    subscribeBool(num: number = 1) {
        if (this.bloodHp <= 0) {
            this.node.active = false;
            return;
        }

        this.bloodHp -= num;
        this.bloodPaling.active = true;
        this.progressBar.progress = this.bloodHp / this.bloodHpMax;

    }
    getBloodHp() {
        return this.bloodHp;
    }


    start() {

        this.node.active = this.isBool;
    }

    update(deltaTime: number) {

    }
}


