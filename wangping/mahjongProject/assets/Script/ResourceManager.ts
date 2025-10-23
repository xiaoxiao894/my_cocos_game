import { resources, Asset, AssetManager, SpriteFrame, Prefab, AudioClip, Texture2D, SpriteAtlas } from 'cc';

/**
 * 资源加载管理器
 * 提供资源的动态加载、缓存和释放功能
 */
export class ResourceManager {
    private static _instance: ResourceManager = null;
    private _resourceCache: Map<string, Asset> = new Map();
    private _loadingTasks: Map<string, Promise<Asset>> = new Map();

    /** 私有构造函数，确保单例 */
    private constructor() { }

    /** 获取单例实例 */
    public static get instance(): ResourceManager {
        if (!this._instance) {
            this._instance = new ResourceManager();
        }
        return this._instance;
    }

    /**
     * 加载资源
     * @param path 资源路径
     * @param type 资源类型
     * @param onProgress 加载进度回调
     * @returns 加载完成的资源Promise
     */
    public load<T extends Asset>(path: string, type: typeof Asset, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<T> {
        // 检查缓存
        const cachedAsset = this._resourceCache.get(path) as T;
        if (cachedAsset) {
            return Promise.resolve(cachedAsset);
        }

        // 检查是否已有加载任务
        const existingTask = this._loadingTasks.get(path) as Promise<T>;
        if (existingTask) {
            return existingTask;
        }

        // 创建新的加载任务
        const loadPromise = new Promise<T>((resolve, reject) => {
            resources.load(path, type, onProgress, (err: Error, asset: T) => {
                this._loadingTasks.delete(path);

                if (err) {
                    console.error(`资源加载失败: ${path}`, err);
                    reject(err);
                    return;
                }

                // 缓存加载的资源
                this._resourceCache.set(path, asset);
                resolve(asset);
            });
        });

        this._loadingTasks.set(path, loadPromise as Promise<Asset>);
        return loadPromise;
    }

    /**
     * 加载一个路径下所有音频资源
     * @param path 资源路径
     * @param type 资源类型
     * @param onProgress 加载进度回调
     * @returns 加载完成的资源Promise
     */
    public loadAudioDir(path: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<AudioClip[]> {

        // 创建新的加载任务
        const loadPromise = new Promise<AudioClip[]>((resolve, reject) => {
            resources.loadDir(path, AudioClip, onProgress, (err: Error, asset: AudioClip[]) => {
                this._loadingTasks.delete(path);

                if (err) {
                    console.error(`资源加载失败: ${path}`, err);
                    reject(err);
                    return;
                }

                resolve(asset);
            });
        });
        return loadPromise;
    }

    /**
     * 加载精灵帧
     * @param path 精灵帧路径
     * @param onProgress 加载进度回调
     * @returns 加载完成的精灵帧Promise
     */
    public loadSpriteFrame(path: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<SpriteFrame> {
        return this.load<SpriteFrame>(`${path}/spriteFrame`, SpriteFrame, onProgress);
    }

    /**
     * 加载精灵图集
     * @param path 精灵图集路径
     * @param onProgress 加载进度回调
     * @returns 加载完成的精灵图集Promise
     */
    public loadSpriteAtlas(path: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<SpriteAtlas> {
        //return this.load<SpriteAtlas>(path, SpriteAtlas, onProgress);
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteAtlas, onProgress, (err: Error, asset: SpriteAtlas) => {
                if (err) {
                    console.error(`精灵图集加载失败，路径: ${path}`, err);
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    /**
     * 从精灵图集中获取指定名称的精灵帧
     * @param atlasPath 精灵图集路径
     * @param frameName 精灵帧名称
     * @param onProgress 加载进度回调
     * @returns 精灵帧Promise
     */
    public async getSpriteFrameFromAtlas(atlasPath: string, frameName: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<SpriteFrame | null> {
        try {
            const atlas = await this.loadSpriteAtlas(atlasPath, onProgress);
            const frame = atlas.getSpriteFrame(frameName);
            if (!frame) {
                console.warn(`精灵图集 ${atlasPath} 中未找到名为 ${frameName} 的精灵帧`);
                return null;
            }
            return frame;
        } catch (err) {
            console.error(`从精灵图集获取精灵帧失败: ${atlasPath} -> ${frameName}`, err);
            return null;
        }
    }
    /**
     * 加载预制体
     * @param path 预制体路径
     * @param onProgress 加载进度回调
     * @returns 加载完成的预制体Promise
     */
    public async loadPrefab(path: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<Prefab> {
        return await this.load<Prefab>(path, Prefab, onProgress);
    }
    //使用示例
    // 加载场景时显示进度
    // ResourceManager.instance.loadPrefab("scenes/MainScene", (completed, total, item) => {
    //     // 计算总体进度百分比
    //     const progress = (completed / total) * 100;

    //     // 更新UI（假设this.progressBar是你的进度条节点）
    //     this.progressBar.progress = progress / 100;

    //     // 显示当前加载的资源信息
    //     this.statusLabel.string = `加载中: ${item.path} (${progress.toFixed(1)}%)`;
    // })
    // .then(prefab => {
    //     // 加载完成后实例化场景
    //     const sceneNode = instantiate(prefab);
    //     director.getScene().addChild(sceneNode);
    // })
    // .catch(err => {
    //     console.error("场景加载失败:", err);
    //     this.statusLabel.string = "加载失败，请重试";
    // });

    /**
     * 加载音频
     * @param path 音频路径
     * @param onProgress 加载进度回调
     * @returns 加载完成的音频Promise
     */
    public loadAudio(path: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<AudioClip> {
        return this.load<AudioClip>(path, AudioClip, onProgress);
    }

    /**
     * 加载纹理
     * @param path 纹理路径
     * @param onProgress 加载进度回调
     * @returns 加载完成的纹理Promise
     */
    public loadTexture(path: string, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<Texture2D> {
        return this.load<Texture2D>(path, Texture2D, onProgress);
    }

    /**
     * 加载多个资源
     * @param paths 资源路径数组
     * @param type 资源类型
     * @param onProgress 加载进度回调
     * @returns 加载完成的资源数组Promise
     */
    public loadMultiple<T extends Asset>(paths: string[], type: typeof Asset, onProgress?: (completedCount: number, totalCount: number, item: AssetManager.RequestItem) => void): Promise<T[]> {
        const promises = paths.map(path => this.load<T>(path, type, onProgress));
        return Promise.all(promises);
    }

    /**
     * 释放资源
     * @param path 资源路径
     */
    public release(path: string): void {
        const asset = this._resourceCache.get(path);
        if (asset) {
            resources.release(path);
            this._resourceCache.delete(path);
            console.log(`资源已释放: ${path}`);
        }
    }

    /**
     * 释放多个资源
     * @param paths 资源路径数组
     */
    public releaseMultiple(paths: string[]): void {
        paths.forEach(path => this.release(path));
    }

    /**
     * 释放所有缓存的资源
     */
    public releaseAll(): void {
        this._resourceCache.forEach((_, path) => {
            resources.release(path);
        });
        this._resourceCache.clear();
        console.log('所有资源已释放');
    }

    /**
     * 检查资源是否已加载
     * @param path 资源路径
     * @returns 如果资源已加载则返回true，否则返回false
     */
    public isLoaded(path: string): boolean {
        return this._resourceCache.has(path);
    }

    /**
     * 获取已加载的资源
     * @param path 资源路径
     * @returns 已加载的资源，如果未加载则返回undefined
     */
    public getLoadedAsset<T extends Asset>(path: string): T | undefined {
        return this._resourceCache.get(path) as T;
    }
}    