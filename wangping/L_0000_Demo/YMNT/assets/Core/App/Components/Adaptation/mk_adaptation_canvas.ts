import { EDITOR } from "cc/env";
import { _decorator, Canvas, Component, director, Director, ResolutionPolicy, view, screen } from "cc";
import adaptation_config from "./global_config";

const { ccclass, disallowMultiple } = _decorator;

/**
 * canvas 适配
 * @noInheritDoc
 */
@ccclass
@disallowMultiple
export default class mk_adaptation_canvas extends Component {
	/* ------------------------------- 生命周期 ------------------------------- */
	protected onLoad(): void {
		// 事件监听
		app.event.on("view_resize", this.adaptation, this);
	}

	protected onEnable(): void {
		// 初始化视图
		this.adaptation();
	}

	protected onDestroy(): void {
		app.event.off("view_resize", this);
	}

	/* ------------------------------- 功能 ------------------------------- */
	/** 适配 */
	async adaptation(): Promise<void> {
		// await new Promise((resolve) => this.scheduleOnce(resolve));

		const canvas = director.getScene()?.getComponentInChildren(Canvas);

		// 安检
		if (!canvas) {
			return;
		}

		/** 真实尺寸 */
		const frame_size = screen.windowSize;

		switch (adaptation_config.view.adaptation_type) {
			// 自适应
			case adaptation_config.view.adaptation_mode.adaptive: {
				/** 设计尺寸 */
				const design_size = adaptation_config.view.original_design_size;
				
				// 检查设计尺寸是否有效
				if (design_size.width <= 0 || design_size.height <= 0) {
					app.log.warn("mk_adaptation_canvas: 设计尺寸不能为零");
					return;
				}

				// 检查真实尺寸是否有效
				if (frame_size.width <= 0 || frame_size.height <= 0) {
					app.log.warn("mk_adaptation_canvas: 真实尺寸不能为零");
					return;
				}
				
				/** 真实尺寸比设计尺寸高 */
				const higher_b = frame_size.height / frame_size.width > design_size.height / design_size.width;

				if (higher_b) {
					view.setDesignResolutionSize(
						design_size.width,
						frame_size.height * (design_size.width / frame_size.width),
						ResolutionPolicy.FIXED_WIDTH
					);
				} else {
					view.setDesignResolutionSize(
						frame_size.width * (design_size.height / frame_size.height),
						design_size.height,
						ResolutionPolicy.FIXED_HEIGHT
					);
				}

				break;
			}

			// 固定尺寸
			case adaptation_config.view.adaptation_mode.fixed_size: {
				view.setDesignResolutionSize(frame_size.width, frame_size.height, ResolutionPolicy.UNKNOWN);
				break;
			}
		}
	}
}

// 自动添加至场景节点
if (!EDITOR && adaptation_config.view.adaptation_type !== adaptation_config.view.adaptation_mode.none) {
	director.on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
		const canvas_node = director.getScene()?.getComponentInChildren(Canvas)?.node;

		if (!canvas_node || canvas_node.getComponent(mk_adaptation_canvas)) {
			return;
		}

		canvas_node.addComponent(mk_adaptation_canvas);
	});
}
