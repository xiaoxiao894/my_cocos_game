import { _decorator, CCString, Component, Label, Node } from 'cc';
import L18nManager, { LanguageType } from './L18Manager';
const { ccclass, property } = _decorator;

@ccclass('LangAuto')
export class LangAuto extends Component {


    private _lab: Label

    @property(CCString)
    public cnDesc: string = "";

    @property(CCString)
    public enDesc: string = "";

    protected start(): void {
        this._lab = this.getComponent(Label);
        switch (L18nManager.instance.lang) {
            case LanguageType.zh_cn: {
                this._lab.string = this.cnDesc;
                break;
            }
            case LanguageType.en: {
                this._lab.string = this.enDesc;
                break;
            }
            default: {
                this._lab.string = this.enDesc;
                break;
            }
        }
    }


}



