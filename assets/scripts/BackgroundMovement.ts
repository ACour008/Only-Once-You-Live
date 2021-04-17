
import { _decorator, Component, BoxCollider2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundMovement')
export class BackgroundMovement extends Component {

    private _startPosition:Vec3|null = null;
    private _repeatWidth:number = 0;

    start () {
        this._startPosition = new Vec3(this.node.position.x, this.node.position.y, this.node.position.z);
        let collider = this.getComponent(BoxCollider2D);
        if (collider) {
            this._repeatWidth = collider.size.x / 2;
        }

    }

    update(deltaTime: number) {
        let x = this.node.position.x - deltaTime * 250;
        this.node.position = new Vec3(x,this.node.position.y, this.node.position.z);

        if (this._startPosition && (this.node.position.x < this._startPosition.x - this._repeatWidth)) {
            this.node.position = this._startPosition;
        }
    }
}