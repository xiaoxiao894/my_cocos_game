import { _decorator, Component, Node } from 'cc';
import EventManager from '../EventManager/EventManager';
import EventType from '../EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('SoundSetting')
export class SoundSetting extends Component {

    private static _inst: SoundSetting = null;
    public static get inst(): SoundSetting {
        return this._inst;
    }

    @property
    isOn: boolean = true

    protected onLoad(): void {
        SoundSetting._inst = this;
    }

    start() {
        EventManager.addEventListener(EventType.SOUND_SWITCH, this.onSoundSwitch, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SOUND_SWITCH, this.onSoundSwitch, this);
    }

    onSoundSwitch(isOn: boolean) {
        this.isOn = isOn
    }


    update(deltaTime: number) {

    }
}

