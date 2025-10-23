import { _decorator, Component, Node, Camera, EventTouch, PhysicsSystem, geometry, Vec3, Layers, math } from 'cc';
import { ThirdPersonCamera } from 'db://assets/scripts/Camera/ThirdPersonCamera';
import { AircraftSimulation } from './AircraftSimulation';
const { ccclass, property } = _decorator;

import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';

@ccclass('AircraftPicker')
export class AircraftPicker extends Component {

    @property(Camera)
    mainCamera: Camera

    @property
    minPos: Vec3 = new Vec3(0, 0, 1)

    @property
    maxPos: Vec3 = new Vec3(0, 0, 3)

    _aircraftNode: Node
    _isLaunch: boolean = false;

    onLoad(): void {
        EventManager.addEventListener(EventType.TOUCH_START, this.onTouchStart, this);
        EventManager.addEventListener(EventType.TOUCH_MOVE, this.onTouchMove, this);
        EventManager.addEventListener(EventType.TOUCH_END, this.onTouchEnd, this);
        EventManager.addEventListener(EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected start(): void {
        EventManager.dispatchEvent(EventType.SET_PICKER_POS, this.minPos, this.maxPos)
    }

    onDestroy(): void {
        EventManager.remveEventListener(EventType.TOUCH_START, this.onTouchStart, this);
        EventManager.remveEventListener(EventType.TOUCH_MOVE, this.onTouchMove, this);
        EventManager.remveEventListener(EventType.TOUCH_END, this.onTouchEnd, this);
        EventManager.remveEventListener(EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {

        if (this._isLaunch) {
            return;
        }

        const ray = new geometry.Ray();
        this.mainCamera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

        const maxDistance = 100;
        const queryTrigger = false;
        const mask = 0xffffffff;
        if (PhysicsSystem.instance.raycast(ray, mask, maxDistance, queryTrigger)) {
            const raycastResults = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < raycastResults.length; i++) {
                const item = raycastResults[i];
                const itemNode = item.collider.node;
                if (itemNode.layer == 1 << Layers.nameToLayer("MAIN_PLAYER")) {
                    this._aircraftNode = itemNode;
                    EventManager.dispatchEvent(EventType.HIDE_DRAG_TWEEN);
                } else if (itemNode.layer == 1 << Layers.nameToLayer("FLOOR")) {
                }
            }
        }
    }

    onTouchMove(event: EventTouch) {

        if (this._isLaunch) {
            return;
        }

        if (this._aircraftNode != null) {

            const ray = new geometry.Ray();
            this.mainCamera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

            const maxDistance = 100;
            const queryTrigger = false;
            const mask = 0xffffffff;

            // if (PhysicsSystem.instance.raycastClosest(ray, floorMask, maxDistance, false)) {
            //     const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            //     const hitPoint = raycastClosestResult.hitPoint;

            //     const offset = new Vec3();
            //     offset.set(hitPoint);
            //     offset.subtract(this._lastHitPos);

            //     const pos = this._raycastNode.position;
            //     pos.add(offset);
            //     this._raycastNode.setPosition(pos);

            //     this._lastHitPos = hitPoint;

            //     console.log("22")
            // }

            if (PhysicsSystem.instance.raycast(ray, mask, maxDistance, queryTrigger)) {
                const raycastResults = PhysicsSystem.instance.raycastResults;
                for (let i = 0; i < raycastResults.length; i++) {
                    const item = raycastResults[i];
                    const itemNode = item.collider.node;
                    if (itemNode.layer == 1 << Layers.nameToLayer("FLOOR")) {

                        // const worldPosition = this._aircraftNode.worldPosition;

                        const pos = new Vec3();
                        pos.set(item.hitPoint);
                        // pos.y = worldPosition.y;

                        pos.x = math.clamp(pos.x, this.minPos.x, this.maxPos.x);
                        pos.y = math.clamp(pos.y, this.minPos.y, this.maxPos.y);
                        pos.z = math.clamp(pos.z, this.minPos.z, this.maxPos.z);

                        EventManager.dispatchEvent(EventType.AIRCAFT_DRAG, pos)
                    }

                }
            }

            // const pos = this._raycastNode.position;
            // pos.add(new Vec3(event.getDeltaX(), 0, event.getDeltaY()));
            // this._raycastNode.position = pos;
        }
    }

    onTouchEnd(event: EventTouch) {

        if (this._isLaunch) {
            return;
        }

        if (this._aircraftNode != null) {
            const maxDinstace = Math.abs(this.maxPos.z - this.minPos.z);
            const currentWorldPosZ = this._aircraftNode.worldPositionZ;
            const pullDistance = Math.abs(currentWorldPosZ - this.minPos.z);
            let pullScalar = pullDistance / maxDinstace;

            if (pullScalar < 0.78) {
                pullScalar = 0.78;
            }
            console.log("pullScalar",pullScalar);
            // if (pullScalar > 0.25) {
            EventManager.dispatchEvent(EventType.AIRCAFT_START, pullScalar);
            this._isLaunch = true;
            // }
        }
    }

    onTouchCancel(event: EventTouch) {
    }
}

//     @property(Camera)
//     camera: Camera;

//     _picker: Node;
//     _rigidBody: RigidBody;
//     // _force : number;
//     // _froward: Vec3;
//     // _constantForce : ConstantForce

//     _launchStartTime: number;

//     _deltaTime: number

//     onLoad() {
//         input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
//         input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
//         input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
//         input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
//     }

//     onDestroy() {
//         input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
//         input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
//         input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
//         input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
//     }

//     start() {
//     }

//     onTouchStart(event: EventTouch) {
//         // console.log(event.getLocation());  // Location on screen space
//         // console.log(event.getUILocation());  // Location on UI space
//         // 获得一条途径屏幕坐标（0，0）发射出的一条射线
//         // const location = event.getLocation();

//         const ray = new geometry.Ray();
//         this.camera?.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);

//         const mainCharacterMask = 0x1;
//         const maxDistance = 10000000;
//         const queryTrigger = true;

//         if (PhysicsSystem.instance.raycastClosest(ray, mainCharacterMask, maxDistance, queryTrigger)) {
//             const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
//             // this._picker = raycastClosestResult.collider.node;
//             // console.log("PICKER")
//             const hitPoint = raycastClosestResult.hitPoint
//             // const hitNormal = raycastClosestResult.hitNormal;
//             const collider = raycastClosestResult.collider;
//             const raycastNode = collider.node;
//             const aircraftSimulation = raycastNode.getComponent(AircraftSimulation);
//             aircraftSimulation.launch();
//             // this._froward = forward;
//             // const cf = raycastNode.getComponent(ConstantForce);
//             // this._constantForce = cf;
//             // this._force = 50;
//             // cf.force = new Vec3(forward.x * addForce, forward.y * addForce, forward.z * addForce);
//             // const distance = raycastClosestResult.distance;  
//             // collider.fo
//         }

//         // if (PhysicsSystem.instance.raycast(ray, mask, maxDistance, queryTrigger)) {
//         //     // for(let i = 0; i < r.length; i++) {
//         //     //     console.log(r[i]);
//         //     // }
//         //     /** TODO */
//         //     // const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
//         //     // const hitPoint = raycastClosestResult.hitPoint
//         //     // const hitNormal = raycastClosestResult.hitNormal;
//         //     // const collider = raycastClosestResult.collider;
//         //     // const distance = raycastClosestResult.distance; 
//         //     const results = PhysicsSystem.instance.raycastResults;
//         //     console.log(results) 
//         // }

//     }

//     onTouchMove(event: EventTouch) {
//         if (this._picker) {
//             //  // 获取鼠标在屏幕上的位置
//             //     const mouseX = event.getLocationX();
//             //     const mouseY = event.getLocationY();

//             //     // 将屏幕坐标转换为视口坐标(0-1范围)
//             //     const viewportX = mouseX / window.innerWidth;
//             //     const viewportY = mouseY / window.innerHeight;

//             //     // 设置Z轴为相机到物体的距离(根据实际场景调整)
//             //     const distance = 10;

//             //     // 从视口坐标转换为世界坐标
//             //     const _tempVec3 = new Vec3(viewportX * 2 - 1, viewportY * 2 - 1, 0.5);
//             //     // this.camera.ViewportToWorld(_tempVec3, _tempVec3);

//             //     // 更新Cube位置
//             //     this.node.setWorldPosition(_tempVec3);
//             // let pos = this._picker.position;
//             // this._picker.setPosition(pos.x - event.getDeltaY() *0.1, pos.y + event.getDeltaX() *0.1 , pos.z );
//         }
//         // console.log(event.getLocation());  // Location on screen space
//         // console.log(event.getUILocation());  // Location on UI space
//     }

//     onTouchEnd(event: EventTouch) {
//         this._picker = null;
//     }

//     onTouchCancel(event: EventTouch) {
//         this._picker = null;
//     }
// }


