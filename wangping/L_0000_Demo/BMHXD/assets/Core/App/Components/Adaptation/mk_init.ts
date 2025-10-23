import * as cc from "cc";
import { DEBUG, EDITOR } from "cc/env";
import adaptation_config from "./global_config";

// 初始化逻辑
if (!EDITOR) {
	// 保存初始设计分辨率
	cc.director.once(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
		(adaptation_config.view.original_design_size as cc.Size).set(cc.view.getDesignResolutionSize());
	});

	// 屏幕大小改变事件分发
	cc.screen.on("window-resize", () => {
		app.event.emit("view_resize");
	});

	cc.screen.on("fullscreen-change", () => {
		app.event.emit("view_resize");
	});

	cc.screen.on("orientation-change", () => {
		app.event.emit("view_resize");
	});
}