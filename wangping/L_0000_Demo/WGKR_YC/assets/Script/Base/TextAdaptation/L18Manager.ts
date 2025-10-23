// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Enum } from "cc";
// import I18nLabel from "./I18nLabel";
import { DEBUG } from "cc/env";

export enum LanguageType {
    default,
    zh_cn, //中文简体
    zh_ft, //中文繁体
    en, //英语
    ko, //韩语
    ja, //日语
    de, //德语
    fr, //法语
    es, //西班牙语
    pt, //葡萄牙语
    it, //意大利语 
    be, //白俄罗斯语
    uk, //乌克兰语 
    id, //印度尼西亚语
    ru, //俄语
    ar, //阿拉伯语
    vi, //越南语
}

const { ccclass, property } = _decorator;

// const dataJson = {
//     'test': {
//         default: 'test',
//         zh: '测试',
//         en: 'test'
//     },
//     'Walking': {
//         default: 'Walking',
//         zh: '行走',
//         en: 'Walking'
//     },
//     'Paused': {
//         default: 'Paused',
//         zh: '暫停',
//         en: 'Paused'
//     }

// }

@ccclass("L18nManager")
export default class L18nManager extends Component {
    private static _instance: L18nManager = null;

    @property({ type: Enum(LanguageType), displayName: '测试语言', tooltip: 'zh_cn : 简体中文\n zh_tw : 繁体中文\n en : 英语\n ko : 韩语\n ja : 日语\n de : 德语\n fr : 法语\n es : 西班牙语\n pt : 葡萄牙语\n it : 意大利语\n be : 白俄罗斯语\n uk : 乌克兰语\n id : 印度尼西亚语\n ar : 阿拉伯语' })
    language: LanguageType = LanguageType.en;

    public static get instance() {
        return this._instance;
    }

    onLoad() {
        L18nManager._instance = this;

        if (!DEBUG) {
            let lang = navigator.language;
            lang = lang.split('-')[0];
            switch (lang) {
                case 'zh': {
                    switch (navigator.language) {
                        case 'zh-CN': {
                            this.language = LanguageType.zh_cn;
                            break;
                        }
                        default: {//除大陆外其他地区统一都为繁体
                            this.language = LanguageType.zh_ft;
                            break;
                        }
                    }
                    break;
                }
                case 'en': {
                    this.language = LanguageType.en;
                    break;
                }
                case 'ko': {
                    this.language = LanguageType.ko;
                    break;
                }
                case 'ja': {
                    this.language = LanguageType.ja;
                    break;
                }
                case 'de': {
                    this.language = LanguageType.de;
                    break;
                }
                case 'fr': {
                    this.language = LanguageType.fr;
                    break;
                }
                case 'es': {
                    this.language = LanguageType.es;
                    break;
                }
                case 'pt': {
                    this.language = LanguageType.pt;
                    break;
                }
                case 'it': {
                    this.language = LanguageType.it;
                    break;
                }
                case 'be': {
                    this.language = LanguageType.be;
                    break;
                }
                case 'uk': {
                    this.language = LanguageType.uk;
                    break;
                }
                case 'id': {
                    this.language = LanguageType.id;
                    break;
                }
                case 'ru': {
                    this.language = LanguageType.ru;
                    break;
                }
                case 'ar': {
                    this.language = LanguageType.ar;
                    break;
                }
                case 'vi': {
                    this.language = LanguageType.vi;
                    break;
                }
                default: {
                    this.language = LanguageType.en;
                    break;
                }
            }
        }
    }


    /**获取当前语言 */
    public get lang(): LanguageType {
        return this.language;
    }
}
