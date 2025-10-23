
import { _decorator, Component, Node, tween, Vec3, easing, UITransform, Vec2, Material, MeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopShakeEffect')
export class TopShakeEffect extends Component {
    @property(Material)
    public baseMaterial:Material = null;
    @property(Material)
    public redMaterial:Material = null;

    meshRender:MeshRenderer = null;
    // 晃动幅度（角度）
    @property({ tooltip: '晃动角度幅度' })
    public angleAmplitude: number = 8;

    @property({ tooltip: '单次晃动周期（秒）' })
    public duration: number = 0.2;

    @property({ tooltip: '是否自动开始晃动' })
    public autoStart: boolean = true;

    @property({ tooltip: '自动启动时的晃动次数，0表示无限循环' })
    public autoShakeCount: number = 0;

    @property({ tooltip: '晃动轴（通常是X或Z）' })
    public shakeAxis: 'X' | 'Y' | 'Z' = 'Z';

    // 晃动中心点（0表示底部，1表示顶部）
    @property({ tooltip: '晃动中心点（0-1）' })
    public pivotPoint: number = 0.0;

    // 初始旋转
    private _originalRotation: Vec3 = new Vec3();
    // 当前是否正在晃动
    private _isShaking: boolean = false;
    // 晃动完成回调
    private _shakeCompleteCallback: Function = null;

    onLoad() {
        // 记录初始旋转
        this._originalRotation.set(this.node.eulerAngles);
        
        // 设置锚点以控制旋转中心
        if (this.node.getComponent(UITransform)) {
            this.node.getComponent(UITransform).anchorPoint = new Vec2(0.5, this.pivotPoint);
        }
    }

    start() {
        if (this.autoStart) {
            this.shake(this.autoShakeCount);
        }
    }

    /**
     * 开始晃动
     * @param count 晃动次数，0表示无限循环
     * @param callback 晃动完成回调
     */
    public shake(count: number = 0, isMaterial?:Boolean,callback?: Function) {
       this.meshRender =  this.node.children[0].getComponent(MeshRenderer)
       if (this.redMaterial){
             this.meshRender.setMaterial(this.redMaterial,0);
       }
      
        // 如果正在晃动，先停止
        if (this._isShaking) {
            this.stopShake();
        }
        
        this._isShaking = true;
        this._shakeCompleteCallback = callback;
        
        // 创建一个左右晃动的补间动画
        let targetRot1 = new Vec3();
        let targetRot2 = new Vec3();
        
        // 根据选择的轴设置旋转角度
        switch (this.shakeAxis) {
            case 'X':
                targetRot1.set(this._originalRotation.x + this.angleAmplitude, this._originalRotation.y, this._originalRotation.z);
                targetRot2.set(this._originalRotation.x - this.angleAmplitude, this._originalRotation.y, this._originalRotation.z);
                break;
            case 'Y':
                targetRot1.set(this._originalRotation.x, this._originalRotation.y + this.angleAmplitude, this._originalRotation.z);
                targetRot2.set(this._originalRotation.x, this._originalRotation.y - this.angleAmplitude, this._originalRotation.z);
                break;
            case 'Z':
            default:
                targetRot1.set(this._originalRotation.x, this._originalRotation.y, this._originalRotation.z + this.angleAmplitude);
                targetRot2.set(this._originalRotation.x, this._originalRotation.y, this._originalRotation.z - this.angleAmplitude);
                break;
        }

        // 创建单次晃动的tween
        const singleShake = tween(this.node)
            .to(this.duration / 2, { eulerAngles: targetRot1 }, { easing: easing.sineOut })
            .to(this.duration / 2, { eulerAngles: targetRot2 }, { easing: easing.sineIn })
            .to(this.duration / 4, { eulerAngles: this._originalRotation }, { easing: easing.sineOut });
        
        // 根据次数决定是循环还是执行有限次
        if (count <= 0) {
            // 无限循环
            singleShake.union().repeatForever().start();
        } else {
            // 有限次数
            tween(this.node)
                .call(() => {
                    this._isShaking = true;
                })
                .repeat(count, singleShake)
                .call(() => {
                    this._isShaking = false;
                    if(this.baseMaterial){
                         this.meshRender.setMaterial(this.baseMaterial,0);
                    }
                    
                    if (this._shakeCompleteCallback) {
                        this._shakeCompleteCallback();
                        this._shakeCompleteCallback = null;
                    }
                })
                .start();
        }
    }

    /**
     * 停止晃动，回到初始位置
     */
    public stopShake() {
        
        tween(this.node).stop();
        this.node.eulerAngles = this._originalRotation;
        this._isShaking = false;
        
        if (this._shakeCompleteCallback) {
            this._shakeCompleteCallback();
            this._shakeCompleteCallback = null;
        }
    }

    /**
     * 检查是否正在晃动
     */
    public isShaking(): boolean {
        return this._isShaking;
    }
}