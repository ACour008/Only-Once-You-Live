
import { _decorator, CCFloat, Contact2DType, Collider2D, IPhysics2DContact, Camera} from 'cc';
import { CameraShake } from './CameraShake';
import { GameManager, GameState } from './GameManager';
import { Platform } from './Platform';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Platform {

    @property(CCFloat)
    public angularForce:number = 5;

    lateUpdate(deltaTime:number) {
        if (this._rb) {
            this._rb.linearVelocity = this.force;
            this._rb.angularVelocity = this.angularForce;
        }
    }
}