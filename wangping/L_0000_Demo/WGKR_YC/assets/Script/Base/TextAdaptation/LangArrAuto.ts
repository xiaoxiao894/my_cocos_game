import { _decorator, CCString, Component, Label, Node } from 'cc';
import L18nManager, { LanguageType } from './L18Manager';
const { ccclass, property } = _decorator;

ccclass("LangArrAuto")
export class LangArrAuto extends Component {

    @property({ type: CCString, tooltip: "简体中文" })
    private cnDesc: string[] = [];

    @property({ type: CCString, tooltip: "英文" })
    private enDesc: string[] = [];

    protected getTipsIndex(index: number): void {
        switch (L18nManager.instance.lang) {
            case LanguageType.zh_cn: {
                this.cnDesc[index];
                break;
            }
            case LanguageType.en: {
                this.enDesc[index];
                break;
            }
            default: {
                this.enDesc[index];
                break;
            }
        }
    }


}



