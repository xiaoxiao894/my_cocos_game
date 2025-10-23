import { _decorator, sys } from 'cc';
import Singleton from '../Base/Singleton';
const { ccclass } = _decorator;

@ccclass('LanguageManager')
export class LanguageManager extends Singleton {
    private static DICT = {
        'zh': {
            Download: '立即试玩',
            Language: "zh",
        },
        'zh-cn': {
            Download: '立即试玩',
            Language: "zh-cn",
        },
        'zh-hk': {
            Download: '立即試玩',
            Language: "zh-hk",
        },
        'zh-mo': {
            Download: '立即試玩',
            Language: "zh-mo",
        },
        'zh-tw': {
            Download: '立即試玩',
            Language: "zh-tw",
        },
        'en': {
            Download: 'Play Now',
            Language: "en",
        },
        'fr': {
            Download: 'Jouer maintenant',
            Language: "fr",
        },
        'ja': {
            Download: '今すぐプレイ',
            Language: "ja",
        },
        'ko': {
            Download: '지금 플레이',
            Language: "ko",
        },
        'de': {
            Download: 'Jetzt spielen',
            Language: "de",
        },
        'ru': {
            Download: 'Играть сейчас',
            Language: "ru",
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
