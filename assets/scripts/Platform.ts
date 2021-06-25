
import { _decorator, Component, RigidBody2D, Vec2, Collider2D } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Platform')
export class Platform extends Component {

    @property({type:Vec2})
    public force:Vec2 = new Vec2(-5, 0);
    
    protected _rb:RigidBody2D|null = null;
    protected _collider:Collider2D|null = null;

    start () {
        if (!this._rb) {
            this._rb = this.getComponent(RigidBody2D);
        }

        if (!this._collider) {
            this._collider = this.getComponent(Collider2D);
        }
    }

    lateUpdate(deltaTime:number) {
        if (this._rb) {
            this._rb.linearVelocity = this.force;
        }
    }
}
