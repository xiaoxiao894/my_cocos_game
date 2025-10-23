import Singleton from "../../Base/Singleton";
import RockerLogic from "./RockerLogic";

export default class RockerManager extends Singleton {
    public static get instance() {
        return this.getInstance<RockerManager>();
    }
    public rockerLogic: RockerLogic;



    public init(r: number) {
        this.rockerLogic = new RockerLogic(r);
    }

    /**获取遥感方向  3D情况下 2d y轴对应3d z轴*/
    public get rockerDirection() {
        return this.rockerLogic.rockerDirection;
    }

    public get isMove() {
        return this.rockerLogic.isMove;
    }

}