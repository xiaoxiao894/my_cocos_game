import { _decorator, Component, Node, Vec3 } from 'cc';
import { BagBase } from '../Bag/Base/BagBase';
import { BuyWay } from '../ShoppIng/Buy/BuyWay';
import { MoveDrive } from '../../Base/MoveDrive';
import { PropEnum } from '../../Base/EnumIndex';
import { FbxManager } from '../FBX/FbxManager';
const { ccclass, property } = _decorator;

@ccclass('AutoTakeMeat')
export class AutoTakeMeat extends Component {
    @property(BagBase)
    public cookMeatBag: BagBase;
    @property(BagBase)
    public meatBag: BagBase;

    @property(Node)
    public cookMeatNode: Node;
    @property(Node)
    public meatNode: Node;

    @property(BuyWay)
    public buyWay: BuyWay;
    @property(FbxManager)
    public fbxMgr: FbxManager;

    private state: number = 0; // 0: not cooking, 1: cooking
    private moveDrive: MoveDrive;

    protected onLoad(): void {
        this.moveDrive = this.getComponent(MoveDrive);
    }

    update(deltaTime: number) {

        if (this.moveDrive.isMove) {
            this.fbxMgr.setAnimation(1, true);
            return;
        } else {
            this.fbxMgr.setAnimation(0, true);
            if (this.state == 0) {
                const rot = this.moveDrive.rotDrive;
                const currentY = rot.node.eulerAngles.y;
                const targetY = -225;
                if (currentY != targetY) {
                    const turnSpeed = 5; // 转向速度，数值越大转得越快，可自行调整
                    // 计算插值
                    let newY = currentY + (targetY - currentY) * Math.min(turnSpeed * deltaTime, 1);
                    // 防止过冲
                    if (Math.abs(targetY - newY) < 0.1) {
                        newY = targetY;
                    }
                    rot.node.eulerAngles = new Vec3(0, newY, 0);
                }
            }
        }
        switch (this.state) {
            case 0: {
                if (!this.meatBag.propCount_R && this.cookMeatBag.propCount >= 5) {
                    this.state = 1;
                    this.moveDrive.pos = this.meatNode.worldPosition;
                }
                break;
            }
            case 1: {
                const bag = this.buyWay.getBag(PropEnum.cookMeat);
                if (this.cookMeatBag.propCount == 0 || bag.propCount >= 25) {
                    this.state = 0;
                    this.moveDrive.pos = this.cookMeatNode.worldPosition;
                }
                break;
            }
        }
    }
}


