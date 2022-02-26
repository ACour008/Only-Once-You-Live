
import { _decorator, Component, Node, CCFloat, Vec2, Vec3, clamp} from 'cc';
import { makeNoise2D, Noise2D } from './openSimplexNoise/TwoD';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    
    @property({type: CCFloat, tooltip: "How quickly the camera shake disapates"})
    private decay:number = 0.8

    @property({type: Vec2, tooltip: "Max horizontal/vertical shake in pixels"})
    private maxOffset:Vec2 = new Vec2(100, 50);
    
    @property({type:CCFloat, tooltip: "Max rotation in radians"})
    private maxRoll:number = 0.1;

    @property(CCFloat)
    private trauma:number = 100;

    @property(Node)
    private cameraNode!:Node;

    private _shakeStrength:number = 0;
    private _strengthMultiplier = 2;

    private _noise:Noise2D = makeNoise2D(Date.now());
    private _noiseX:number = 0;
    private _noiseY:number = 0;

    update(dt:number) {
        if (this._shakeStrength) {
            this._shakeStrength = Math.max(this._shakeStrength - this.decay * dt, 0);
            this._shake();
        }
    }

    private _shake():void {
        let amount = this._shakeStrength ** this._strengthMultiplier;
        this._noiseX += 1;
        this._noiseY +=1;
        
        this.cameraNode.setRotationFromEuler(new Vec3(0, 0, this.maxRoll * amount * this._noise(this._noiseX, this._noiseY)));
        this.cameraNode.setPosition(new Vec3(
            this.maxOffset.x * amount * this._noise(this._noiseX, this._noiseY),
            this.maxOffset.y * amount * this._noise(this._noiseX, this._noiseY),
            this.cameraNode.position.z
        ));

    }

    public shake():void {
        this._shakeStrength = Math.min(this._shakeStrength + this.trauma, 1);
    }
}
