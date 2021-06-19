
import { _decorator, Vec2, Vec3, Contact2DType, Collider2D} from 'cc';
import { Platform } from "./Platform";
const { ccclass, property } = _decorator;

@ccclass('Ground')
export class Ground extends Platform {

    private _active = false;
    private _startPos:Vec3 = new Vec3();

    start() {
        super.start();
        this._startPos = this.node.position;
    }

    lateUpdate() {
        if (this._rb && this._active) {
            this._rb.linearVelocity = this.force;
        }
    }

    reset() {
        this._active = false;
        this.node.position = this._startPos;
    }

    activate() {
        this._active = true;
    }

}