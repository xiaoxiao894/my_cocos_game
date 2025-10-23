import { _decorator, Color, Component, Graphics, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIPartnerEnergyBarManager')
export class UIPartnerEnergyBarManager extends Component {
    @property
    radius: number = 20;

    @property
    duration: number = 30.0;

    private progressBarGraphics: Graphics = null!;
    private elapsed = 0;
    private startTime = 0;

    start() {
        this.startTime = performance.now();

        const circleOne = this.node.getChildByName("Circle1");
        const circleTwo = this.node.getChildByName("Circle2");
        const circleThree = this.node.getChildByName("Circle3");

        this.createGraphics(circleOne, "#00FF00", "#00FF00", 30);
        this.createGraphics(circleTwo, "#FFFFFF", "#FFFFFF", 25);

        const color = new Color();
        this.progressBarGraphics = circleThree.getComponent(Graphics) || circleThree.addComponent(Graphics);
        this.progressBarGraphics.fillColor = Color.fromHEX(color, "#00FF00");
    }

    createGraphics(node: Node, fillColor: string, strokeColor: string, radius: number) {
        const graphics = node.getComponent(Graphics) || node.addComponent(Graphics);
        graphics.fillColor = Color.fromHEX(new Color(), fillColor);
        graphics.strokeColor = Color.fromHEX(new Color(), strokeColor);

        graphics.circle(0, 0, radius);
        graphics.fill();
        graphics.stroke();
    }

    update(deltaTime: number) {
        // 
        this.updateUiFollow();

        this.elapsed += deltaTime;
        const progress = Math.min(this.elapsed / this.duration, 1);

        const startAngle = Math.PI / 2;
        const endAngle = startAngle + Math.PI * 2 * progress;

        this.progressBarGraphics.clear();
        this.progressBarGraphics.moveTo(0, 0);
        this.progressBarGraphics.arc(0, 0, this.radius, startAngle, endAngle, true);
        this.progressBarGraphics.lineTo(0, 0);
        this.progressBarGraphics.fill();

        if (progress >= 1) {
            console.log("进度完成");
        }
    }

    updateUiFollow() {

    }
}
