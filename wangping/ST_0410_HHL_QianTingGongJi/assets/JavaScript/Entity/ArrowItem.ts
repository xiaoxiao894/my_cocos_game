
import { _decorator, BoxCollider, Camera, CapsuleCollider, Component, geometry, instantiate, MeshRenderer, Node, Prefab, Rect, renderer, RigidBody, Vec3, view } from 'cc';
import { DataManager } from '../Globel/DataManager';
import Frustum from '../Common/Frustum';
import { Planes } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('ArrowItem')
export class ArrowItem extends Component {
    //基础高度
    private _baseHeight: number = 10;

    private _margin: number = 75;

    private _shipNode: Node;


    public init(ship: Node) {
        this._shipNode = ship;
    }

    public checkShip(ship: Node) {
        return ship === this._shipNode;
    }

    update(dt: number) {
        if (this._shipNode && this._shipNode.active) {

            this.node.active = true;
            let pos: Vec3 = new Vec3();
            const camera: Camera = DataManager.Instacne.sceneMananger.camera;
            let shipPos: Vec3 = this._shipNode.getWorldPosition().clone();

            camera.convertToUINode(new Vec3(shipPos.x, shipPos.y + this._baseHeight, shipPos.z), this.node.parent, pos);
            //console.log("shipshipship",this._shipNode.getWorldPosition(),"camera",camera.node.position);
            let depth: number = camera.node.position.z - this._shipNode.position.z;

            //console.log("depth " ,depth);
            const screen = view.getVisibleSize();
            const maxX: number = screen.width / 2 - this._margin;
            const maxY: number = screen.height / 2 - this._margin;
            let newEuler: Vec3 = this.node.eulerAngles.clone();
            newEuler.z = 0;
            if (pos.x > maxX) {
                pos.x = maxX;
                newEuler.z = 90;
            } else if (pos.x < -maxX) {
                pos.x = -maxX;
                newEuler.z = -90;
            }
            if (pos.y > maxY) {
                pos.y = maxY;
                newEuler.z = 180;
            } else if (pos.y < -maxY) {
                pos.y = -maxY;
            }
            let inScreen: number = Frustum.isNodeInFOV(this._shipNode, camera);
            if (inScreen > 0 && Math.abs(pos.x) < maxX && Math.abs(pos.y) < maxY) {
                switch (inScreen) {
                    case 3:
                        pos.y = maxY;
                        newEuler.z = 180;
                        break;
                    case 4:
                        pos.y = -maxY;
                        newEuler.z = 0;
                        break;
                    case 1:
                        //垂直方向超出
                        if (pos.y > 0) {
                            pos.y = maxY;
                            newEuler.z = 180;
                        } else {
                            pos.y = -maxX;
                            newEuler.z = 0;
                        }
                        break;
                    case 2:
                        //水平方向超出
                        if (pos.x > 0) {
                            pos.x = maxX;
                            newEuler.z = 90;
                        } else {
                            pos.x = -maxX;
                            newEuler.z = -90;
                        }

                        break;
                }
            }
            //console.log("inScreen",inScreen);
            this.node.setPosition(pos.x, pos.y);
            this.node.eulerAngles = newEuler;

        } else {
            this.node.active = false;
        }
    }


}


