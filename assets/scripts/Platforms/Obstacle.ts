
import { _decorator, CCFloat, Vec2, Vec3 } from 'cc';
import { Platform } from './Platform';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Platform {

    @property(CCFloat)
    private angularForce:number = 5;

    @property(CCFloat)
    private frequency:number = 5;

    @property(CCFloat)
    private magnitude:number = 10;

    @property(CCFloat)
    private offset:number = 0;

    lateUpdate(dt:number) {
        if (this._rb) {
            let force:Vec2 = new Vec2(this.force.x, 0);
            let now = new Date().getTime();
            let yPos = Math.sin(now * this.frequency + this.offset) * this.magnitude;

            this.node.position = new Vec3(this.node.position.x, yPos, this.node.position.y);
            this._rb.linearVelocity = force;
            this._rb.angularVelocity = this.angularForce;
        }
    }

    public setFrequency(newFrequency:number):void {
        this.frequency = newFrequency;
    }

    public setMagnitude(newMagnitude:number):void {
        this.magnitude = newMagnitude;
    }

    public setOffset(newOffset:number): void {
        this.offset = newOffset;
    }

    public setForceX(x:number):void {
        this.force = new Vec2(x, this.force.y);
    }

    public destroySelf():void {
        this.scheduleOnce( () => this.node.destroy());
    }
}