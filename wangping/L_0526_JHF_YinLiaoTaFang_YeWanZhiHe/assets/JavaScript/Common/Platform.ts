
// @ts-nocheck
import { PlatformEnum } from "../Enum";


//打包过程会重置这个值，变成平台类型
export const AdvChannels: string = '{{__adv_channels_adapter__}}';
export const storeIOS = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
export const storeANDROID = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";

// applovin google ironsource moloco unity
export default class Platform {

    private _lockStore: boolean = false;

    private static _instance: Platform = null;

    public static get instance() {
        if (!this._instance) {
            this._instance = new Platform();
        }
        return this._instance;
    }

    public init() {
        this._lockStore = false;
        //this.launchPlayable();
    }


    // private launchPlayable () {

    // }

    /**
     * 跳转
     */
    public jumpStore(): void {
        // console.log(`平台：${AdvChannels} lockstore:${this._lockStore}`);
        switch (AdvChannels) {
            case PlatformEnum.AppLovin:
            case PlatformEnum.Unity:
                if (this._lockStore) return;
                if (/android/i.test(navigator.userAgent)) {
                    this._lockStore = true;
                    window.mraid?.open(storeANDROID);
                    setTimeout(() => {
                        this._lockStore = false;
                    }, 500)
                } else {
                    this._lockStore = true;

                    window.mraid?.open(storeIOS);
                    setTimeout(() => {
                        this._lockStore = false;
                    }, 500)
                }
                if (!window.mraid) {
                    this.defaultJump();
                    console.error(`${AdvChannels}平台包 当前环境没有 mraid 环境`);
                }
                break;
            case PlatformEnum.IronSource:
                if (this._lockStore) return;
                this._lockStore = true;
                dapi?.openStoreUrl();
                setTimeout(() => {
                    this._lockStore = false;
                }, 500);
                if (!dapi) {
                    this.defaultJump();
                    console.error(`${AdvChannels}平台包 当前环境没有 dapi 环境`);
                }
                break;
            case PlatformEnum.Moloco:

                if (typeof window.FbPlayableAd !== "undefined") {
                    window.FbPlayableAd.onCTAClick();
                } else {
                    this.defaultJump();
                    console.error(`${AdvChannels}平台包 当前环境没有 FbPlayableAd 环境`);
                }
                break;
            case PlatformEnum.Google:
                if (this._lockStore) return;
                this._lockStore = true;
                ExitApi?.exit();
                setTimeout(() => {
                    this._lockStore = false;
                }, 500);
                if (!ExitApi) {
                    this.defaultJump();
                    console.error(`${AdvChannels}平台包 当前环境没有 ExitApi 环境`);
                }
                break;
            case PlatformEnum.Facebook:
                if (window._lockStore) return;
                window._lockStore = true;
                setTimeout(function () {
                    window._lockStore = false;
                }, 500);

                if (typeof window.FbPlayableAd !== "undefined") {
                    window.FbPlayableAd.onCTAClick();
                } else {
                    this.defaultJump();
                    console.error(`${AdvChannels}平台包 当前环境没有 FbPlayableAd 环境`);
                }
                break;
            case PlatformEnum.Pangle:
            case PlatformEnum.Tiktok:
                if (window._lockStore) return;
                window._lockStore = true;
                setTimeout(function () {
                    window._lockStore = false;
                }, 500)
                window.openAppStore();

                break;
            case PlatformEnum.Vungle:
                if (window._lockStore) return;
                window._lockStore = true;
                window.parent.postMessage('download', '*');
                setTimeout(function () {
                    window._lockStore = false;
                }, 500)
                break;
            default:
                this.defaultJump();
                console.error(`${AdvChannels}平台未接入或接入有问题，请联系开发人员`);
                break;

        }
    }

    private defaultJump() {
        window.open(/android/i.test(navigator.userAgent) ? storeANDROID : storeIOS, "_blank");
    }

}