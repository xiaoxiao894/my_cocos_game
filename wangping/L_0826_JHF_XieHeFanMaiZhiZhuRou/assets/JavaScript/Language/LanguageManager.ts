import { _decorator, sys } from 'cc';
import Singleton from '../Base/Singleton';
const { ccclass } = _decorator;

@ccclass('LanguageManager')
export class LanguageManager extends Singleton {
    private static DICT = {
        'zh': { download: '下载', tryAgain: '重试' },
        'zh-cn': { download: '下载', tryAgain: '重试' },
        'zh-tw': { download: '下載', tryAgain: '重試' },
        'zh-mo': { download: '下載', tryAgain: '重試' },
        'zh-hk': { download: '下載', tryAgain: '重試' },
        'en': { download: 'Download', tryAgain: 'TryAgain' },
        'fr': { download: 'Télécharger', tryAgain: 'Réessayer' },
        'ja': { download: 'ダウンロード', tryAgain: '再試行' },
        'ko': { download: '다운로드', tryAgain: '다시시도' },
        'de': { download: 'Herunterladen', tryAgain: 'Erneutversuchen' },
        'ru': { download: 'Скачать', tryAgain: 'Повторить' },
    };

    // private static DICT = {
    //     'zh': { download: '下载' },
    //     'zh-cn': { download: '下载' },
    //     'zh-tw': { download: '下載' },
    //     'zh-mo': { download: '下載' },
    //     'zh-hk': { download: '下載' },
    //     'en': { download: 'Download' },
    //     'fr': { download: 'Télécharger' },
    //     'ja': { download: 'ダウンロード' },
    //     'ko': { download: '다운로드' },
    //     'de': { download: 'Herunterladen' },
    //     'ru': { download: 'Скачать' },
    // };

    static t(key: string): string {
        const code = sys.languageCode;
        const val = this.DICT[code]?.[key]
            ?? this.DICT['en']?.[key]
            ?? key;
        return val;
    }

    static get Instance() {
        return super.GetInstance<LanguageManager>();
    }
}
