
import { _decorator, Vec3, Vec2, CCBoolean } from 'cc';
import { Platform } from "./Platform";
const { ccclass, property } = _decorator;

@ccclass('Ground')
export class Ground extends Platform {

    @property(CCBoolean)
    private active = false;

    @property(Vec3)
    private startPosition:Vec3 = new Vec3(80.214, -265, 0);

    start() {
        super.start();
    }

    lateUpdate() {
        if (this._rb) {
            if (this.active) {
                this._rb.linearVelocity = this.force;
            }
        }
    }

    reset() {
        this.active = false;
        this.node.setPosition(this.startPosition);
        if (this._rb) this._rb.linearVelocity = Vec2.ZERO;
    }

    activate(active:boolean):void {
        this.active = active;
    }
}