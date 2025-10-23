import { _decorator, Component, Node } from 'cc';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
const { ccclass, property } = _decorator;

@ccclass('ButtonDownLoad')
export class ButtonDownLoad extends Component {

    public onClickDownLoad() {
        console.log("DownLoad")
        // SuperPackage.Instance.Download();
    }

    protected start(): void {
        // SuperPackage.Instance.AutoDownload();

    }

}


