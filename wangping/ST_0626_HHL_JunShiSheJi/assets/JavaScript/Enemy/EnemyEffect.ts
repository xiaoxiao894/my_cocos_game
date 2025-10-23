
import { _decorator, CCInteger, Component, Label, Node, RigidBody, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyEffect')
export class EnemyEffect extends Component {

    @property(CCInteger)
    bloodNum:number = 2240;
    @property(Label)
    bloodLabel:Label = null;
    // @property(SkeletalAnimation)
    // ani:SkeletalAnimation = null;

    
    private _isDead:boolean = false;

    public init(){
        
    }

    update(deltaTime: number) {

    }

}


