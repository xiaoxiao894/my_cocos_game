import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import super_html_playable from './super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('buttonEnent')
export class buttonEnent extends Component {
    download() {
        console.log("tttttttttttttt")
        super_html_playable.download();
    }

    protected start(): void {
        let fun = () => {
            tween(this.node)
            .sequence(
                tween(this.node).to(0.3, { scale: new Vec3(0.9, 0.9, 0.9) }),
                tween(this.node).to(0.3, { scale: new Vec3(1, 1, 1) })
            )
            .repeatForever()
            .start();
                            
        }
        fun();
    }

}


