
import { _decorator, Component, Node, CCFloat, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Parallax')
export class Parallax extends Component {

    @property({type:CCFloat})
    public moveSpeed:number = 1;

    @property({type:CCFloat})
    public offset:number = 0;

    private _newXPos:number = 0;

    start () {
    }

    update(deltaTime:number) {

        this._newXPos =  ( ( Date.now() * -this.moveSpeed) % this.offset );
        this.node.position = new Vec3(
            this._newXPos,
            this.node.position.y,
            this.node.position.z
        )
    }
}
