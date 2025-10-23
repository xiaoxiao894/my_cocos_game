import { _decorator, AudioSource, Component, Node, Vec3 } from 'cc';
import EventManager from '../EventManager/EventManager';
import EventType from '../EventManager/EventType';
const { ccclass, property } = _decorator;

import { SoundPlayer } from './SoundPlayer';

@ccclass('SoundController')
export class SoundController extends Component {

    @property(SoundPlayer)
    backgroundPlayer: SoundPlayer

    @property(SoundPlayer)
    skyPlayer: SoundPlayer


    protected onLoad(): void {
    }

    start() {
        EventManager.addEventListener(EventType.SOUND_SWITCH, this.onSoundSwitch, this);
        EventManager.addEventListener(EventType.AIRCAFT_FREEZE, this.onFreeze, this);
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdatePlayerPos, this);
        EventManager.addEventListener(EventType.AIRCAFT_DROP, this.onDrop, this);

        this.scheduleOnce(() => {
            EventManager.dispatchEvent(EventType.SOUND_SWITCH, true);
        }, 0.5);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SOUND_SWITCH, this.onSoundSwitch, this);
        EventManager.remveEventListener(EventType.AIRCAFT_FREEZE, this.onFreeze, this);
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdatePlayerPos, this);
        EventManager.remveEventListener(EventType.AIRCAFT_DROP, this.onDrop, this);
    }

    update(deltaTime: number) {
    }

    onSoundSwitch(isOn: boolean) {
        if (isOn) {
            this.backgroundPlayer.play();
        } else {
            this.backgroundPlayer.pause();
            this.skyPlayer.pause();
        }
    }

    onFreeze(isFreeze: boolean) {
        if (isFreeze) {
            this.skyPlayer.play()
        }
    }

    onUpdatePlayerPos(pos : Vec3) {
       
    }

    onDrop(isDrop: boolean) {
        this.skyPlayer.pause()
    }
}

