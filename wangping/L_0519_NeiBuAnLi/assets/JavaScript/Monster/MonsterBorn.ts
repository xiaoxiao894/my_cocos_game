import { Camera, geometry, PhysicsSystem, Vec2, Vec3, view } from "cc";
import { DataManager } from "../Global/DataManager";

/**
 * 怪出生坐标计算
 */
export default class MonsterBorn {

    private static xBoundary = 30;
    private static zBoundary = 30;

    //怪出生世界坐标
    public static getWorldBornPos(): Vec3 {
        //有效范围
        let fixedY: number = 1;

        //随机角度
        let radAngle: number = this.randomAngle();
        //console.log(`monster radAngle ${radAngle}`);
        let cameraMain: Camera = DataManager.Instance.mainCamera.camera;


        let uiPos: Vec2 = this.getRayRectangleIntersection(radAngle);
        if (uiPos) {
            //console.log(`monster sceenPos ${uiPos.x} ${uiPos.y}`);
            let ray: geometry.Ray = new geometry.Ray();
            cameraMain.screenPointToRay(uiPos.x, uiPos.y, ray);
            //cameraMain.screenPointToRay(view.getViewportRect().width/2,view.getViewportRect().height/2,ray);
            // 以下参数可选
            const mask = 0xffffffff;
            const maxDistance = 10000000;
            const queryTrigger = true;

            if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
                const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
                const hitPoint = raycastClosestResult.hitPoint;
                //console.log(`monster worldPos ${hitPoint}`);   
                //pos.y = fixedY;
                return hitPoint;
            } else {
                console.log("no raycastClosest");
            }
        } else {
            console.log("no sceenPos");
        }

        return null;

    }

    /**
     * 随机角度
     * @returns radAngle 弧度
     */
    private static randomAngle(): number {
        // //地图边界判断
        // let playerPos = DataManager.Instance.player.node.worldPosition;
        // //console.log(playerPos);

        // const isXBoundary = Math.abs(playerPos.x) > this.xBoundary;
        // const isZBoundary = Math.abs(playerPos.z) > this.zBoundary;

        // // 情况1：同时处于X和Z边界（角落区域）
        // if (isXBoundary && isZBoundary) {
        //     if (playerPos.x > this.xBoundary && - playerPos.z > this.zBoundary) {
        //         // 第一象限角落：生成 (π 到 3π/2) 的弧度，使cos和sin都为负（左下）
        //         return Math.random() * Math.PI/2 + Math.PI;
        //     } else if (playerPos.x > this.xBoundary && - playerPos.z < -this.zBoundary) {
        //         // 第四象限角落：生成 (π/2 到 π) 的弧度，使cos为负，sin为正（左上）
        //         return Math.random() * Math.PI/2 + Math.PI/2;
        //     } else if (playerPos.x < -this.xBoundary && - playerPos.z > this.zBoundary) {
        //         // 第二象限角落：生成 (3π/2 到 2π) 的弧度，使cos为正，sin为负（右下）
        //         return Math.random() * Math.PI/2 + 3*Math.PI/2;
        //     } else {
        //         // 第三象限角落：生成 (0 到 π/2) 的弧度，使cos和sin为正（右上）
        //         return Math.random() * Math.PI/2;
        //     }
        // }
        // // 情况2：仅X轴边界
        // else if (isXBoundary) {
        //     if (playerPos.x > this.xBoundary) {
        //         // x > 正边界：生成 (π/2 到 3π/2) 的弧度，使cos为负（向左移动）
        //         return Math.random() * Math.PI + Math.PI/2;
        //     } else {
        //         // x < 负边界：生成 (-π/2 到 π/2) 的弧度，使cos为正（向右移动）
        //         return Math.random() * Math.PI - Math.PI/2;
        //     }
        // }
        // // 情况3：仅Z轴边界
        // else if (isZBoundary) {
        //     if (- playerPos.z > this.zBoundary) {
        //         // z > 正边界：生成 (π 到 2π) 的弧度，使sin为负（向下移动）
        //         return Math.random() * Math.PI + Math.PI;
        //     } else {
        //         // z < 负边界：生成 (0 到 π) 的弧度，使sin为正（向上移动）
        //         return Math.random() * Math.PI;
        //     }
        // }
        // // 情况4：不在边界附近，完全随机
        // else {
        //     return Math.random() * Math.PI * 2; // 0 到 2π
        // }

        const pos = DataManager.Instance.player.node.worldPosition;
        //console.log(pos);
        const x = pos.x, z = -pos.z; // 注意z轴取反

        // 计算指向中心的基准角度
        const centerAngle = Math.atan2(z, x) + Math.PI;

        // 确定边界条件
        const atXBoundary = Math.abs(x) > this.xBoundary;
        const atZBoundary = Math.abs(z) > this.zBoundary;

        // 计算随机角度范围
        if (atXBoundary && atZBoundary) {
            // 角落区域：中心角度±π/4范围
            return centerAngle + (Math.random() - 0.5) * Math.PI / 2;
        } else if (atXBoundary) {
            // X边界：确保cos方向正确
            return x > 0
                ? Math.PI / 2 + Math.random() * Math.PI   // π/2 到 3π/2(左)
                : -Math.PI / 2 + Math.random() * Math.PI;            // -π/2 到 π/2(右)
        } else if (atZBoundary) {
            // Z边界：确保sin方向正确
            return z > 0
                ? Math.PI + Math.random() * Math.PI // π 到 2π(下)
                : Math.random() * Math.PI;  // 0 到 π(上)
        }

        // 无边界限制：完全随机
        return Math.random() * Math.PI * 2;
    }

    private static getRayRectangleIntersection(angle: number): Vec2 | null {
        //x cos y sin
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const screen = view.getVisibleSize();
        // 矩形边界范围（假设矩形是轴对齐的）
        const bounder: number = 20;
        const xMin = 0 - bounder;
        const xMax = screen.width + bounder;
        const yMin = 0 - bounder;
        const yMax = screen.height + bounder;

        // 处理极端情况
        const epsilon = 0.0001;

        // 从屏幕中心发射射线
        const rayOrigin = new Vec2(screen.width / 2, screen.height / 2);
        let nearestT = Infinity;
        let intersection: Vec2 | null = null;

        // 处理完全垂直或水平的射线
        if (Math.abs(cosA) < epsilon) { // 垂直射线
            return new Vec2(0, sinA > 0 ? yMax : yMin);
        }
        if (Math.abs(sinA) < epsilon) { // 水平射线
            return new Vec2(cosA > 0 ? xMax : xMin, 0);
        }

        // 右边界 x = xMax
        const tRight = (xMax - rayOrigin.x) / cosA;
        const yRight = rayOrigin.y + tRight * sinA;
        if (tRight > epsilon && yRight >= yMin && yRight <= yMax && tRight < nearestT) {
            nearestT = tRight;
            intersection = new Vec2(xMax, yRight);
        }
        // 左边界 x = xMin
        const tLeft = (xMin - rayOrigin.x) / cosA;
        const yLeft = rayOrigin.y + tLeft * sinA;
        if (tLeft > epsilon && yLeft >= yMin && yLeft <= yMax) {
            nearestT = tLeft;
            intersection = new Vec2(xMin, yLeft);
        }
        // 上边界 y = yMax
        const tTop = (yMax - rayOrigin.y) / sinA;
        const xTop = rayOrigin.x + tTop * cosA;
        if (tTop > epsilon && xTop >= xMin && xTop <= xMax && tTop < nearestT) {
            nearestT = tTop;
            intersection = new Vec2(xTop, yMax);
        }

        // 下边界 y = yMin
        const tBottom = (yMin - rayOrigin.y) / sinA;
        const xBottom = rayOrigin.x + tBottom * cosA;
        if (tBottom > epsilon && xBottom >= xMin && xBottom <= xMax && tBottom < nearestT) {
            nearestT = tBottom;
            intersection = new Vec2(xBottom, yMin);
        }

        return intersection;
    }
}