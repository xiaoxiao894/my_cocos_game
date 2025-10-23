import * as cc from "cc";
import { DEBUG, PREVIEW } from "cc/env";

/**
 * 全局配置
 * @internal
 */
namespace adaptation_config {

	/** 视图 */
	export namespace view {

		/** 适配模式 */
		export enum adaptation_mode {
			/** 无 */
			none,
			/** 自适应（更宽定高，更高定宽） */
			adaptive,
			/** 固定尺寸（屏幕尺寸不同大小相同） */
			fixed_size,
		}

		/** 适配类型 */
		export const adaptation_type: adaptation_mode = adaptation_mode.none;
		/** 初始设计尺寸 */
		export const original_design_size: Omit<Readonly<cc.Size>, "set"> = cc.size(960, 640);
	}
}

if (DEBUG) {
	window["global_config"] = adaptation_config;
}

export default adaptation_config;
