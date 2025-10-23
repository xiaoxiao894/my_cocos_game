import { _decorator, Component, Node, Vec3 } from 'cc';
import { MoveDrive } from '../../Base/MoveDrive';
import { RotationDrive } from '../Rotation/RotationDrive';
import Shopping from '../ShoppIng/Shopping';
import { FbxManager } from '../FBX/FbxManager';
const { ccclass, property } = _decorator;
enum BuyAiAnimEnum {
    null = -1,
    idle,
    run,
}
@ccclass('BuyAI')
export class BuyAI extends Component {

    @property(MoveDrive)
    public moveD: MoveDrive;

    public rot: RotationDrive;

    @property(Shopping)
    public shop: Shopping;
    @property(FbxManager)
    public fbxMgr: FbxManager

    public state: number = 0;

    protected start(): void {
        this.rot = this.moveD.rotDrive;
    }

    protected update(dt: number): void {
        if (this.moveD.isMove) {
            this.fbxMgr.setAnimation(BuyAiAnimEnum.run);
        } else {
            this.fbxMgr.setAnimation(BuyAiAnimEnum.idle);
        }
    }

    protected onEnable(): void {
        this.shop.gold = Math.floor(Math.random() * 5) + 1;
        this.shop.init();
        this.shop.node.setScale(Vec3.ZERO);
        this.state = 0;
        this.fbxMgr.init();
    }


}


