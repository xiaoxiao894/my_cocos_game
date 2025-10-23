import { assetManager, } from "cc";

/**
 * 编辑器内资源加载类
 */
export default class EditorAsset {

    /**
     * 
     * @param path 
     * @returns 
     *  const effectAsset = await EditorAsset.loadResource<EffectAsset>('Shaders/RadialBlur.effect');
     */
    public static async loadResource<T>(path: string): Promise<T> {
        if (!CC_EDITOR) {
            console.warn('[EditorAsset]', '该函数只在编辑器环境内有效！');
            return;
        }
        return new Promise<T>(async (resolve, reject) => {
            try {
                const uuid = await Editor.Message.request("asset-db", "query-uuid", `db://assets/${path}`);
                assetManager.loadAny({ uuid: uuid }, (err, data: T) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

}