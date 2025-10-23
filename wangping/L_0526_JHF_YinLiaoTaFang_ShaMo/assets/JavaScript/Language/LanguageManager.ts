import { _decorator, sys } from 'cc';
import Singleton from '../Base/Singleton';
const { ccclass } = _decorator;

@ccclass('LanguageManager')
export class LanguageManager extends Singleton {
  private static DICT = {
        'zh': {
            Download: '下载',
            Stagbeetle: '锹形虫',
            Beetle: '甲虫',
            Beetlewarrior: '甲虫战士',
        },
        'zh-cn': {
            Download: '下载',
            Stagbeetle: '锹形虫',
            Beetle: '甲虫',
            Beetlewarrior: '甲虫战士',
        },
        'zh-hk': {
            Download: '下載',
            Stagbeetle: '鍬形蟲',
            Beetle: '甲蟲',
            Beetlewarrior: '甲蟲戰士',
        },
        'zh-mo': {
            Download: '下載',
            Stagbeetle: '鍬形蟲',
            Beetle: '甲蟲',
            Beetlewarrior: '甲蟲戰士',
        },
        'zh-tw': {
            Download: '下載',
            Stagbeetle: '鍬形蟲',
            Beetle: '甲蟲',
            Beetlewarrior: '甲蟲戰士',
        },
        'en': {
            Download: 'Download',
            Stagbeetle: 'Stagbeetle',
            Beetle: 'Beetle',
            Beetlewarrior: 'Beetlewarrior',
        },
        'fr': {
            Download: 'Télécharger',
            Stagbeetle: 'Lucane',
            Beetle: 'Scarabée',
            Beetlewarrior: 'Guerrier scarabée',
        },
        'ja': {
            Download: 'ダウンロード',
            Stagbeetle: 'クワガタムシ',
            Beetle: '甲虫',
            Beetlewarrior: '甲虫戦士',
        },
        'ko': {
            Download: '다운로드',
            Stagbeetle: '사슴벌레',
            Beetle: '딱정벌레',
            Beetlewarrior: '딱정벌레 전사',
        },
        'de': {
            Download: 'Herunterladen',
            Stagbeetle: 'Hirschkäfer',
            Beetle: 'Käfer',
            Beetlewarrior: 'Käferkrieger',
        },
        'ru': {
            Download: 'Скачать',
            Stagbeetle: 'Жук-олень',
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

    static get Instance() {
        return super.GetInstance<LanguageManager>();
    }
}
