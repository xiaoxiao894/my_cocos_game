import { _decorator, resources, Asset } from "cc";

export class ResourceManager {

	private static _instance: ResourceManager;
	public static get Instance() {
		if (!ResourceManager._instance) {
		ResourceManager._instance = new ResourceManager();
		}
		return ResourceManager._instance;
	}                     

	loadRes<T extends Asset>(path: string, type: new (...args: any[]) => T) {
		return new Promise<T>((resolve, reject) => {
			resources.load(path, type, (err, res) => {
				if (err) {
				reject(err);
				return;
				}
				resolve(res);
			});
		});
	}

	loadDir<T extends Asset>(path: string, type: new (...args: any[]) => T) {
		return new Promise<T[]>((resolve, reject) => {
			resources.loadDir(path, type, (err, res) => {
				if (err) {
				reject(err);
				return;
				}
				resolve(res);
			});
		});
	}
}
