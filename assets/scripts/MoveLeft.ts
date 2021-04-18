
import { _decorator, Component, CCFloat, Vec3, CCBoolean} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveLeft')
export class MoveLeft extends Component {

    @property()
    public active:boolean = false;

    @property({type:CCFloat})
    public Speed:number = 350;

    @property({type:CCFloat})
    public LeftBoundary:number = -10;

    @property({type:Vec3})
    public startPosition:Vec3 = new Vec3();

    reset() {
        this.node.position = this.startPosition;
    }

    update (deltaTime: number) {
        if (this.active) {
            let x = this.node.position.x - deltaTime * this.Speed;
            this.node.position = new Vec3(x,this.node.position.y, this.node.position.z);
            if (this.node.position.x < this.LeftBoundary) {
                this.active = false;
            }
        }
    }
}