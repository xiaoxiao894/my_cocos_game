import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MonsterCreateNodeManager')
export class MonsterCreateNodeManager extends Component {
    public static instance: MonsterCreateNodeManager;
    protected onLoad(): void {
        MonsterCreateNodeManager.instance = this;
    }

    private posList: Vec3[] = [];

    protected start(): void {
        const child = this.node.children;
        for (let i = 0; i < child.length; i++) {
            const node = child[i];
            this.posList.push(node.worldPosition);
        }
    }

    public get pos() {
        return this.posList[Math.floor(Math.random() * this.posList.length)];
    }


}


