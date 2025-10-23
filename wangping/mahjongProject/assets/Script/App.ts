import { _decorator, Atlas, Component, find, Node, Prefab, SpriteAtlas } from 'cc';
import { ResourceManager } from './ResourceManager';
import { NodePoolManager } from './NodePoolManager';
import { GlobeVariable } from './GlobeVariable';
import { MahjongGame } from './MahjongGame';
import super_html_playable from './super_html_playable';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends Component {
    public static resManager: ResourceManager = null;
    public static poolManager: NodePoolManager = null;

    public static soundManager:SoundManager = null;
    public static mahjongAtlas = null;
    public static mahjongAtlasEffect = null;

    @property(Prefab)
    public prefabMahjongItem: Prefab = null;

    @property(Prefab)
    public prefabmahjongEffect: Prefab = null;

    @property(SpriteAtlas)
    public atlas: SpriteAtlas = null;

    
    @property(SpriteAtlas)
    public effectAtlas: SpriteAtlas = null;

    @property(Prefab)
    public handAniPb: Prefab = null;

    protected async onLoad() {
        App.resManager = ResourceManager.instance;
        App.poolManager = NodePoolManager.Instance;
        App.soundManager = SoundManager.Instance;
        App.soundManager.preloadAudioClips();
        //App.mahjongAtlas = await App.resManager.loadSpriteAtlas("icons/icons");
        App.mahjongAtlas = this.atlas
        App.mahjongAtlasEffect = this.effectAtlas
        this.initRes()
        find("Canvas").getComponent(MahjongGame).init();
    }
    /**   */
    async initRes() {
        // 麻将路径
        // let mahjongItem = await App.resManager.loadPrefab(GlobeVariable.prefabPath.mahjongItem)
        // if (mahjongItem) {
        //     App.poolManager.initPool(mahjongItem, 1, GlobeVariable.prefabPoolName.mahjongItem);
        // }
        // // 麻将特效路径
        // let mahjongEffect = await App.resManager.loadPrefab(GlobeVariable.prefabPath.mahjongEffect)
        // if (mahjongEffect) {
        //     App.poolManager.initPool(mahjongEffect, 200, GlobeVariable.prefabPoolName.mahjongEffect);
        // }
        App.poolManager.initPool(this.prefabMahjongItem, 200, GlobeVariable.prefabPoolName.mahjongItem);
        App.poolManager.initPool(this.prefabmahjongEffect, 10, GlobeVariable.prefabPoolName.mahjongEffect);
        App.poolManager.initPool(this.handAniPb, 10, GlobeVariable.prefabPoolName.handAniPb);
        
    }
    start() {
        super_html_playable.set_google_play_url(GlobeVariable.google_play);
        super_html_playable.set_app_store_url(GlobeVariable.appstore);
    }

    update(deltaTime: number) {

    }
}


