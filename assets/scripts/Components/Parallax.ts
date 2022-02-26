
import { _decorator, Component, CCFloat, Vec3 } from 'cc';
import { Emitter } from '../Emitter/Emitter';
const { ccclass, property } = _decorator;

@ccclass('Parallax')
export class Parallax extends Component {

    @property({type:CCFloat})
    private moveSpeed:number = 1;

    @property(CCFloat)
    private speedIncrease:number = 0.05;

    @property({type:CCFloat})
    private offset:number = 0;


    update(deltaTime:number) {
        let newXPos =  ( ( Date.now() * -this.moveSpeed) % this.offset );
        this.node.position = new Vec3(newXPos, this.node.position.y, this.node.position.z);
    }
}
