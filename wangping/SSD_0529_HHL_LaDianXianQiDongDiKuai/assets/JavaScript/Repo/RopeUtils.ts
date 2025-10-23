import { Vec3 } from "cc";
import { DataManager } from "../Global/DataManager";
import { MathUtil } from "../Utils/MathUtils";

export default class RopeUtils {
    // 根据坐标获取当前所处的地块索引 -1中间地块
    public static getPlotIndexByPos(pos: Vec3): number {
        pos = MathUtil.worldToLocal(pos, DataManager.Instance.sceneManger.node)
        let len: number = DataManager.Instance.cloudHideDistance;
        if (pos.x > len - 4) {
            if (pos.z < -len) {
                //伐木场
                return 4;
            } else if (pos.z < len) {
                //矿场
                return 1;
            }
        } else if (pos.x > -len + 2) {
            if (pos.z < -len + 4) {
                //农场
                return 0;
            } else if (pos.z > len) {
                //电厂
                return 2;
            }
        } else {
            if (pos.z > len) {
                //左下角动物地块
                return 5;
            } else if (pos.z > -len) {
                //左边油田
                return 3;
            }
        }
        return -1;
    }
}