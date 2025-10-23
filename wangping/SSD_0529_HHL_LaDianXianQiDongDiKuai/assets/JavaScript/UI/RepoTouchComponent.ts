import { _decorator, Camera, CCInteger, Collider, Component, EventTouch, geometry, Input, Node, PhysicsSystem, Quat, tween, Vec2, Vec3, Vec4 } from 'cc';
import { DataManager } from '../Global/DataManager';
import TransformPositionUtil from '../Utils/TransformPositionUtil';
import { PlugItem } from '../Repo/PlugItem';
import { MathUtil } from '../Utils/MathUtils';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { eventMgr } from '../core/EventManager';
import { PlotName } from '../core/EventType';
import RopeUtils from '../Repo/RopeUtils';
const { ccclass, property } = _decorator;

@ccclass('RepoTouchComponent')
export class RepoTouchComponent extends Component {
    @property(Node)
    touchNode: Node = null;

    //相机滑动灵敏度
    @property(CCInteger)
    sensitivity: number = 0.05;

    //插头初始位置
    private _plugStartPos: Vec3 = null;
    //插头初始方向
    private _plugStartRot: Quat = null;

    //当前插座 index
    private _nowSocketIndex: number = 0;

    //插头旋转速度
    private _plugRotateSpeed: number = 3;
    //插头最终旋转方向
    private _plugTartetRot: Quat = null;

    private _lastTouchPos: Vec2 = null;

    //是否正在移动插头
    private _movingPlug: boolean = false;
    //是否正在移动摄像机
    private _movingCamera: boolean = false;



    //插头是否正在回弹
    private _plugBacking: boolean = false;

    //插头正在插入
    private _pluglinking: boolean = false;

    //检测点击升级
    private _checkTowerBtn: boolean = false;

    private _lastPlotIndex: number = -1;

    start() {
        this._movingPlug = false;
    }

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);;
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        EventManager.inst.on(EventName.PlugStateUpdate, this.onPlugStateUpdate, this);
        EventManager.inst.on(EventName.TowerUpgradeButtonShow, this.onTowerUpgradeBtnShow, this);
    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);;
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        EventManager.inst.off(EventName.PlugStateUpdate, this.onPlugStateUpdate, this);
        EventManager.inst.off(EventName.TowerUpgradeButtonShow, this.onTowerUpgradeBtnShow, this);
    }

    onTouchStart(event: EventTouch) {
        console.log("touch start");
        EventManager.inst.emit(EventName.TouchSceenStart);

        this._lastTouchPos = null;
        if (DataManager.Instance.isGameOver) {
            return;
        }

        //  if(this._checkTowerBtn){
        if (this.checkTowerBtnClick(event)) {
            EventManager.inst.emit(EventName.TowerUpgradeBtnClick);
            return;
        }
        // }

        DataManager.Instance.mainCamera.stopTweenAni();

        if (this._plugBacking || this._pluglinking) {
            this._movingCamera = true;
            return;
        }

        let cameraMain: Camera = DataManager.Instance.mainCamera.camera;
        let ray: geometry.Ray = new geometry.Ray();
        const touchPos = event.getLocation();
        console.log("touchPos:", touchPos);
        cameraMain.screenPointToRay(touchPos.x, touchPos.y, ray);
        // 以下参数可选
        const mask = 1 << 1;
        const maxDistance = 10000000;
        const queryTrigger = true;

        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const plug: Collider = raycastClosestResult.collider;
            if (plug) {
                let plugItem: PlugItem = plug.node.getComponent(PlugItem);
                if (plugItem && plugItem.state == 0) {
                    this._movingPlug = true;
                    DataManager.Instance.nowPlug = plug.node;
                    this._plugStartPos = plug.node.worldPosition.clone();
                    this._plugStartRot = plug.node.getRotation().clone();
                    DataManager.Instance.soundManager.playPlugSound();
                    //更新状态
                    plugItem.state = 1;
                    console.log("move start");
                    return;
                }

            }

            console.log("raycastClosest success");
        } else {
            console.log("no raycastClosest");
        }
        console.log("move camera");
        this._movingCamera = true;
    }

    onTouchMove(event: EventTouch) {
        if (this._lastTouchPos) {
            if (this._movingPlug) {
                this.movePlug(event);
            } else if (this._movingCamera) {
                this.moveCamera(event);
            }
        }

        this._lastTouchPos = event.getLocation();
    }

    //滑动摄像机
    private moveCamera(event: EventTouch) {
        const touchPos = event.getLocation();
        if (!this._lastTouchPos) {
            return;
        }
        let deltaPos = touchPos.clone();
        deltaPos.subtract(this._lastTouchPos);
        deltaPos.x = -deltaPos.x;
        const cameraMain: Camera = DataManager.Instance.mainCamera.camera;
        // 1. 将屏幕滑动向量转换为世界空间移动方向
        const moveDir = this.screenToWorldDirection(deltaPos, cameraMain.node);
        // 2. 保持Y轴不变
        moveDir.y = 0;
        moveDir.normalize();
        // 3. 计算移动距离(应用灵敏度)
        const moveDistance = deltaPos.length() * this.sensitivity;
        // 4. 更新摄像机位置
        let cameraPos = cameraMain.node.getWorldPosition().clone();
        Vec3.scaleAndAdd(cameraPos, cameraPos, moveDir, moveDistance);
        let cameraLimit: Vec4 = DataManager.Instance.cameraLimit;
        cameraPos.x = Math.min(Math.max(cameraPos.x, cameraLimit.y), cameraLimit.x);
        cameraPos.z = Math.min(Math.max(cameraPos.z, cameraLimit.w), cameraLimit.z);
        cameraMain.node.setWorldPosition(cameraPos);
        console.log(`像机的位置 ${cameraMain.node.getPosition()}`)
        //console.log(`camera newPos ${String(cameraPos)}  moveDir ${String(moveDir)}  moveDistance ${moveDistance}`);
    }
    private cameraMoveSpeed: number = 1; // 相机移动速度

    private cameraFoollowPlug(event: EventTouch) {
        const touchPos = event.getLocation();
        if (!this._lastTouchPos) {
            this._lastTouchPos = touchPos.clone();
            // return; // 初始化后不移动摄像机，等待下一次触摸移动
        }

        let deltaPos = touchPos.clone();
        deltaPos.subtract(this._lastTouchPos);
        deltaPos.y = -deltaPos.y;
        const cameraMain: Camera = DataManager.Instance.mainCamera.camera;
        const moveDir = this.screenToWorldDirection(deltaPos, cameraMain.node);
        moveDir.y = 0;
        moveDir.normalize();
        console.log(`this._lastTouchPos ${this._lastTouchPos}`);
        // const minMoveDistance = 1.5; 
        // const moveDistance = Math.max(deltaPos.length() * this.sensitivity * 4, minMoveDistance);
        const minMoveDistance = 0.5;
        const maxMoveDistance = 1; // 限制最大移动距离，防止飞出
        let moveDistance = deltaPos.length() * this.sensitivity * 1;
        moveDistance = Math.min(Math.max(moveDistance, minMoveDistance), maxMoveDistance);

        console.log(`moveDistance ${moveDistance}`);
        let cameraPos = cameraMain.node.getWorldPosition().clone();
        Vec3.scaleAndAdd(cameraPos, cameraPos, moveDir, moveDistance);
        let cameraLimit: Vec4 = DataManager.Instance.cameraLimit;
        cameraPos.x = Math.min(Math.max(cameraPos.x, cameraLimit.y), cameraLimit.x);
        cameraPos.z = Math.min(Math.max(cameraPos.z, cameraLimit.w), cameraLimit.z);
        cameraMain.node.setWorldPosition(cameraPos);
        console.log(`像机的位置111111 ${cameraMain.node.getPosition()}`);

        // 更新_lastTouchPos，保证下一次计算deltaPos正确
        this._lastTouchPos = touchPos.clone();
    }



    //移动插头
    private movePlug(event: EventTouch) {
       
        this.checkTargetSocket();
        //如果足够近直接播动画插上去
        let endWorldPos: Vec3 = MathUtil.worldToLocal(DataManager.Instance.nowSocket.worldPosition, DataManager.Instance.sceneManger.node)//DataManager.Instance.nowSocket.worldPosition;
        let nowPlugPos: Vec3 = MathUtil.worldToLocal(DataManager.Instance.nowPlug.worldPosition, DataManager.Instance.sceneManger.node)
        let distance: number = Vec3.distance(nowPlugPos, endWorldPos);
        //    let endWorldPos: Vec3 = DataManager.Instance.nowSocket.worldPosition;
        //     let distance: number = Vec3.distance(DataManager.Instance.nowPlug.worldPosition, endWorldPos);
        // 4 是最后一个地块，不允许手动解锁
        if(this._nowSocketIndex == 3){
            DataManager.Instance.plugConnectDistance = 3.5;
        }else{
            DataManager.Instance.plugConnectDistance = 6;
        }
        if (distance < DataManager.Instance.plugConnectDistance && DataManager.Instance.leftSocket.indexOf(this._nowSocketIndex) != -1 && this._nowSocketIndex !== 4) {

            console.log("this._nowSocketIndex == ", this._nowSocketIndex);
            let cameraLimit: Vec4 = DataManager.Instance.cameraLimit;
            if (this._nowSocketIndex == 2) { //野兽
                let cameraPos = DataManager.Instance.mainCamera.node.getWorldPosition();
                if (cameraPos.x < cameraLimit.x) {
                    // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                    tween(DataManager.Instance.mainCamera.node)
                        .to(0.8, { worldPosition: new Vec3(cameraLimit.x - 1, cameraPos.y, cameraPos.z) })
                        .start();
                }
            } else if (this._nowSocketIndex == 3) {//野兽 油桶
                let cameraPos = DataManager.Instance.mainCamera.node.getWorldPosition();
                if (cameraPos.x > cameraLimit.y + 5) {
                    // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                    tween(DataManager.Instance.mainCamera.node)
                        .to(0.8, { worldPosition: new Vec3(cameraLimit.y + 5, cameraPos.y, cameraPos.z) })
                        .start();
                }
            } else if (this._nowSocketIndex == 1) {//矿场
                let cameraPos = DataManager.Instance.mainCamera.node.getWorldPosition();
                if (cameraPos.x < cameraLimit.x) {
                    // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                    tween(DataManager.Instance.mainCamera.node)
                        .to(0.8, { worldPosition: new Vec3(cameraLimit.x - 1, cameraPos.y, cameraPos.z) })
                        .start();
                }
            } else if (this._nowSocketIndex == 0) {//农场
                let cameraPos = DataManager.Instance.mainCamera.node.getWorldPosition();
                if (cameraPos.x > cameraLimit.y + 5) {
                    // 使用 tween 实现平滑移动到 x=14，持续时间0.5秒
                    tween(DataManager.Instance.mainCamera.node)
                        .to(0.8, { worldPosition: new Vec3(cameraLimit.y + 5, cameraPos.y, cameraPos.z) })
                        .start();
                }
            }
            this.plugLinkSocket();
            return;
        }
        let plot: number = RopeUtils.getPlotIndexByPos(DataManager.Instance.nowPlug.worldPosition);
        if (plot !== this._lastPlotIndex) {
          //  eventMgr.emit(PlotName[this._lastPlotIndex] + "_cloudFadeIn");
            if (plot === -1) {

            } else {
                eventMgr.emit(PlotName[plot] + "_cloudFadeOut");
            }
            this._lastPlotIndex = plot;
        }
        //屏幕坐标转3d坐标,拖动插头移动
        const touchPos = event.getLocation();

        
        // const cameraMain:Camera = DataManager.Instance.mainCamera.camera;
        // const z:number= this.getDepthByPos(touchPos);
        // let outPos:Vec3 = new Vec3();
        // cameraMain.screenToWorld(new Vec3(touchPos.x,touchPos.y,z),outPos);
        DataManager.Instance.nowPlug.setWorldPosition(this.getPlugPos(touchPos));
        //console.log("move plug",outPos);

        //插头移动方向
        let eulerAngles: Vec3 = DataManager.Instance.plugMoveAngles[this._nowSocketIndex];
        this._plugTartetRot = new Quat();
        Quat.fromEuler(this._plugTartetRot, eulerAngles.x, eulerAngles.y, eulerAngles.z);
        //console.log(`euler ${String(eulerAngles)}  tartetRot ${String(this._plugTartetRot)}`);
        
        if (DataManager.Instance.nowPlug.getRotation().equals(this._plugTartetRot)) {
            this.cameraFoollowPlug(event);
            return;
        }
       
        //转动插头方向
        let moveLen: number = Vec2.distance(touchPos, this._lastTouchPos);
        // 计算旋转步长（转换为弧度）
        const maxAngle = this._plugRotateSpeed * moveLen * Math.PI / 180;
        // 使用球面线性插值(Slerp)
        let currentRot: Quat = DataManager.Instance.nowPlug.getRotation();
        Quat.slerp(
            currentRot,
            currentRot,
            this._plugTartetRot,
            Math.min(1, maxAngle / MathUtil.getAngleBetweenQuats(currentRot, this._plugTartetRot))
        );
        DataManager.Instance.nowPlug.setRotation(currentRot);
         this.cameraFoollowPlug(event);
        
    }

    onTouchEnd(event: EventTouch) {
        console.log("touch end");
        if (this._movingPlug) {
            this._movingPlug = false;
            //处理插头、插座 弹回去 在此期间不能操作插头
            this._plugBacking = true;
            let endPos: Vec3 = this._plugStartPos.clone();
            tween(DataManager.Instance.nowPlug).to(1, { worldPosition: endPos, rotation: this._plugStartRot }, { easing: "cubicOut" }).call(() => {
                let plugItem: PlugItem = DataManager.Instance.nowPlug.getComponent(PlugItem);
                if (plugItem) {
                    plugItem.state = 0;
                }
                this.cleanNowPlug();
                this._plugBacking = false;
            }).start();

            if (this._lastPlotIndex !== -1) {
                //云恢复
              //  eventMgr.emit(PlotName[this._lastPlotIndex] + "_cloudFadeIn");
                this._lastPlotIndex = -1;
            }
        } else {
            this._movingCamera = false;
        }
    }

    private plugLinkSocket() {
        this._movingPlug = false;
        this._pluglinking = true;
        let nowPlug: Node = DataManager.Instance.nowPlug;
        DataManager.Instance.ropeManager.plugLinkSocket(this._nowSocketIndex, nowPlug);
    }



    private cleanNowPlug() {
        DataManager.Instance.nowPlug = null;
        this._plugStartPos = null;
        this._plugStartRot = null;
        DataManager.Instance.nowSocket = null;
        this._nowSocketIndex = -1;
        this._plugTartetRot = null;
        this._lastPlotIndex = -1;
    }

    private getDepthByPos(pos: Vec2): number {
        let z: number = 0;
        //世界坐标
        let startWorldPos: Vec3 = this._plugStartPos.clone();
        let endWorldPos: Vec3 = DataManager.Instance.nowSocket.getWorldPosition().clone();

        if (startWorldPos && endWorldPos) {
            const cameraMain: Camera = DataManager.Instance.mainCamera.camera;
            //相机深度比值
            const startDepth: number = TransformPositionUtil.getDepthRatio(cameraMain, startWorldPos);
            const endDepth: number = TransformPositionUtil.getDepthRatio(cameraMain, endWorldPos);
            //屏幕坐标
            const startSceenPos: Vec3 = cameraMain.worldToScreen(startWorldPos);
            const endSceenPos: Vec3 = cameraMain.worldToScreen(endWorldPos);
            //插头距离比值
            const ropePosRatio: number = TransformPositionUtil.getProjectionRatio(
                new Vec2(startSceenPos.x, startSceenPos.y),
                new Vec2(endSceenPos.x, endSceenPos.y),
                new Vec2(pos.x, pos.y));
            //插头深度
            z = ropePosRatio * (endDepth - startDepth) + startDepth;
        } else {
            console.log("socketPos or plugStartPos is null", startWorldPos, endWorldPos);
        }
        return z;
    }



    //计算Y轴高度，基于距离原点的水平距离
    // public calculateHeight(x: number, z: number): number {

    //     let maxDistance = 13;
    //     let minDistance = 4;

    //     // 计算水平距离（忽略y轴）
    //     const distance = Math.sqrt(x * x + z * z);
    //     if(distance<minDistance){
    //         return 11;
    //     }
    //     // 限制最大距离为10
    //     const normalizedDistance = Math.min(distance, maxDistance);

    //     // 高度计算：距离0时最高，距离10时最低(3)
    //     // 你可以调整这个公式来改变高度曲线
    //     const height = 11 - (7 * (normalizedDistance - minDistance) / (maxDistance-minDistance));

    //     return height;
    // }

    //2d 转3d坐标
    private getPlugPos(pos: Vec2): Vec3 {
        const camera: Camera = DataManager.Instance.mainCamera.camera;
        const ray: geometry.Ray = camera.screenPointToRay(pos.x, pos.y);
        const lastPos = DataManager.Instance.nowPlug.worldPosition.clone();

        // 计算射线上距离lastPos最近的点
        const closestPoint = this.getClosestPointOnRay(ray, lastPos);

        // 应用高度计算
        closestPoint.y = this.calculateHeight(closestPoint.x, closestPoint.z);

        console.log("closestPoint == ", new Vec3(
            (closestPoint.x - lastPos.x) * 0.3,
            (closestPoint.y - lastPos.y) * 0.3,
            (closestPoint.z - lastPos.z) * 0.3
        ))

        // 添加平滑过渡 (可选)
        return new Vec3(
            lastPos.x + (closestPoint.x - lastPos.x) * 0.5,
            lastPos.y + (closestPoint.y - lastPos.y) * 0.5,
            lastPos.z + (closestPoint.z - lastPos.z) * 0.5
        );
    }

    /**
     * 计算射线上距离目标点最近的点
     */
    private getClosestPointOnRay(ray: geometry.Ray, targetPoint: Vec3): Vec3 {
        // 计算射线方向向量
        const rayDirection = ray.d.normalize();

        // 计算从射线起点到目标点的向量
        const rayToPoint = Vec3.subtract(new Vec3(), targetPoint, ray.o);

        // 计算投影长度
        const projection = Vec3.dot(rayToPoint, rayDirection);

        // 如果投影为负，说明最近点是射线起点
        if (projection <= 0) {
            return ray.o.clone();
        }

        // 返回射线上最近的点
        return ray.o.add(rayDirection.multiplyScalar(projection));
    }

    /**
     * 改进的高度计算函数
     */
    private calculateHeight(x: number, z: number): number {
        const distance = Math.sqrt(x * x + z * z);
        const normalizedDistance = Math.min(distance, 15);
        //console.log("distance",distance,"normalizedDistance",normalizedDistance);
        // 使用平滑的曲线过渡
        const height = 4 + (6 * (1 - normalizedDistance / 15) * (1 - normalizedDistance / 15));
        return height;
    }



    //检查范围内插座、更新目标插头
    private checkTargetSocket() {
        //  let pos: Vec3 = DataManager.Instance.nowPlug.worldPosition.clone();
        let pos: Vec3 = MathUtil.worldToLocal(DataManager.Instance.nowPlug.worldPosition.clone(), DataManager.Instance.sceneManger.node)//DataManager.Instance.nowSocket.worldPosition;

        // pos.x -= 5;
        // pos.z += 5;
        let index: number = 0;
        if (pos.x > Math.abs(pos.z)) {
            index = 1;
        } else if (pos.z > Math.abs(pos.x)) {
            index = 2;
        } else if (-pos.x > Math.abs(pos.z)) {
            index = 3;
        }
        DataManager.Instance.nowSocket = DataManager.Instance.socketNodes[index];
        this._nowSocketIndex = index;
        //console.log("find socket",DataManager.Instance.nowSocket.worldPosition);
    }

    /**
     * 将屏幕滑动方向转换为世界空间方向
     */
    private screenToWorldDirection(screenDelta: Vec2, cameraNode: Node): Vec3 {
        // 获取摄像机变换方向

        // 屏幕右方向对应世界空间的摄像机右方向
        const cameraRight = new Vec3();
        Vec3.transformQuat(cameraRight, Vec3.RIGHT, cameraNode.worldRotation);
        cameraRight.y = 0;
        cameraRight.normalize();

        // 屏幕上方向对应世界空间的摄像机前方向(去掉Y分量)
        const cameraForward = new Vec3();
        Vec3.transformQuat(cameraForward, Vec3.FORWARD, cameraNode.worldRotation);
        cameraForward.y = 0;
        cameraForward.normalize();

        // 组合世界空间移动方向
        const worldDir = new Vec3();
        Vec3.scaleAndAdd(worldDir, worldDir, cameraRight, screenDelta.x);
        Vec3.scaleAndAdd(worldDir, worldDir, cameraForward, -screenDelta.y); // 屏幕Y轴与世界Z轴相反

        return worldDir;
    }

    private onPlugStateUpdate(state: number) {
        if (state === 2 && this._pluglinking) {
            this.cleanNowPlug();
            this._pluglinking = false;
        }
    }

    private onTowerUpgradeBtnShow() {
        this._checkTowerBtn = true;
    }

    private checkTowerBtnClick(event: EventTouch) {
        let cameraMain: Camera = DataManager.Instance.mainCamera.camera;
        let ray: geometry.Ray = new geometry.Ray();
        const touchPos = event.getLocation();
        console.log("touchPos:", touchPos);
        cameraMain.screenPointToRay(touchPos.x, touchPos.y, ray);
        // 以下参数可选
        const mask = 1 << 2;
        const maxDistance = 10000000;
        const queryTrigger = true;

        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            return true;
        }
        return false;
    }
}


