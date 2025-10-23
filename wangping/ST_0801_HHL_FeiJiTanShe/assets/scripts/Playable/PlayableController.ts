import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import superHtmlPlayable from './super_html_playable';
import EventManager from '../EventManager/EventManager';
import EventType from '../EventManager/EventType';

@ccclass('PlayableController')
export class PlayableController extends Component {

    @property
    appStoreUrl: string = "https://apps.apple.com/us/app/ad-testing/id1463016906"

    @property
    googlePlayUrl: string = "https://apps.apple.com/us/app/ad-testing/id1463016906"

    protected onLoad(): void {
        superHtmlPlayable.set_app_store_url(this.appStoreUrl);
        superHtmlPlayable.set_app_store_url(this.googlePlayUrl);
    }

    start() {
        EventManager.addEventListener(EventType.PLAYABLE_GAME_END, this.onGameEnd, this);
        EventManager.addEventListener(EventType.PLAYABLE_DOWNLOAD, this.onDownload, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.PLAYABLE_GAME_END, this.onGameEnd, this);
        EventManager.remveEventListener(EventType.PLAYABLE_DOWNLOAD, this.onDownload, this);
    }

    update(deltaTime: number) {
    }

    onGameEnd() {
        superHtmlPlayable.game_end();
    }

    onDownload() {
        superHtmlPlayable.download();
    }
}

