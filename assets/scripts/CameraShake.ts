
import { _decorator, Component, Node, CCFloat, Vec2, Vec3} from 'cc';
import { MINIGAME } from 'cc/env';
import { makeNoise2D, Noise2D } from './openSimplexNoise/TwoD';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    
    // How quickly the shaking disappates
    @property(CCFloat)
    public decay:number = 0.8

    // Max horizontal/vertical shake in pixels
    @property(CCFloat)
    public maxOffset:Vec2 = new Vec2(100, 50);

    // Max rotation in radians
    @property(CCFloat)
    public maxRoll:number = 0.1;

    @property(Node)
    public cameraNode!:Node;

    @property(Node)
    public target:Node|null = null;

    private _trauma:number = 0; // current camera strength
    private _traumaPower = 2;  // trauma exp. use 2 or 3
    private _noise:Noise2D = makeNoise2D(Date.now());
    private _noiseX:number = 0;
    private _noiseY:number = 0;
    private _targetPosition:Vec3|null = null;


    update(dt:number) {
        if (this.target) {
            this._targetPosition = this.target.getPosition();
        }
        if (this._trauma) {
            this._trauma = Math.max(this._trauma - this.decay * dt, 0);
            this._shake();
        }
    }

    private _shake() {
        let amount = this._trauma ** this._traumaPower;
        this._noiseX += 1;
        this._noiseY +=1;
        
        this.cameraNode.setRotationFromEuler(new Vec3(0, 0, this.maxRoll * amount * this._noise(this._noiseX, this._noiseY)));
        this.cameraNode.setPosition(new Vec3(
            this.maxOffset.x * amount * this._noise(this._noiseX, this._noiseY),
            this.maxOffset.y * amount * this._noise(this._noiseX, this._noiseY),
            this.cameraNode.position.z
        ));

        
    }

    public addTrauma(amount:number) {
        this._trauma = Math.min(this._trauma + amount, 1);
    }
}
