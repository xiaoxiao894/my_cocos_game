import { _decorator, Component, Node, director, Prefab, Enum, Vec3, instantiate, Animation, Quat, NodePool, ParticleSystem, tween, clamp } from 'cc';
import { EffectType } from '../common/CommonEnum';
const { ccclass, property } = _decorator;
/**
 * 特效播放类型
 */
enum EffectPlayType {
    Normal = 'Normal',
    Animation = 'Animation',
    Particle = 'Particle'
}

// 特效项类，用于在编辑器中配置
@ccclass('EffectItem')
class EffectItem {
    @property({type: Enum(EffectType), displayName: '特效类型'})
    type: EffectType = EffectType.None;
    
    @property({type: Prefab})
    prefab: Prefab = null!;

    @property({type: Enum(EffectPlayType), displayName: '播放类型'})
    
    playType: EffectPlayType = EffectPlayType.Normal;
    @property({displayName: '持续时间(秒)', tooltip: '0表示不自动回收, 粒子特效必须设置'})
    duration: number = 0;
}

@ccclass('EffectManager')
export class EffectManager extends Component {
    /** 单例实例 */
    private static declare _instance: EffectManager | null;
    /** 获取单例实例 */
    public static get instance(): EffectManager {
        if (!this._instance) {
            console.warn('EffectManager 实例不存在 动态创建');
            // 动态创建节点并添加组件
            const node = new Node('EffectManager');
            this._instance = node.addComponent(EffectManager);
            // 添加到场景
            director.getScene()?.addChild(node);
        }
        return this._instance as EffectManager;
    }

    @property({type: [EffectItem], displayName: '特效列表'})
    public effectItems: EffectItem[] = [];
    
    // 对象池映射表，按特效类型存储
    private _pools: Map<EffectType, NodePool> = new Map();
    
    // 正在播放的特效节点
    private _activeEffects: Map<Node, EffectType> = new Map();

    public get effectType(): typeof EffectType {
        return EffectType;
    }

    onLoad() {
        // 单例检查
        if (EffectManager._instance) {
            this.node.destroy();
            return;
        }
        EffectManager._instance = this;
        
        // 初始化对象池
        this.initPools();
    }
    
    /**
     * 初始化所有特效的对象池
     */
    private initPools(): void {
        for (const item of this.effectItems) {
            if (item.type !== EffectType.None && !this._pools.has(item.type)) {
                const pool = new NodePool();
                // 每种特效初始化时创建5个实例
                for (let i = 0; i < 5; i++) {
                    const node = instantiate(item.prefab);
                    pool.put(node);
                }
                this._pools.set(item.type, pool);
            }
        }
    }

    protected onDestroy(): void {
        if (EffectManager._instance === this) {
            EffectManager._instance = null;
        }
        
        // 清空对象池
        this._pools.forEach(pool => pool.clear());
        this._pools.clear();
        
        // 清理正在播放的特效
        this._activeEffects.forEach((_, node) => {
            node.destroy();
        });
        this._activeEffects.clear();
        
        // 这里似乎有个未定义的app，需要确保app已在其他地方定义
        if (typeof app !== 'undefined' && app.event) {
            app.event.offAllByTarget(this);
        }
    }
    
    /**
     * 根据特效类型获取预制体和播放类型
     * @param type 特效类型
     * @returns 对应类型的预制体和播放类型，如果不存在则返回null
     */
    public getEffectByType(type: EffectType): EffectItem | null {
        return this.effectItems.find(item => item.type === type) || null;
    }

    /**
     * 播放特效
     * @param type 特效类型
     * @param position 特效位置
     * @param rotation 特效旋转(欧拉角)
     * @returns 创建的特效节点
     */
    public playEffect(type: EffectType, position?: Vec3, rotation?: Quat, parent?: Node, scale?: Vec3): Node | null {
        const item = this.getEffectByType(type);
        if (!item) {
            console.warn(`特效预制体不存在: ${type}`);
            return null;
        }

        // 从对象池获取或创建新节点
        let effect: Node;
        const pool = this._pools.get(type);
        
        if (pool && pool.size() > 0) {
            effect = pool.get()!;
        } else {
            effect = instantiate(item.prefab);
        }
        
        // 记录该节点的特效类型
        this._activeEffects.set(effect, type);
        
        // 设置位置和旋转
        if (position) {
            effect.setPosition(position);
        }
        
        // 使用欧拉角设置旋转
        if (rotation) {
            effect.setRotation(rotation);
        }

        if (parent) {
            effect.setParent(parent);
        } else {
            effect.setParent(this.node);
        }

        if (scale) {
            effect.setScale(scale);
        }

        // 根据特效类型播放
        if (item.playType === EffectPlayType.Animation) {
            const animss = effect.getComponentsInChildren(Animation);
            let completedCount = 0;
            const totalAnims = animss.length;
            
            if (totalAnims > 0) {
                animss.forEach(anim => {
                    anim.play();
                    anim.once(Animation.EventType.FINISHED, () => {
                        completedCount++;
                        if (completedCount >= totalAnims) {
                            this.recycleEffect(effect);
                        }
                    });
                });
            } else {
                // 如果没有动画组件且未设置持续时间，使用默认延迟回收
                if (item.duration <= 0) {
                    this.scheduleOnce(() => {
                        this.recycleEffect(effect);
                    }, 1.0); // 默认1秒后回收
                }
            }
        } else if (item.playType === EffectPlayType.Particle) {
            // 处理粒子特效
            const particles = effect.getComponentsInChildren(ParticleSystem);
            particles.forEach(particle => {
                particle.play();
            });
            
            // 注意：粒子系统没有内置的完成事件，需要依赖duration
        }
        
        // 如果设置了持续时间，则定时回收
        if (item.duration > 0) {
            this.scheduleOnce(() => {
                this.recycleEffect(effect);
            }, item.duration);
        }
        
        return effect;
    }
    
    /**
     * 回收特效节点到对象池
     * @param effect 要回收的特效节点
     */
    public recycleEffect(effect: Node): void {
        if (!effect.isValid) {
            return;
        }
        
        // 获取节点对应的特效类型
        const type = this._activeEffects.get(effect);
        if (!type) {
            effect.destroy();
            return;
        }
        
        // 从激活列表中移除
        this._activeEffects.delete(effect);
        
        // 停止所有动作
        effect.setParent(null);
        
        // 如果是动画特效，停止动画
        const anim = effect.getComponent(Animation);
        if (anim) {
            anim.stop();
        }
        
        // 停止粒子系统
        const particles = effect.getComponentsInChildren(ParticleSystem);
        particles.forEach(particle => {
            particle.stop();
        });
        
        // 放回对象池
        const pool = this._pools.get(type);
        if (pool) {
            pool.put(effect);
        } else {
            effect.destroy();
        }
    }
    
    /**
     * 手动回收所有特效
     */
    public recycleAllEffects(): void {
        const effects = Array.from(this._activeEffects.keys());
        for (const effect of effects) {
            this.recycleEffect(effect);
        }
    }

    /**
     * 获取当前正在播放的所有特效
     * @returns 正在播放的特效节点数组
     */
    public getActiveEffects(): Node[] {
        return Array.from(this._activeEffects.keys());
    }
    
    /**
     * 获取指定类型的正在播放的特效
     * @param type 特效类型
     * @returns 指定类型的正在播放的特效节点数组
     */
    public getActiveEffectsByType(type: EffectType): Node[] {
        const result: Node[] = [];
        this._activeEffects.forEach((effectType, node) => {
            if (effectType === type) {
                result.push(node);
            }
        });
        return result;
    }
    
    /**
     * 在运行时添加新特效配置
     * @param item 特效配置项
     */
    public addEffectItem(item: EffectItem): void {
        if (!item || !item.prefab) {
            console.warn('无效的特效配置项');
            return;
        }
        
        // 防止重复添加
        if (this.getEffectByType(item.type)) {
            console.warn(`特效类型已存在: ${item.type}`);
            return;
        }
        
        this.effectItems.push(item);
        
        // 为新类型创建对象池
        if (!this._pools.has(item.type)) {
            this._pools.set(item.type, new NodePool());
        }
    }

    /**
     * 添加到特效层
     * @param effect 特效节点
     */
    public addToEffectLayer(effect: Node): void {
        effect.setParent(this.node, true);
    }
    
    /**
     * 使节点沿抛物线轨迹飞行到目标位置
     * @param node 要移动的节点
     * @param target 目标节点或目标坐标
     * @param duration 飞行持续时间(秒)
     * @param height 抛物线高度
     * @param callback 飞行完成回调
     * @returns 飞行的节点
     */
    public flyNodeInParabola(node: Node, target: Node | Vec3, callback?: () => void, duration: number = 0.6, height: number = 5): Node {
        if (!node || !node.isValid) {
            console.warn('节点无效，无法执行抛物线飞行');
            return node;
        }

        // 检查target有效性
        if (target instanceof Node && (!target || !target.isValid)) {
            console.warn('目标节点无效，无法执行抛物线飞行');
            return node;
        }

        if (target instanceof Vec3 && !target) {
            console.warn('目标坐标无效，无法执行抛物线飞行');
            return node;
        }

        // 确保节点在场景中
        this.addToEffectLayer(node);

        // 获取起始位置和目标位置
        const startPos = node.getWorldPosition();
        const targetPos = target instanceof Node ? target.getWorldPosition() : target;
        
        // 创建一个临时对象来驱动动画进度
        const progressObj = { progress: 0 };
        
        // 创建缓动动画
        tween(progressObj)
            .to(duration, { progress: 1 }, {
                onUpdate: () => {
                    const ratio = progressObj.progress;
                    // console.log('ratio', ratio);
                    // 线性插值计算当前X和Z位置
                    const currentX = startPos.x + (targetPos.x - startPos.x) * ratio;
                    const currentZ = startPos.z + (targetPos.z - startPos.z) * ratio;
                    
                    // 计算Y位置（抛物线轨迹）
                    // 使用公式: y = 4 * h * t * (1 - t)，其中t是[0,1]之间的进度值
                    // 这个公式会创建一个在中点达到最大高度的抛物线
                    const heightOffset = 4 * height * ratio * (1 - ratio);
                    const currentY = startPos.y + (targetPos.y - startPos.y) * ratio + heightOffset;
                    
                    // 设置节点位置
                    node.setWorldPosition(new Vec3(currentX, currentY, currentZ));

                    // console.log('currentY', currentY);
                }
            })
            .call(() => {
                // console.log('progressObj.progress', progressObj.progress);  
                // 飞行完成后的回调
                
                if (callback) {
                    callback();
                }
            })
            .start();
        
        return node;
    }
}


