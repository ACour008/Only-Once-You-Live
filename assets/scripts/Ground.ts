
import { _decorator, Vec3, Vec2} from 'cc';
import { Platform } from "./Platform";
const { ccclass } = _decorator;

@ccclass('Ground')
export class Ground extends Platform {

    private _active = false;
    private _startPos:Vec3 = new Vec3(80.214, -265, 0);

    start() {
        super.start();
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