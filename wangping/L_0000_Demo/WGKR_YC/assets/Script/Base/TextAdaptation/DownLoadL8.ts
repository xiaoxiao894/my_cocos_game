import { _decorator, CCString, Component, Label, Node } from 'cc';
import L18nManager, { LanguageType } from './L18Manager';
const { ccclass, property } = _decorator;

@ccclass('DownLoadL8')
export class DownLoadL8 extends Component {
    private _lab: Label


    protected start(): void {
        this._lab = this.getComponent(Label);
        switch (L18nManager.instance.lang) {
            case LanguageType.zh_cn: {
                this._lab.string = "下载";
                break;
            }
            case LanguageType.en: {
                this._lab.string = "DOWNLOAD";
                break;
            }
            case LanguageType.zh_ft: {
                this._lab.string = "下載";
                break;
            }
            case LanguageType.fr: {
                this._lab.string = "Télécharger";
                break;
            }
            case LanguageType.ja: {
                this._lab.string = "ダウンロード";
                break;
            }
            case LanguageType.de: {
                this._lab.string = "DOWNLOAD";
                break;
            }
            case LanguageType.ko: {
                this._lab.string = "다운로드";
                break;
            }
            case LanguageType.ru: {
                this._lab.string = "Скачать";
                break;
            }

            default: {
                this._lab.string = "DOWNLOAD";
                break;
            }
        }
    }
}



