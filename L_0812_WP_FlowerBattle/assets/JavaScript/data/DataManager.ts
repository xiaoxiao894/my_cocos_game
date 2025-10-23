import { _decorator, resources } from 'cc';
import { Singleton } from './Singleton';
import { CharacterDataJson } from './CharacterDataJson';
import { MonsterData } from './MonsterData'; // 注意这里修正了导入路径的拼写错误

const { ccclass } = _decorator;

// 数据缓存接口
interface DataCache {
    monsters: Map<number, MonsterData>;
    characters: Map<number, CharacterDataJson>;
}

@ccclass('DataManager')
export class DataManager {
    private static _instance: DataManager = null;
    public static get Instance(): DataManager {
        if (!this._instance) {
            this._instance = new DataManager();
        }
        return this._instance;
    }

    // 数据缓存
    private dataCache: DataCache = {
        monsters: new Map(),
        characters: new Map()
    };

    // 初始化所有数据
    async init() {
        try {
            await Promise.all([
                this.loadMonsterData(),
                this.loadCharacterData()
            ]);
            console.log('所有数据加载完成');
            return true;
        } catch (error) {
            console.error('数据加载失败:', error);
            return false;
        }
    }

    // 加载怪物数据
    private async loadMonsterData() {

        return new Promise<void>((resolve, reject) => {
            resources.load('config/monsters', (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                const jsonData = asset instanceof Object && 'json' in asset ? asset.json : asset;
                let ss = asset;
                console.log(jsonData);
                if (jsonData && Array.isArray(jsonData)) {
                    jsonData.forEach((data: MonsterData) => {
                        this.dataCache.monsters.set(data.id, data);
                    });
                    console.log(`已加载怪物数据: ${this.dataCache.monsters.size} 条`);
                    resolve();
                } else {
                    reject(new Error('怪物数据格式不正确'));
                }
            });
        });
    }

    // 加载人物数据
    private async loadCharacterData() {
        return new Promise<void>((resolve, reject) => {
            resources.load('config/characters', (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                const jsonData = asset instanceof Object && 'json' in asset ? asset.json : asset;
                let ss = asset;
                console.log(jsonData);
                if (jsonData && Array.isArray(jsonData)) {
                    jsonData.forEach((data: CharacterDataJson) => {
                        this.dataCache.characters.set(data.id, data);
                    });
                    console.log(`已加载人物数据: ${this.dataCache.characters.size} 条`);
                    resolve();
                } else {
                    reject(new Error('人物数据格式不正确'));
                }
            });
        });
    }

    // 获取怪物数据
    public getMonsterById(id: number): MonsterData | null {
        return this.dataCache.monsters.get(id) || null;
    }

    // 获取所有怪物数据
    public getAllMonsters(): MonsterData[] {
        return Array.from(this.dataCache.monsters.values());
    }

    // 获取人物数据
    public getCharacterById(id: number): CharacterDataJson | null {
        return this.dataCache.characters.get(id) || null;
    }

    // 获取所有人物数据
    public getAllCharacters(): CharacterDataJson[] {
        return Array.from(this.dataCache.characters.values());
    }
}
