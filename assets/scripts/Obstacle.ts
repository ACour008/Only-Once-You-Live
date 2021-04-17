import { Vec2, Vec3, Component, _decorator, CCFloat } from "cc";
const { ccclass, property } = _decorator;

enum ObstacleType{
    OT_BLOCK,
    OT_HARM,
    OT_SLOW,
    OT_FAST
}

@ccclass('Obstacle')
export class Obstacle extends Component {

    @property({type:CCFloat})
    public Speed:number = 350;

    @property({type:CCFloat})
    public LeftBoundary:number = -10;

    private _obstacleType:ObstacleType = ObstacleType.OT_BLOCK;

    start () {
    }

    update (deltaTime: number) {
        let x = this.node.position.x - deltaTime * this.Speed;
        this.node.position = new Vec3(x,this.node.position.y, this.node.position.z);
        if (this.node.position.x < this.LeftBoundary) {
            this.node.destroy();
        }
    }
}