
import { _decorator, Component, Node, CCFloat, Vec3 } from 'cc';
import { AudioManager } from '../Audio/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonHover')
export class ButtonHover extends Component {

    @property({type: CCFloat})
    private zoomScale:number = 1.2;

    @property(AudioManager)
    private audioManager!:AudioManager;

    private _originalScale = Vec3.ONE;


    start () {
        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event:MouseEvent):void {
        this.node.scale = this._originalScale;
    }

    onMouseEnter(event:MouseEvent):void {
        this.audioManager.onPlaySound(null, "click");
        this.node.scale = new Vec3(this.zoomScale, this.zoomScale, 1);
    }

    onMouseDown(event:MouseEvent):void {
        this.node.scale = Vec3.multiplyScalar(new Vec3(), this._originalScale, 0.9);
    }

    onMouseLeave(event:MouseEvent):void {
        this.node.scale = this._originalScale;
    }
}
