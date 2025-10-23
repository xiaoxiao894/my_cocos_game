System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, resources, SpriteFrame, Prefab, AudioClip, Texture2D, ResourceManager, _crd;

  _export("ResourceManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      resources = _cc.resources;
      SpriteFrame = _cc.SpriteFrame;
      Prefab = _cc.Prefab;
      AudioClip = _cc.AudioClip;
      Texture2D = _cc.Texture2D;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a08f0aGxT5CK6ZwLA4Yc/9x", "ResourceManager", undefined);

      /**
       * 资源加载管理器
       * 提供资源的动态加载、缓存和释放功能
       */
      __checkObsolete__(['resources', 'Asset', 'AssetManager', 'SpriteFrame', 'Prefab', 'AudioClip', 'Texture2D']);

      _export("ResourceManager", ResourceManager = class ResourceManager {
        /** 私有构造函数，确保单例 */
        constructor() {
          this._resourceCache = new Map();
          this._loadingTasks = new Map();
        }
        /** 获取单例实例 */


        static get instance() {
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


        load(path, type, onProgress) {
          // 检查缓存
          const cachedAsset = this._resourceCache.get(path);

          if (cachedAsset) {
            return Promise.resolve(cachedAsset);
          } // 检查是否已有加载任务


          const existingTask = this._loadingTasks.get(path);

          if (existingTask) {
            return existingTask;
          } // 创建新的加载任务


          const loadPromise = new Promise((resolve, reject) => {
            resources.load(path, type, onProgress, (err, asset) => {
              this._loadingTasks.delete(path);

              if (err) {
                console.error(`资源加载失败: ${path}`, err);
                reject(err);
                return;
              } // 缓存加载的资源


              this._resourceCache.set(path, asset);

              resolve(asset);
            });
          });

          this._loadingTasks.set(path, loadPromise);

          return loadPromise;
        }
        /**
         * 加载精灵帧
         * @param path 精灵帧路径
         * @param onProgress 加载进度回调
         * @returns 加载完成的精灵帧Promise
         */


        loadSpriteFrame(path, onProgress) {
          return this.load(path, SpriteFrame, onProgress);
        }
        /**
         * 加载预制体
         * @param path 预制体路径
         * @param onProgress 加载进度回调
         * @returns 加载完成的预制体Promise
         */


        loadPrefab(path, onProgress) {
          return this.load(path, Prefab, onProgress);
        } //使用示例
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


        loadAudio(path, onProgress) {
          return this.load(path, AudioClip, onProgress);
        }
        /**
         * 加载纹理
         * @param path 纹理路径
         * @param onProgress 加载进度回调
         * @returns 加载完成的纹理Promise
         */


        loadTexture(path, onProgress) {
          return this.load(path, Texture2D, onProgress);
        }
        /**
         * 加载多个资源
         * @param paths 资源路径数组
         * @param type 资源类型
         * @param onProgress 加载进度回调
         * @returns 加载完成的资源数组Promise
         */


        loadMultiple(paths, type, onProgress) {
          const promises = paths.map(path => this.load(path, type, onProgress));
          return Promise.all(promises);
        }
        /**
         * 释放资源
         * @param path 资源路径
         */


        release(path) {
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


        releaseMultiple(paths) {
          paths.forEach(path => this.release(path));
        }
        /**
         * 释放所有缓存的资源
         */


        releaseAll() {
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


        isLoaded(path) {
          return this._resourceCache.has(path);
        }
        /**
         * 获取已加载的资源
         * @param path 资源路径
         * @returns 已加载的资源，如果未加载则返回undefined
         */


        getLoadedAsset(path) {
          return this._resourceCache.get(path);
        }

      });

      ResourceManager._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4504ea97a8ed0455e2f420bec22f9a2e1f167726.js.map