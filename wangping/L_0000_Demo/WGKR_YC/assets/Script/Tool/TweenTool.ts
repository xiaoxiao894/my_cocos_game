import { Color, Node, sp, Sprite, Tween, tween, UIOpacity, v3, Vec3 } from "cc";

export default class TweenTool {
    private static temp: Vec3 = new Vec3();
    public static scaleShake(node: Node, delay: number = 0, time: number = 0.1, off: Vec3 | number = Vec3.ONE) {
        this.temp.set(node.scale);
        let scale = this.temp.clone();
        let scaleOffX: number;
        let scaleOffY: number;
        let scaleOffZ: number;
        if (off instanceof Vec3) {
            scaleOffX = scale.x + scale.x * off.x * 0.2;
            scaleOffY = scale.y + scale.y * off.y * 0.2;
            scaleOffZ = scale.z + scale.z * off.z * 0.2;
        } else {
            scaleOffX = scale.x + scale.x * off;
            scaleOffY = scale.y + scale.y * off;
            scaleOffZ = scale.z + scale.z * off;
        }
        return tween(node).delay(delay).to(time * 0.9, { scale: v3(scaleOffX, scaleOffY, scaleOffZ) }).to(time * 0.1, { scale: scale }).start();
    }

    public static scaleShake2(node: Node, delay: number = 0, time: number = 0.1, off: Vec3 | number = Vec3.ONE) {
        this.temp.set(node.scale);
        let scale = this.temp.clone();
        let scaleOffX: number;
        let scaleOffY: number;
        let scaleOffZ: number;
        if (off instanceof Vec3) {
            scaleOffX = scale.x + off.x;
            scaleOffY = scale.y + off.y;
            scaleOffZ = scale.z + off.z;
        } else {
            scaleOffX = scale.x + off;
            scaleOffY = scale.y + off;
            scaleOffZ = scale.z + off;
        }
        return tween(node).delay(delay).to(time * 0.9, { scale: v3(scaleOffX, scaleOffY, scaleOffZ) }).to(time * 0.1, { scale: scale }).start();
    }



    public static aplAni(node: UIOpacity, num: number) {
        return tween(node).to(0.2, { opacity: num }).start();
    }


    public static beatAni(node: Node, s: number, off: number = 0.15, callback: Function = null) {
        let v2 = new Vec3(s, s);
        let v3 = new Vec3(s + off, s + off, 0);
        tween(node).to(0.1, { scale: v3 }).to(0.1, { scale: v2 })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }

    public static beatAni2(node: Node, ss: number, es: number, intervalTime: number = 0.1) {
        let ess = es;
        if (es < 0) {
            ess = -es;
        }
        let sv3 = new Vec3(ss, ss, 0);
        node.setScale(sv3);
        let ev3 = new Vec3(ess, es, 0);
        tween(node).to(intervalTime, { scale: ev3 }, { easing: "backInOut" }).start();
        // console.log("beatAni2");
    }


    public static move(node: Node, endPos: Vec3, time: number, callback: Function = null) {
        tween(node).to(time, { position: endPos }).call(callback && callback()).start();
    }

    public static scale(node: Node, startScale: Vec3, endScale: Vec3, intervalTime: number, repeatTime: number = 1, callback: Function = null) {
        node.setScale(startScale);
        if (repeatTime == -1) {
            tween(node)
                .to(intervalTime, { scale: endScale })
                .to(intervalTime, { scale: startScale })
                .union()
                .repeatForever().start();
        }
        else if (repeatTime > 0) {
            tween(node)
                .to(intervalTime, { scale: endScale })
                .to(intervalTime, { scale: startScale })
                .union()
                .repeat(repeatTime).call(callback && callback()).start();
        }
    }

    public static jumpMove(node: Node, endPos: Vec3, time: number, callback: Function, jumpHeight: number = 100) {
        const startPos = node.position.clone(); // 起点
        const destPos = endPos; // 终点
        const middlePos = new Vec3((startPos.x + endPos.x) / 2, TweenTool.max(startPos.y, endPos.y) + jumpHeight, 0); // 中间点（抛物线顶点）

        // 二次贝塞尔曲线公式
        const twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            const x = (1 - t) ** 2 * p1.x + 2 * t * (1 - t) * cp.x + t ** 2 * p2.x;
            const y = (1 - t) ** 2 * p1.y + 2 * t * (1 - t) * cp.y + t ** 2 * p2.y;
            return new Vec3(x, y, 0);
        };

        tween(node.position)
            .to(time, destPos, {
                onUpdate: (target: Vec3, ratio: number) => {
                    node.setPosition(twoBezier(ratio, startPos, middlePos, destPos));
                }
            })
            .call(callback && callback())
            .start();
    }

    public static spFlashColor(sp: Sprite | sp.Skeleton, intervalTime: number, repeatTime: number = 1, flashColor: Color = new Color(255, 0, 0, 255)) {
        if (!sp || !sp.node || intervalTime <= 0 || repeatTime <= 0) {
            return;
        }
        sp.color.set(255, 255, 255, 255);
        // Tween.stopAllByTarget(sp);
        tween(sp)
            .set({ color: flashColor })
            .delay(intervalTime)
            .set({ color: Color.WHITE })
            .delay(intervalTime)
            .union()
            .repeat(repeatTime)
            .start();

    }

    public static shakeNode(node: Node, tweenDuration: number = 0.02, repeatTime: number = 1, shakeScale: number = 1) {
        let startPos = node.position.clone();
        let posArray = [
            new Vec3(5, 7, 0),
            new Vec3(-6, 7, 0),
            new Vec3(-13, 3, 0),
            new Vec3(3, -6, 0),
            new Vec3(-5, 5, 0),
            new Vec3(2, -8, 0),
            new Vec3(-8, -10, 0),
            new Vec3(3, 10, 0),
        ];
        posArray.forEach((v, i) => {
            v.x *= shakeScale;
            v.x += startPos.x;

            v.y *= shakeScale;
            v.y += startPos.y;

            v.z += startPos.z;
        });
        posArray.sort(() => {
            return Math.random() - 0.5;
        });

        let t = tween(node)
            .to(tweenDuration, { position: posArray[0] })
            .to(tweenDuration, { position: posArray[1] })
            .to(tweenDuration, { position: posArray[2] })
            .to(tweenDuration, { position: posArray[3] })
            .to(tweenDuration, { position: posArray[4] })
            .to(tweenDuration, { position: posArray[5] })
            .to(tweenDuration, { position: posArray[6] })
            .to(tweenDuration, { position: posArray[7] })
            .to(tweenDuration, { position: startPos })
            .repeat(repeatTime)
            .union()
            .start();
    }

    public static min(a: number, b: number) {
        return a < b ? a : b;
    }

    public static max(a: number, b: number) {
        return a > b ? a : b;
    }
}