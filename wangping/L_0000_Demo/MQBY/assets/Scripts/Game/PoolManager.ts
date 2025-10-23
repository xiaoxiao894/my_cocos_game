import { _decorator, Component, Node, director, Prefab, Enum, Vec3, instantiate, Animation, Quat, NodePool, ParticleSystem, CCInteger, v3 } from 'cc';
import { ObjectType } from '../common/CommonEnum';
import { PoolObjectBase } from '../common/PoolObjectBase';
import { BulletBase } from './Bullet/BulletBase';
const { ccclass, property } = _decorator;

// 对象池项类，用于在编辑器中配置
@ccclass('ObjectPoolItem')
class ObjectPoolItem {
    @property({type: Enum(ObjectType), displayName: '对象类型'})
    type: ObjectType = ObjectType.None;
    
    @property({type: Prefab, displayName: '对象预制体'})
    prefab: Prefab = null!;
    
    @property({type: CCInteger, range: [0, 300], displayName: '对象池初始大小'})
    poolInitSize: number = 0;
}

@ccclass('PoolManager')
export class PoolManager extends Component {
    /** 单例实例 */
    private static declare _instance: PoolManager | null;
    /** 获取单例实例 */
    public static get instance(): PoolManager {
        if (!this._instance) {
            console.log('PoolManager 实例不存在 动态创建');
            // 动态创建节点并添加组件
            const node = new Node('PoolManager');
            this._instance = node.addComponent(PoolManager);
            // 添加到场景
            director.getScene()?.addChild(node);
        }
        return this._instance as PoolManager;
    }

    @property({type: [ObjectPoolItem], displayName: '对象池列表'})
    objectPoolItems: ObjectPoolItem[] = [];
    
    /** 对象池映射表 */
    private _pools: Map<ObjectType, NodePool> = new Map();
    /** 预制体映射表 */
    private _prefabMap: Map<ObjectType, Prefab> = new Map();

    public get objectType(): typeof ObjectType {
        return ObjectType;
    }
    
    onLoad() {
        // 单例检查
        if (PoolManager._instance) {
            this.node.destroy();
            return;
        }
        PoolManager._instance = this;
        
        // 初始化对象池
        this._initPools();
        
        // 设置常驻节点，切换场景不销毁
        director.addPersistRootNode(this.node);
    }
    
    /**
     * 初始化所有对象池
     * @private
     */
    private _initPools(): void {
        // 遍历配置项，初始化每个对象池
        for (const item of this.objectPoolItems) {
            if (item.type === ObjectType.None || !item.prefab) {
                continue;
            }
            
            // 保存预制体引用
            this._prefabMap.set(item.type, item.prefab);
            
            // 创建对象池
            const pool = new NodePool();
            
            // 预先创建指定数量的对象
            for (let i = 0; i < item.poolInitSize; i++) {
                const node = instantiate(item.prefab);
                const component = node.getComponent(PoolObjectBase);
                if(component){
                    component.objectType = item.type;
                }
                pool.put(node);
            }
            
            // 保存对象池引用
            this._pools.set(item.type, pool);
            
            console.log(`对象池 [${item.type}] 初始化完成，初始数量: ${item.poolInitSize}`);
        }
    }
    
    /**
     * 从对象池获取对象
     * @param type 对象类型
     * @param parent 父节点
     * @param position 位置
     * @param rotation 旋转
     * @returns 对象节点
     */
    public getNode(type: ObjectType, parent?: Node, position?: Vec3, rotation?: Quat): Node | null {
        if (type === ObjectType.None) {
            console.warn('获取对象时类型不能为None');
            return null;
        }
        
        // 获取对象池
        const pool = this._pools.get(type);
        let node: Node | null = null;
        
        if (pool && pool.size() > 0) {
            // 对象池有可用对象
            node = pool.get();
        } else {
            // 对象池为空，创建新对象
            const prefab = this._prefabMap.get(type);
            if (prefab) {
                node = instantiate(prefab);
                console.log(`对象池 [${type}] 已空，动态创建新对象`);
                const component = node.getComponent(PoolObjectBase);
                if(component){
                    component.objectType = type;
                }
            } else {
                console.error(`找不到类型 [${type}] 的预制体`);
                return null;
            }
        }
        
        if (node) {
            // 设置父节点
            if (parent) {
                node.setParent(parent);
            }
            
            // 设置位置
            if (position) {
                node.setPosition(position);
            }
            
            // 设置旋转
            if (rotation) {
                node.setRotation(rotation);
            }
            
            // 激活节点
            node.active = true;
            
            // 重置节点
            this._resetNodeStatus(node);
        }
        
        // app.log.debug(`获取对象 [${type}] 成功: ${node.name}`);

        return node;
    }
    
    /**
     * 回收对象到对象池
     * @param node 要回收的节点
     * @param type 对象类型
     */
    public putNode(node: Node): void {
        if (!node) {
            return;
        }

        const component = node.getComponent(PoolObjectBase);
        if(!component){
            console.warn(`节点 [${node.name}] 没有 PoolObjectBase 组件 或 类型为None`);
            node.destroy();
            return;
        }
        const type = component.objectType;
        if(type === ObjectType.None){
            console.warn(`节点 [${node.name}] 的类型为None`);
            node.destroy();
            return;
        }
        
        // 获取对象池
        const pool = this._pools.get(type);
        if (!pool) {
            console.warn(`类型 [${type}] 的对象池不存在`);
            node.destroy();
            return;
        }
        
        // 停用节点
        node.active = false;
        
        // 清除父节点
        node.removeFromParent();
        
        // 停止所有动作和动画
        const animation = node.getComponent(Animation);
        if (animation) {
            animation.stop();
        }
        
        // 停止粒子效果
        const particleSystem = node.getComponentInChildren(ParticleSystem);
        if (particleSystem) {
            particleSystem.stop();
            particleSystem.clear();
        }
        
        // 放回对象池
        pool.put(node);
    }
    
    /**
     * 重置节点状态
     * @param node 要重置的节点
     * @param type 对象类型
     * @private
     */
    private _resetNodeStatus(node: Node): void {
        const poolObjectBase = node.getComponent(PoolObjectBase);
        if (poolObjectBase) {
            poolObjectBase.reset();
        }else{
            console.warn(`节点 [${node.name}] 没有 PoolObjectBase 组件`);
        }
    }
    
    /**
     * 清空指定类型的对象池
     * @param type 对象类型
     */
    public clearPool(type: ObjectType): void {
        const pool = this._pools.get(type);
        if (pool) {
            pool.clear();
            console.log(`对象池 [${type}] 已清空`);
        }
    }
    
    /**
     * 清空所有对象池
     */
    public clearAllPools(): void {
        this._pools.forEach((pool, type) => {
            pool.clear();
            console.log(`对象池 [${type}] 已清空`);
        });
    }
    
    onDestroy() {
        // 清空所有对象池
        this.clearAllPools();
        // 清空引用
        this._pools.clear();
        this._prefabMap.clear();
        
        if (PoolManager._instance === this) {
            PoolManager._instance = null;
        }
    }
}


