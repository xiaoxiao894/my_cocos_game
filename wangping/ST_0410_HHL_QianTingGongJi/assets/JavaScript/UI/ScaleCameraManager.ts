import { _decorator, Camera, Component, EventTouch, Label, Node, ProgressBar, Quat, Slider, Vec3 } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;

@ccclass('ScaleCameraManager')
export class ScaleCameraManager extends Component {
    @property(Camera)
    mainCamera: Camera = null;

    @property(Slider)
    slider: Slider = null;

    @property(Label)
    label: Label = null;

    currentValue: number = 1.0;
    private step: number = 0.1;
    private maxValue: number = 5.0;     // 最大值为5.0
    private minValue: number = 1.0;     // 最小值为1.0

    private initialCameraPosition: Vec3 = null;
    zoomFactor = 4;


    start() {
        DataManager.Instacne.scaleCameraManager = this;

        // 确保minValue和maxValue保留一位小数
        this.minValue = parseFloat(this.minValue.toFixed(1));
        this.maxValue = parseFloat(this.maxValue.toFixed(1));

        // 初始化slider，将当前值映射到 [0, 1] 区间
        this.slider.progress = (this.currentValue - this.minValue) / (this.maxValue - this.minValue); // 映射到 [0, 1] 区间

        // 监听Slider的变化
        this.slider.node.on('slide', this.onSliderChange, this);

        this.initialCameraPosition = this.mainCamera.node.position.clone();
    }

    resetSlider() {
        this.currentValue = 1.0;
        this.slider.progress = (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
        this.initialCameraPosition = Vec3.ZERO;
    }

    onSliderChange() {
        DataManager.Instacne.UIManager.hideTitleNode();

        const sliderValue = this.slider.progress;
        // 将slider的值映射到 [minValue, maxValue] 区间
        let mappedValue = sliderValue * (this.maxValue - this.minValue) + this.minValue;

        mappedValue = parseFloat(mappedValue.toFixed(1));

        // 判断值是否达到下一个区间，进行增减操作
        if (parseFloat(Math.abs(mappedValue - this.currentValue).toFixed(1)) >= this.step) {
            this.currentValue = mappedValue;

            // 确保当前值不超过最大值和最小值，并保留一位小数
            this.currentValue = Math.min(this.maxValue, Math.max(this.minValue, this.currentValue));
            this.currentValue = parseFloat(this.currentValue.toFixed(1));

            // 更新slider的进度
            // this.slider.progress = (this.currentValue - this.minValue) / (this.maxValue - this.minValue);

            this.label.string = `x${this.currentValue.toFixed(1)}`;

            // 更新相机的Z轴位置，根据currentValue进行缩放
            let cameraNode = this.mainCamera.node; // 获取相机节点

            let len: number = 0;

            len = (this.currentValue - this.minValue) * this.zoomFactor;

            DataManager.Instacne.expansionRadius = len;
            //方向向量
            let distance = cameraNode.forward.clone().multiplyScalar(len);
            distance.add(this.initialCameraPosition);

            // 通过Z轴的变化来模拟缩放效果
            cameraNode.setPosition(distance);

            DataManager.Instacne.cameraManager.updateCameraPosition(true);
        }
    }

    onDestroy() {
        // this.slider.node.off('slide', this.onSliderChange, this);
    }
}

