
import { _decorator, Color, Component, Material, MeshRenderer, Node, tween, Tween, CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudEffct')
export class CloudEffct extends Component {
    // 可配置参数
    @property({ tooltip: '渐变持续时间(秒)' })
    public fadeDuration = 0.2;
    @property({ tooltip: '每个云之间的延迟时间(秒)' })
    public delayBetweenClouds = 0.05;
   // @property({ tooltip: '材质颜色属性名' })
    public colorPropertyName = 'mainColor';
   // @property({ tooltip: '初始透明度(0-255)' })
    public initialOpacity = 255;
    @property({ tooltip: '目标透明度(0-255)' })
    public targetOpacity = 0;
    @property({ tooltip: '是否随机延迟' })
    public randomizeDelay = false;
    @property({ tooltip: '随机延迟范围(秒)' })
    public randomDelayRange = 0;
    @property({ type: CCBoolean, tooltip: 'true为淡入效果,false为淡出效果' })
    public isFadeIn = false;

    // 存储材质和动画状态
    private materials: Material[] = [];
    private isInitialized = false; // 标记是否已初始化材质
    private materialStates: Map<Material, {
        currentTween: Tween<Color> | null;
        pendingAction: 'fadeIn' | 'fadeOut' | null;
    }> = new Map();

    start() {
        // 仅收集材质，不启动任何效果
        this.initMaterials();
    }

    /**
     * 初始化材质收集
     */
    private initMaterials() {
        if (this.isInitialized) return;
        
        const siblings = this.node.children;
        if (siblings.length === 0) {
            console.warn("CloudEffct: 当前节点没有子节点");
            return;
        }

        siblings.forEach(sibling => {
            const meshNode = sibling.getChildByName("Plane001");
            if (!meshNode) return;
            
            const meshRenderer = meshNode.getComponent(MeshRenderer);
            if (!meshRenderer || !meshRenderer.material) return;
            
            // 检查材质兼容性
            if (!this.checkMaterialCompatibility(meshRenderer.material)) {
                console.error(`CloudEffct: 材质 ${meshRenderer.material.name} 不兼容`);
                return;
            }
            
            const material = meshRenderer.material;
            const startColor = new Color(255, 255, 255, this.initialOpacity);
            material.setProperty(this.colorPropertyName, startColor),
            this.materials.push(material);
            this.materialStates.set(material, { currentTween: null, pendingAction: null });
        });

        this.isInitialized = true;
        console.log(`CloudEffct: 已收集 ${this.materials.length} 个材质`);
    }

    /**
     * 外部调用接口：启动云效果
     * @param isFadeIn true=淡入 false=淡出
     */
    public startEffect(isFadeIn: boolean) {
        // 确保材质已初始化
        if (!this.isInitialized) {
            this.initMaterials();
        }
        
        // 如果没有材质可用，直接返回
        if (this.materials.length === 0) {
            console.warn("CloudEffct: 没有可用的材质");
            return;
        }
        
        // 更新效果方向
        this.isFadeIn = isFadeIn;
        
        // 为每个材质安排淡入/淡出
        this.materials.forEach((material, index) => {
            // 计算延迟时间
            let delayTime = 0;
            if (this.randomizeDelay) {
                delayTime = Math.random() * this.randomDelayRange;
            } else if (this.delayBetweenClouds > 0) {
                delayTime = index * this.delayBetweenClouds;
            }
            
            // 延迟安排动画
            this.scheduleOnce(() => {
                this.scheduleFade(material, isFadeIn ? 'fadeIn' : 'fadeOut');
            }, delayTime);
        });
    }

    /**
     * 安排材质的淡入淡出效果
     */
    private scheduleFade(material: Material, action: 'fadeIn' | 'fadeOut') {
        const state = this.materialStates.get(material);
        if (!state) return;
        
        // 如果当前没有动画运行，立即开始
        if (!state.currentTween) {
            this.startFade(material, action);
        } else {
            // 如果已有动画，将此操作设为待处理
            state.pendingAction = action;
        }
    }

    /**
     * 启动单个材质动画
     */
    private startFade(material: Material, action: 'fadeIn' | 'fadeOut') {
        const state = this.materialStates.get(material);
        if (!state) return;
        
        // 获取当前材质的透明度
        const currentColor = material.getProperty(this.colorPropertyName) as Color;
        const currentOpacity = currentColor.a;
        
        // 检查是否需要执行淡入操作
        if (action === 'fadeIn' && currentOpacity === this.initialOpacity) {
            console.log(`CloudEffct: 材质 ${material.name} 当前透明度与初始透明度相同，跳过淡入操作`);
            return;
        }
        
        // 检查是否需要执行淡出操作
        if (action === 'fadeOut' && currentOpacity === this.targetOpacity) {
            console.log(`CloudEffct: 材质 ${material.name} 当前透明度与目标透明度相同，跳过淡出操作`);
            return;
        }
        
        const startOpacity = action === 'fadeIn' ? this.targetOpacity : this.initialOpacity;
        const endOpacity = action === 'fadeIn' ? this.initialOpacity : this.targetOpacity;
        
        const startColor = new Color(255, 255, 255, startOpacity);
        const endColor = new Color(255, 255, 255, endOpacity);
        
        // 创建并存储tween
        const tweenInstance = tween(startColor)
            .to(this.fadeDuration, { a: endOpacity }, {
                onUpdate: (target:Color) => material.setProperty(this.colorPropertyName, target),
                easing: 'linear'
            })
            .call(() => {
                // 动画完成后清除当前tween
                state.currentTween = null;
                
                // 检查是否有待处理的动作
                if (state.pendingAction) {
                    const nextAction = state.pendingAction;
                    state.pendingAction = null;
                    this.startFade(material, nextAction);
                }
            })
            .start();
        
        // 更新状态
        state.currentTween = tweenInstance;
    }

    /**
     * 检查材质兼容性
     */
    private checkMaterialCompatibility(material: Material): boolean {
        try {
            // 尝试获取属性
            material.getProperty(this.colorPropertyName);
            return true;
        } catch (error) {
            // 尝试常见的其他属性名
            const alternativeNames = ['color', 'mainColor', 'diffuseColor'];
            for (const name of alternativeNames) {
                try {
                    material.getProperty(name);
                    // 如果找到兼容属性名，更新组件属性
                    this.colorPropertyName = name;
                    return true;
                } catch (e) {
                    continue;
                }
            }
            return false;
        }
    }

    /**
     * 组件销毁时清理资源
     */
    onDestroy() {
        // 停止所有动画
        this.materials.forEach(material => {
            const state = this.materialStates.get(material);
            if (state && state.currentTween) {
                state.currentTween.stop();
            }
        });
        this.materialStates.clear();
    }
}
