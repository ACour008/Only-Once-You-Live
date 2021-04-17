
import { _decorator, Component, CCFloat, Vec3} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveLeft')
export class MoveLeft extends Component {
    
    @property({type:CCFloat})
    public speed:number = 250;

    start () {
        // [3]
    }

    update (deltaTime: number) {
        let x = this.node.position.x - deltaTime * this.speed;
        this.node.position = new Vec3(x,this.node.position.y, this.node.position.z);
    }
}