
import { _decorator, Component, Node, CCFloat, Vec2, Vec3, clamp, Camera, lerp } from 'cc';
import { Emitter } from '../Emitter/Emitter';
const { ccclass, property } = _decorator;
 
@ccclass('FollowTarget')
export class FollowTarget extends Component {

    @property(CCFloat)
    private targetFollowLerpRatio:number = 0.25;

    @property(Node)
    private target:Node|null = null;

    @property(Vec2)
    private minCameraPosition:Vec2 = new Vec2(-200, -320);

    @property(Vec2)
    private maxCameraPosition:Vec2 = new Vec2(0, 500);

    @property(Vec2)
    private cameraOffset:Vec2 = new Vec2(0, 192.5);

    @property(Vec3)
    private positionOnReset:Vec3 = new Vec3(-174.02, 0.26, 1000);

    @property(CCFloat)
    private minOrthoHeight:number = 540;

    @property(CCFloat)
    private maxOrthoHeight:number = 1080;

    @property(CCFloat)
    private orthoHeightOffset:number = 500;

    @property(CCFloat)
    private orthoLerpRatio:number = 0.1;

    private _isActive:boolean = true;
    private _shouldZoomOut:boolean = false;
    private _cam:Camera|null = null;
    private _initialMinOrthoHeight:number = 0;
    private _changedOrthoHeight:number = 0;

    start() {
        this._cam = this.getComponent(Camera);
        this._initialMinOrthoHeight = this.minOrthoHeight;
        this._changedOrthoHeight = this.minOrthoHeight;

        Emitter.instance?.registerEvent("zoom-out-cam", this.onZoomOutCamera, this);
    }

    update(dateTime:number) {

        if (this._shouldZoomOut) {
            this.zoomOut();
        }

        if (this._isActive) {
            this.followTarget();
            this.updateZoom();
        }
    }

    private onZoomOutCamera() {
        this._changedOrthoHeight += 180;
        this._shouldZoomOut = true;
    }

    public activate(resetCamera?:boolean) {
        this.minOrthoHeight = this._initialMinOrthoHeight;

        if (resetCamera) {
            this.node.position = this.positionOnReset;
            if (this._cam) {
                this._cam.orthoHeight = this.minOrthoHeight;
            }
        }
        this._isActive = true;
    }

    public deactivate() {
        this._isActive = false;
    }

    private followTarget():void {
        if (this.target) {
            let targetPosition = this.target.position;
            let currentPosition = this.node.position;
    
            let clampedX = clamp(targetPosition.x, this.minCameraPosition.x, this.maxCameraPosition.x) + this.cameraOffset.x;
            let clampedY = clamp(targetPosition.y, this.minCameraPosition.y, this.maxCameraPosition.y) + this.cameraOffset.y;
            
            targetPosition = new Vec3(clampedX, clampedY, 0);
            currentPosition.lerp(targetPosition, this.targetFollowLerpRatio);
            this.node.setPosition(currentPosition.x, currentPosition.y, 1000);
        }
    }

    private updateZoom():void {
        let targetPosition = this.target?.position;

        if (targetPosition && this._cam) {
            let targetHeight = targetPosition.y + this.orthoHeightOffset;
            let orthoHeight = this._cam.orthoHeight;;

            if (orthoHeight != targetHeight) {
                let target:number = lerp(orthoHeight, targetHeight, this.orthoLerpRatio);
                this._cam.orthoHeight = clamp(target, this.minOrthoHeight, this.maxOrthoHeight);
            }

        }
    }

    private zoomOut() {
        this.minOrthoHeight = lerp(this.minOrthoHeight, this._changedOrthoHeight, this.orthoLerpRatio);
            
        if (this.minOrthoHeight >= (this._changedOrthoHeight - 0.5)) {
            this._shouldZoomOut = false;
        }
    }
   
}