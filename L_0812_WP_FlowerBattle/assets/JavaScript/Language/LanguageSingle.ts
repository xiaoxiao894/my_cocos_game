import { _decorator, Component, Label, Node } from 'cc';
import { LanguageManager } from './LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('LanguageSingle')
export class LanguageSingle extends Component {
    @property(Label)
    label: Label = null;
    start() {
        if (this.label) {
            const text = LanguageManager.t(this.label.string);
            if (text) this.label.string = text;
        }
    }

    update(deltaTime: number) {
        
    }
}


