import { _decorator, Component, gfx, renderer, Material, Texture2D, SkinnedMeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 溶解效果组件
 * 用于控制3D模型的溶解动画效果，支持多种溶解模式
 */
@ccclass('Dissolve')
export class Dissolve extends Component {
    @property({
        type: SkinnedMeshRenderer,
        displayName: '蒙皮网格渲染器',
        tooltip: '用于渲染3D模型'
    })
    mr: SkinnedMeshRenderer | null = null;

    @property({
        type: Texture2D,
        displayName: '第一个噪声纹理',
        tooltip: '用于溶解效果的噪声采样'
    })
    txtNoise1: Texture2D | null = null;

    @property({
        type: Texture2D,
        displayName: '第二个噪声纹理',
        tooltip: '用于不同溶解模式的噪声采样'
    })
    txtNoise2: Texture2D | null = null;

    @property({
        displayName: 'passIndex',
        tooltip: '溶解效果的pass索引'
    })
    passIndex: number = 0;

    /**
     * 第一种溶解状态标记
     */
    private dissolve: boolean = false;
    
    /**
     * 第二种溶解状态标记（当前未使用）
     */
    private dissolve2: boolean = false;

    /**
     * 溶解阈值参数的句柄，用于uniform传递
     */
    private dissolveThresholdHandle: number = -1;
    
    /**
     * 溶解方向类型参数的句柄，用于uniform传递
     */
    private dissolveThresholdTyeHandle: number = -1;
    
    /**
     * 溶解类型2参数的句柄，用于uniform传递
     */
    private dissolveType2Handle: number = -1;
    
    /**
     * 溶解噪声贴图绑定的句柄，用于纹理绑定
     */
    private dissolveNoiseMapBinding: number = -1;
    
    /**
     * 当前溶解阈值，范围0-1，控制溶解程度
     */
    private dissolveThreshold: number = 0.0;

    start () {
        // 组件启动时的初始化
    }

    /**
     * 每帧更新，处理溶解动画的进度
     * @param deltaTime 帧间隔时间
     */
    update (deltaTime: number) {
        if (this.mr?.materials) {
            // 处理第一个材质的溶解效果
            let pass = this.mr?.materials[0]?.passes[this.passIndex];
            if (pass) {
                if (this.dissolve) {
                    // 以每秒0.5的速度增加溶解阈值
                    this.dissolveThreshold += 0.5 * deltaTime;
                    if (this.dissolveThreshold > 1) {
                        // 超过1时重置为0，实现循环效果
                        this.dissolveThreshold = 1;
                    }
                }
                this.processPass(pass);
            }

            // 处理第二个材质的溶解效果（如果存在）
            pass = this.mr?.materials[1]?.passes[this.passIndex];
            if (pass) {
                this.processPass(pass);
            }

            // 当溶解阈值归零时，停止溶解动画
            if (0 == this.dissolveThreshold) {
                this.dissolve = false;
            }
        }
    }

    reset() {
        this.dissolve = false;
        this.dissolve2 = false;
        this.dissolveThreshold = 0.0;

        // 重置材质
        if (this.mr?.materials) {
            // 重置第一个材质
            let pass = this.mr?.materials[0]?.passes[this.passIndex];
            if (pass) {
                this.preFetchHandles(pass);
                // 重置溶解阈值为0
                pass.setUniform(this.dissolveThresholdHandle, 0.0);
                // 重置溶解方向参数为0
                pass.setUniform(this.dissolveThresholdTyeHandle, 0.0);
                // 重置溶解类型2参数为0
                pass.setUniform(this.dissolveType2Handle, 0.0);
                // 如果有默认噪声纹理，可以绑定第一个，否则保持当前绑定
                if (this.txtNoise1) {
                    pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise1?.getGFXTexture()!);
                }
                pass.update();
            }

            // 重置第二个材质（如果存在）
            pass = this.mr?.materials[1]?.passes[this.passIndex];
            if (pass) {
                pass.setUniform(this.dissolveThresholdHandle, 0.0);
                pass.setUniform(this.dissolveThresholdTyeHandle, 0.0);
                pass.setUniform(this.dissolveType2Handle, 0.0);
                if (this.txtNoise1) {
                    pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise1?.getGFXTexture()!);
                }
                pass.update();
            }
        }
    }

    /**
     * 处理单个渲染通道的溶解效果
     * @param pass 渲染通道
     */
    processPass(pass: renderer.Pass) {
        if (this.dissolve) {
            // 设置溶解阈值到着色器
            this.setDissolveThreshold(pass, this.dissolveThreshold);
        } else if (this.dissolve2) {
            // 第二种溶解模式（当前未使用）
            this.setDissolveThreshold(pass, this.dissolveThreshold);
        }
    }

    /**
     * 预先获取着色器参数的句柄，避免每帧查找
     * @param pass 渲染通道
     */
    preFetchHandles(pass: renderer.Pass) {
        // 获取溶解阈值参数句柄
        if (-1 == this.dissolveThresholdHandle) {
            this.dissolveThresholdHandle = pass.getHandle('dissolveThreshold')
        }
        // 获取溶解方向参数句柄（3个float值）
        if (-1 == this.dissolveThresholdTyeHandle) {
            this.dissolveThresholdTyeHandle = pass.getHandle('dissolveOffsetDir', 3, gfx.Type.FLOAT);
        }
        // 获取溶解类型2参数句柄（1个float值）
        if (-1 == this.dissolveType2Handle) {
            this.dissolveType2Handle = pass.getHandle('dissolveParams2', 0, gfx.Type.FLOAT);
        }
        // 获取溶解噪声贴图绑定句柄
        if (-1 == this.dissolveNoiseMapBinding) {
            this.dissolveNoiseMapBinding = pass.getBinding('dissolveMap');
        }
    }

    /**
     * 设置溶解阈值到着色器uniform
     * @param pass 渲染通道
     * @param value 溶解阈值（0-1）
     */
    setDissolveThreshold(pass: renderer.Pass, value: number) {
        pass.setUniform(this.dissolveThresholdHandle, value);
        pass.update();
    }

    /**
     * 使用第一个噪声纹理，设置特定的溶解参数
     */
    Dissolve() {
        this.dissolve = true;
        if (this.mr?.materials) {
            // 处理第一个材质
            let pass = this.mr?.materials[0]?.passes[this.passIndex];
            if (pass) {
                this.preFetchHandles(pass);
                // 设置溶解方向参数为1.0
                pass.setUniform(this.dissolveThresholdTyeHandle, 1.0);
                // 设置溶解类型2参数为1.0
                pass.setUniform(this.dissolveType2Handle, 1.0);
                // 绑定第一个噪声纹理
                pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise1?.getGFXTexture()!);
                pass.update();
            }

            // 处理第二个材质（如果存在）
            pass = this.mr?.materials[1]?.passes[this.passIndex];
            if (pass) {
                pass.setUniform(this.dissolveThresholdTyeHandle, 1.0);
                pass.setUniform(this.dissolveType2Handle, 1.0);
                pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise1?.getGFXTexture()!);
                pass.update();
            }
        }
    }

    /**
     * 按钮回调：开始向上溶解效果
     * 使用第二个噪声纹理，设置不同的溶解参数
     */
    DissolveUp() {
        this.dissolve = true;
        if (this.mr?.materials) {
            // 处理第一个材质
            let pass = this.mr?.materials[0]?.passes[this.passIndex];
            if (pass) {
                this.preFetchHandles(pass);
                // 设置溶解方向参数为1.0
                pass.setUniform(this.dissolveThresholdTyeHandle, 1.0);
                // 设置溶解类型2参数为0.0（与基础溶解不同）
                pass.setUniform(this.dissolveType2Handle, 0.0);
                // 绑定第二个噪声纹理
                pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise2?.getGFXTexture()!);
                pass.update();
            }

            // 处理第二个材质（如果存在）
            pass = this.mr?.materials[1]?.passes[this.passIndex];
            if (pass) {
                pass.setUniform(this.dissolveThresholdTyeHandle, 1.0);
                pass.setUniform(this.dissolveType2Handle, 0.0);
                pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise2?.getGFXTexture()!);
                pass.update();
            }
        }
    }

    /**
     * 按钮回调：开始扩展溶解效果
     * 使用第二个噪声纹理，所有参数都设置为0.0
     */
    DissolveExpand() {
        this.dissolve = true;

        if (this.mr?.materials) {
            // 处理第一个材质
            let pass = this.mr?.materials[0]?.passes[this.passIndex];
            if (pass) {
                this.preFetchHandles(pass);
                // 设置溶解方向参数为0.0（与其他模式不同）
                pass.setUniform(this.dissolveThresholdTyeHandle, 0.0);
                // 设置溶解类型2参数为0.0
                pass.setUniform(this.dissolveType2Handle, 0.0);
                // 绑定第二个噪声纹理
                pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise2?.getGFXTexture()!);
                pass.update();
            }

            // 处理第二个材质（如果存在）
            pass = this.mr?.materials[1]?.passes[this.passIndex];
            if (pass) {
                pass.setUniform(this.dissolveThresholdTyeHandle, 0.0);
                pass.setUniform(this.dissolveType2Handle, 0.0);
                pass.bindTexture(this.dissolveNoiseMapBinding, this.txtNoise2?.getGFXTexture()!);
                pass.update();
            }
        }
    }

}

