import { _decorator, Component, instantiate, Node, Vec3 } from 'cc';
import { App } from './App';
import { GlobeVariable } from './core/GlobeVariable';
import { BooldPaling } from './BooldPaling';
const { ccclass, property } = _decorator;

@ccclass('palingTs')
export class palingTs extends Component {


    @property({ type: Node })
    public palingBloodBarParent: Node = null;


    private _blood: BooldPaling = null;
    //血条初始位置
    private _bloodOffset: Vec3 = new Vec3(0, 5, 0);
    private palingTime: number = 0;
    private palingTimeMax: number = 15;
    private isTime: boolean = false;

    start() {
        //创建血条
        this.init();

    }
    async init() {
        let prefabPalingBlood = await App.resManager.loadPrefab(GlobeVariable.prefabPath.PalingBloodBar);
        const bloodNode = instantiate(prefabPalingBlood);
        if (this.palingBloodBarParent) {
            bloodNode.parent = this.palingBloodBarParent;
            bloodNode.active = false;
            this._blood = bloodNode.getComponent(BooldPaling);
            //this._blood?.init(this.maxHp);

            if (this._blood) {
                let bloodPos: Vec3 = new Vec3();
                Vec3.add(bloodPos, this.node.worldPosition.clone(), this._bloodOffset);
                this._blood.node.setWorldPosition(bloodPos);
            }
        }
    }
    subscribeBool() {
        if( this._blood)
        this._blood.subscribeBool();

    }
    show() {
        this.isTime = true;
        if (this._blood)
            this._blood.node.active = true;
    }
    hide() {
        this.isTime = false;
        if (this._blood?.node)
            this._blood.node.active = false;
    }
    protected update(dt: number): void {
        if (this.isTime) {
            this.palingTime += dt;
            if (this.palingTime >= this.palingTimeMax) {
                this.palingTime = 0;

                this.hide();
            }

        }

    }


}


