import { v2, v3, Vec2, Vec3 } from "cc"

export default class RVOUtils {
    public static simpleV2(value, out?: Vec2) {
        if (out) {
            out.set(value, value)
            return out
        }
        return v2(value, value)
    }

    public static simpleV3(value, out?: Vec3) {
        if (out) {
            out.set(value, value, value)
            return out
        }
        return v3(value, value, value)
    }

    public static v2t3(v2Data: Vec2, out?: Vec3) {
        if (!out) {
            return v3(v2Data.x, v2Data.y, 1)
        } else {
            out.x = v2Data.x
            out.y = 0
            out.z = v2Data.y
            return out
        }
    }

    public static v3t2(v3Data: Vec3, out?: Vec2) {
        if (!out) {
            return v2(v3Data.x, v3Data.z)
        } else {
            out.x = v3Data.x
            out.y = v3Data.z
            return out
        }
    }
}