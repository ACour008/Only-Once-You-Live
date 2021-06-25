
import { _decorator, Vec3, Vec2, BoxCollider2D, ECollider2DType, IPhysics2DContact} from 'cc';
import { Platform } from "./Platform";
const { ccclass } = _decorator;

@ccclass('Ground')
export class Ground extends Platform {

    private _active = false;
    private _startPos:Vec3 = new Vec3(80.214, -265, 0);
    private _boxCollider:BoxCollider2D|null = null; 

    start() {
        super.start();
        this._boxCollider = this.getComponent(BoxCollider2D);
    }

    update() {
    }

    lateUpdate() {
        if (this._rb) {
            if (this._active) {
                this._rb.linearVelocity = this.force;
            }
        }
    }

    reset() {
        this._active = false;
        this.node.setPosition(this._startPos);
        if (this._rb) this._rb.linearVelocity = Vec2.ZERO;
    }

    activate(active:boolean) {
        this._active = active;
    }
}