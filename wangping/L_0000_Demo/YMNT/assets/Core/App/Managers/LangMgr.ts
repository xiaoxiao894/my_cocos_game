import { director, Director, sys } from "cc";
import { EDITOR } from "cc/env";
import { dataMgr } from "./DataMgr";
import { eventMgr } from "./EventMgr";

export enum LanguageType {
    zh_cn = 'zh_cn', //中文简体
    zh_ft = 'zh_ft', //中文繁体
    en = 'en', //英语
    ko = 'ko', //韩语
    ja = 'ja', //日语
    de = 'de', //德语
    fr = 'fr', //法语
    es = 'es', //西班牙语
    pt = 'pt', //葡萄牙语
    it = 'it', //意大利语 
    be = 'be', //白俄罗斯语
    uk = 'uk', //乌克兰语 
    id = 'id', //印度尼西亚语
    ru = 'ru', //俄语
    ar = 'ar', //阿拉伯语
    vi = 'vi', //越南语
}

/** 
 * 语言管理器
 * 提供语言本地化：配置语言数据、更改语言设置、获取翻译文本。 
 */
class LangMgr {
    /** 当前选择的语言 */
    private currLang: string = "zh_cn"; // 设置默认值避免undefined

    /** 缓存的语言数据 */
    private langData: Record<string, Record<string, string>> = {};

    /** 支持的语言列表 */
    private supportedLanguages: string[] = ["zh_cn", "en", "fr", "zh_ft", "ja", "ko"];

    /** 是否已初始化 */
    private initialized: boolean = false;

    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() {
        // 立即执行一次初始化，以便在组件onLoad时能获取到语言
        this.init();
        
        if (!EDITOR) {
            // 场景加载后再次初始化，确保读取到正确的语言设置
            director.once(Director.EVENT_AFTER_SCENE_LAUNCH, this.init, this);
        }
    }

    /** 单例实例 */
    public static readonly instance: LangMgr = new LangMgr();

    /** 初始化多语言 */
    private init(): void {
        if (this.initialized) return;
        
        // // 先尝试获取用户保存的语言设置
        // const savedLang = dataMgr.getText("language");
        // if (savedLang && this.supportedLanguages.includes(savedLang)) {
        //     this.currLang = savedLang;
        // } else {
        //     // 如果没有用户保存的语言设置，则尝试使用系统语言
        //     const sysLang = this.getSystemLanguage();
        //     if (this.supportedLanguages.includes(sysLang)) {
        //         this.currLang = sysLang;
        //         // 保存系统语言设置到用户数据
        //         dataMgr.setData("language", sysLang);
        //     }
        //     // 如果系统语言不在支持列表中，则使用默认语言(已在类初始化时设置为"zh")
        // }


        // 试玩广告默认使用系统语言
        const sysLang = this.getSystemLanguage();
        if (this.supportedLanguages.includes(sysLang)) {
            this.currLang = sysLang;
            // 保存系统语言设置到用户数据
            dataMgr.setData("language", sysLang);
        }
        
        this.initialized = true;
    }

    /**
     * 获取系统语言
     * @returns 系统语言代码，如"zh"、"en"等
     */
    private getSystemLanguage(): string {
        let language: LanguageType = LanguageType.en;
        let lang = navigator.language;
        lang = lang.split('-')[0];
        switch (lang) {
            case 'zh': {
                switch (navigator.language) {
                    case 'zh-CN': {
                        language = LanguageType.zh_cn;
                        break;
                    }
                    default: {//除大陆外其他地区统一都为繁体
                        language = LanguageType.zh_ft;
                        break;
                    }
                }
                break;
            }
            case 'en': {
                language = LanguageType.en;
                break;
            }
            case 'ko': {
                language = LanguageType.ko;
                break;
            }
            case 'ja': {
                language = LanguageType.ja;
                break;
            }
            case 'de': {
                language = LanguageType.de;
                break;
            }
            case 'fr': {
                language = LanguageType.fr;
                break;
            }
            case 'es': {
                language = LanguageType.es;
                break;
            }
            case 'pt': {
                language = LanguageType.pt;
                break;
            }
            case 'it': {
                language = LanguageType.it;
                break;
            }
            case 'be': {
                language = LanguageType.be;
                break;
            }
            case 'uk': {
                language = LanguageType.uk;
                break;
            }
            case 'id': {
                language = LanguageType.id;
                break;
            }
            case 'ru': {
                language = LanguageType.ru;
                break;
            }
            case 'ar': {
                language = LanguageType.ar;
                break;
            }
            case 'vi': {
                language = LanguageType.vi;
                break;
            }
            default: {
                language = LanguageType.en;
                break;
            }
        }
        
        return language;
    }

    /** 获取当前语言 */
    public get lang(): string {
        return this.currLang;
    }
    
    /** 获取所有支持的语言 */
    public get languages(): string[] {
        return [...this.supportedLanguages];
    }

    /** 更改当前语言 */
    public changeLang(langCode: string): void {
        if (this.currLang === langCode || !this.supportedLanguages.includes(langCode)) return;

        this.currLang = langCode;
        dataMgr.setData("language", langCode);
        eventMgr.emit("langChange");
    }

    /** 注册语言数据 */
    public registerLanguageData(langCode: string, data: Record<string, string>): void {
        if (!this.supportedLanguages.includes(langCode)) {
            this.supportedLanguages.push(langCode);
        }
        
        this.langData[langCode] = { 
            ...this.langData[langCode], 
            ...data 
        };
    }

    /** 
     * 批量注册多种语言的数据
     * @param data 格式为: { key: { zh: "中文", en: "English" } }
     */
    public registerMultiLanguageData(data: Record<string, Record<string, string>>): void {
        // 提取所有语言代码
        const allLangCodes = new Set<string>();
        Object.values(data).forEach(translations => {
            Object.keys(translations).forEach(lang => allLangCodes.add(lang));
        });
        
        // 为每种语言整理数据并注册
        allLangCodes.forEach(langCode => {
            const langData: Record<string, string> = {};
            
            Object.entries(data).forEach(([key, translations]) => {
                if (translations[langCode]) {
                    langData[key] = translations[langCode];
                }
            });
            
            this.registerLanguageData(langCode, langData);
        });
    }

    /** 根据键获取对应的翻译文本 */
    public getLanguage(key: string, def: string = ""): string {
        const text = this.langData[this.currLang]?.[key] ?? def;
        return text;
    }
}

/** 导出单例实例 */
export const langMgr = LangMgr.instance;

// 立即注册多语言数据，确保在使用前已加载
langMgr.registerMultiLanguageData({
    "Download": {
        "zh_cn": "下载",
        "en": "Download",
        "fr": "Télécharger",
        "zh_ft": "下載",
        "ja": "ダウンロード",
        "ko": "다운로드"
    },
    "GameWin": {
        "zh_cn": "游戏胜利",
        "en": "GAME WIN",
        "fr": "VICTOIRE",
        "zh_ft": "遊戲勝利",
        "ja": "ゲーム勝利",
        "ko": "게임 승리"
    },
    "GameFail": {
        "zh_cn": "游戏失败",
        "en": "GAME LOSE",
        "fr": "ÉCHEC DU JEU",
        "zh_ft": "遊戲失敗",
        "ja": "ゲーム敗北",
        "ko": "게임 실패"
    },
    "HurtTips": {
        "zh_cn": "招募伙伴战斗",
        "en": "Recruit partners to fight",
        "fr": "Recruter des partenaires pour combattre",
        "zh_ft": "招募夥伴戰鬥",
        "ja": "パートナーを募集して戦う",
        "ko": "파트너를 모집하여 전투"
    },
    "guide_attCron": {
        "zh_cn": "采集玉米粒",
        "en": "Collect corn kernels",
        "fr": "Collecter les noyaux de maïs",
        "zh_ft": "採集玉米粒",
        "ja": "マイズの粒を収集する",
        "ko": "옥수수 씨앗을 수집하세요"
    },
    "guide_goToChuShi": {
        "zh_cn": "将玉米做成汤",
        "en": "Make soup with corn",
        "fr": "Faire de la soupe avec le maïs",
        "zh_ft": "將玉米做成湯",
        "ja": "マイズをスープにする",
        "ko": "옥수수를 스ープ로 만드세요"
    },
    "guide_goToTouFang": {
        "zh_cn": "给虫子喝汤",
        "en": "Give soup to the worm",
        "fr": "Donner de la soupe au ver",
        "zh_ft": "給蟲子喝湯",
        "ja": "虫にスープを飲ませる",
        "ko": "벌레에게 스푸쉬 주기"
    },
    "guide_goFight": {
        "zh_cn": "攻击蜘蛛",
        "en": "Attack the spider",
        "fr": "Attaquer la tête de ver",
        "zh_ft": "攻擊蜘蛛",
        "ja": "蜘蛛を攻撃する",
        "ko": "거미를 공격하세요"
    },
    "guide_unlockTransporter": {
        "zh_cn": "招募采集工",
        "en": "Recruit a collector",
        "fr": "Recruter un collecteur",
        "zh_ft": "招募採集工",
        "ja": "採集工を募集する",
        "ko": "수집가를 모집하세요"
    },
    "guide_unlockSell": {
        "zh_cn": "解锁售卖员",
        "en": "Unlock the seller",
        "fr": "Débloquer le vendeur",
        "zh_ft": "解鎖售賣員",
        "ja": "販売員を解鎖する",
        "ko": "판매원을 해금하세요"
    },
    "guide_unlockGun": {
        "zh_cn": "升级武器",
        "en": "Upgrade the weapon",
        "fr": "Améliorer l'arme",
        "zh_ft": "升級武器",
        "ja": "武器をアップグレードする",
        "ko": "무기를 업그레이드하세요"
    }
});
