
import { _decorator, Component, RigidBody2D, Vec2, macro, BoxCollider2D, Contact2DType, Collider2D, IPhysics2DContact} from 'cc';
import { ACEventHandler } from './ACEventHandler';

const { ccclass, property } = _decorator;

@ccclass('Platform')
export class Platform extends Component {

    @property({type:Vec2})
    public force:Vec2 = new Vec2(-5, 0);
    
    private _rb:RigidBody2D|null = null;
    private _collider:BoxCollider2D|null = null;

    get rigidBody() {
        return this._rb;
    }

    start () {
        if (!this._rb) {
            this._rb = this.getComponent(RigidBody2D);
        }

        if (!this._collider) {
            this._collider = this.getComponent(BoxCollider2D);
            // this._collider?.on()
        }
    }

    lateUpdate(deltaTime:number) {
        if (this._rb) {
            this._rb.linearVelocity = this.force;
        }
    }
}
