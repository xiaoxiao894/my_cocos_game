import { _decorator, Camera, Component, easing, Node, Tween, tween, Vec3 } from 'cc';
import { BuildingType, CommonEvent, GameResult } from '../common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('MainCamera')
export class MainCamera extends Component {
    @property({type: Node, displayName: '相机父节点'})
    private cameraParent: Node = null!;
    @property(Camera)
    private camera: Camera = null!;

    private isShaking = false;
    private isFollowHero = false;

    private heroPos: Vec3 = new Vec3();

    onLoad() {
        app.event.on(CommonEvent.HerMove, this.onHeroMove, this);
        app.event.on(CommonEvent.GameOver, this.onGameOver, this);
        app.event.on(CommonEvent.ShakeCamera, this.onShakeCamera, this);

        this.camera.orthoHeight = 30;

        tween(this.camera)
            .to(1, {
                orthoHeight: 17
            },{easing: easing.quintOut})
            .delay(2)
            .call(() => {
                tween(this.cameraParent)
                    .to(1, {
                        position: this.heroPos.add(new Vec3(0, 30, 30))
                    },{easing: easing.sineOut})
                    .call(() => {
                        this.isFollowHero = true;
                        app.event.emit(CommonEvent.CameraAniEnd)
                    })
                    .start();
            })
            .start();
    }

    onDestroy() {
        app.event.off(CommonEvent.HerMove, this);
        app.event.off(CommonEvent.UnlockItem, this);
        app.event.off(CommonEvent.ShakeCamera, this);
    }

    private onShakeCamera(data: {intensity: number, duration: number, source: Node}) {
        if (this.isSourceInCameraView(data.source)) {
            this.shake(data?.intensity, data?.duration);
        }
    }

    /**
     * 判断震动源是否在摄像机可见范围内
     * @param source 震动源节点
     * @returns 是否在可见范围内
     */
    private isSourceInCameraView(source: Node): boolean {
        if (!source || !this.camera) return false;
        
        // 获取相机和震动源的世界坐标
        const cameraPos = this.camera.node.getWorldPosition();
        const sourcePos = source.getWorldPosition();
        
        // 计算距离
        const distance = Vec3.distance(cameraPos, sourcePos);
        
        // 设置可见距离范围（可以根据需要调整）
        const maxDistance = 100;  // 最大震动距离
        
        if (distance > maxDistance) {
            return false;
        }
        
        // 使用相机的屏幕坐标转换来判断是否在视锥体内
        const screenPos = this.camera.worldToScreen(sourcePos);
        
        // 获取屏幕尺寸 - 使用更简单的固定值或相机的渲染范围
        const screenWidth = 1280;  // 可以根据项目设置调整
        const screenHeight = 720;  // 可以根据项目设置调整
        
        // 判断是否在屏幕范围内（包含一定的边界扩展）
        const margin = 100; // 边界扩展，允许稍微超出屏幕的物体也能触发震动
        return screenPos.x >= -margin && 
               screenPos.x <= screenWidth + margin && 
               screenPos.y >= -margin && 
               screenPos.y <= screenHeight + margin;
    }
    
    private onHeroMove(heroPos: Vec3) {
        this.heroPos = heroPos;
        if(!this.isFollowHero) return;
        this.cameraParent.setWorldPosition(this.heroPos.add(new Vec3(0, 30, 30)));
        app.event.emit(CommonEvent.CameraMove, this.cameraParent.getWorldPosition());
    }

    private onGameOver( result: GameResult) {
        if(result === GameResult.Win) {
            tween(this.node)
                .to(1.2, {
                    position: new Vec3(-4.5, 100, 155)
                },{easing: easing.quintOut})
                .start();
            tween(this.camera)
                .to(1.2, {
                    fov: 40
                },{easing: easing.quintOut})
                .start();
        };
    }

    /**
     * 屏幕震动效果
     * @param intensity 震动强度 (默认: 5)
     * @param duration 震动持续时间 (默认: 0.5秒)
     * @param frequency 震动频率 (默认: 20次/秒)
     */
    public shake(intensity: number = 5, duration: number = 0.08) {
        if (this.isShaking) {
            Tween.stopAllByTarget(this.camera.node);
            this.camera.node.setPosition(Vec3.ZERO);
        };
        this.isShaking = true;
        
        tween(this.camera.node)
            .to(duration/2, {
                position: new Vec3(0, intensity, 0)
            },{easing: easing.cubicOut})
            .to(duration/2, {
                position: new Vec3(0, 0, 0)
            },{easing: easing.cubicIn})
            .call(() => {
                this.isShaking = false;
            })
            .start();
    }

    /**
     * 停止震动
     */
    public stopShake() {
        this.isShaking = false;
        this.camera.node.setPosition(Vec3.ZERO);
    }
}


