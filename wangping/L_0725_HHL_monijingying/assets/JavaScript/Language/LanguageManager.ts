import { _decorator, sys } from 'cc';
const { ccclass } = _decorator;

@ccclass('LanguageManager')
export class LanguageManager {
    private static DICT = {
        'zh': { download: '下载' },
         'zh-cn': { download: '下载' },
        'zh-tw': { download: '下載' },
        'zh-mo': { download: '下載' },
        'zh-hk': { download: '下載' },
        'en': { download: 'Download' },
        'fr': { download: 'Télécharger' },
        'ja': { download: 'ダウンロード' },
        'ko': { download: '다운로드' },
        'de': { download: 'Herunterladen' },
        'ru': { download: 'Скачать' },
    };

    static t(key: string): string {
        const code = sys.languageCode;
        const val = this.DICT[code]?.[key]
            ?? this.DICT['en']?.[key]
            ?? key;
        return val;
    }

    static get Instance() {
        if(!this._instance){
            this._instance = new LanguageManager();
        }
        return this._instance;
    }

    private static _instance: LanguageManager;
}
