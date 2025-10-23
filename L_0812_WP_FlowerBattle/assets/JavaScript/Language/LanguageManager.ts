import { _decorator, sys } from 'cc';
//import Singleton from '../Base/Singleton';
const { ccclass } = _decorator;

@ccclass('LanguageManager')
export class LanguageManager  {
    private static _instance:LanguageManager = null;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new LanguageManager();
        }
        return this._instance;
    }

    private static DICT = {
        'zh': {
            Download: '下载',
            retry: '重试',
            Stagbeetle: '锹形虫',
            Beetle: '甲虫',
            Beetlewarrior: '甲虫战士',
        },
        'zh-cn': {
            Download: '下载',
            retry: '重试',
            Stagbeetle: '锹形虫',
            Beetle: '甲虫',
            Beetlewarrior: '甲虫战士',
        },
        'zh-hk': {
            Download: '下載',
            retry: '重試',
            Stagbeetle: '鍬形蟲',
            Beetle: '甲蟲',
            Beetlewarrior: '甲蟲戰士',
        },
        'zh-mo': {
            Download: '下載',
            retry: '重試',
            Stagbeetle: '鍬形蟲',
            Beetle: '甲蟲',
            Beetlewarrior: '甲蟲戰士',
        },
        'zh-tw': {
            Download: '下載',
            retry: '重試',
            Stagbeetle: '鍬形蟲',
            Beetle: '甲蟲',
            Beetlewarrior: '甲蟲戰士',
        },
        'en': {
            Download: 'Download',
            retry: 'TryAgain',
            Stagbeetle: 'Stagbeetle',
            Beetle: 'Beetle',
            Beetlewarrior: 'Beetlewarrior',
        },
        'fr': {
            Download: 'Télécharger',
            retry: 'Réessayer',
            Stagbeetle: 'Lucane',
            Beetle: 'Scarabée',
            Beetlewarrior: 'Guerrier scarabée',
        },
        'ja': {
            Download: 'ダウンロード',
            Stagbeetle: 'クワガタムシ',
            retry: '再試行',
            Beetle: '甲虫',
            Beetlewarrior: '甲虫戦士',
        },
        'ko': {
            Download: '다운로드',
            retry: '다시 시도',
            Stagbeetle: '사슴벌레',
            Beetle: '딱정벌레',
            Beetlewarrior: '딱정벌레 전사',
        },
        'de': {
            Download: 'Herunterladen',
            retry: 'Wiederholen',
            Stagbeetle: 'Hirschkäfer',
            Beetle: 'Käfer',
            Beetlewarrior: 'Käferkrieger',
        },
        'ru': {
            Download: 'Скачать',
            Stagbeetle: 'Жук-олень',
            retry: 'Повторить',
            Beetle: 'Жук',
            Beetlewarrior: 'Жук-воин',
        },
    };


    static t(key: string): string {
        const code = sys.languageCode;
        const val = this.DICT[code]?.[key]
            ?? this.DICT['en']?.[key]
            ?? key;
        return val;
    }

}