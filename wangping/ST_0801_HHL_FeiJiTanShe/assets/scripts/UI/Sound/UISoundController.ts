import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../../EventManager/EventType'
import EventManager from '../../EventManager/EventManager';

@ccclass('UISoundController')
export class UISoundController extends Component {

    @property(Button)
    openBtn: Button

    @property(Button)
    closeBtn: Button

    _isOpen: boolean

    start() {

        EventManager.addEventListener(EventType.SOUND_SWITCH, this.onSoundValueChanged, this);

        this.openBtn.node.on(Button.EventType.CLICK, this.onSoundOpenBtnClick, this);
        this.closeBtn.node.on(Button.EventType.CLICK, this.onSoundCloseBtnClick, this);
    }

    protected onDestroy(): void {

        EventManager.remveEventListener(EventType.SOUND_SWITCH, this.onSoundValueChanged, this);

        this.openBtn.node.off(Button.EventType.CLICK, this.onSoundOpenBtnClick, this);
        this.closeBtn.node.off(Button.EventType.CLICK, this.onSoundCloseBtnClick, this);
    }

    onSoundOpenBtnClick(button: Button) {
        EventManager.dispatchEvent(EventType.SOUND_SWITCH, true)
    }

    onSoundCloseBtnClick(button: Button) {
        EventManager.dispatchEvent(EventType.SOUND_SWITCH, false)
    }

    onSoundValueChanged(isOpen: boolean) {
        this._isOpen = isOpen;
        this.closeBtn.node.active = isOpen;
        this.openBtn.node.active = isOpen == false;
    }



}

