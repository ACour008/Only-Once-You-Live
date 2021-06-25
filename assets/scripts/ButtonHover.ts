
import { _decorator, Component, Node, ButtonComponent, CCFloat, Vec3 } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonHover')
export class ButtonHover extends Component {

    @property({type: CCFloat})
    public zoomScale:number = 1.2;

    @property(AudioManager)
    public audioManager!:AudioManager;

    private _originalScale = Vec3.ONE;


    start () {
        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event:MouseEvent) {
        this.node.scale = this._originalScale;
    }

    onMouseEnter(event:MouseEvent) {
        this.audioManager.onPlaySound(null, "click");
        this.node.scale = new Vec3(this.zoomScale, this.zoomScale, 1);
    }

    onMouseDown(event:MouseEvent) {
        this.node.scale = Vec3.multiplyScalar(new Vec3(), this._originalScale, 0.9);
    }

    onMouseLeave(event:MouseEvent) {
        this.node.scale = this._originalScale;
    }
}
