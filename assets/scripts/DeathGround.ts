
import { _decorator, Component, BoxCollider2D, Contact2DType, CCFloat } from 'cc';
import { CameraShake } from './CameraShake';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('DeathGround')
export class DeathGround extends Component {

    @property(CameraShake)
    public camera!:CameraShake;

    @property(CCFloat)
    public trauma:number = 0.5;

    @property(GameManager)
    public gameManager!:GameManager;
    
    private _collider!:BoxCollider2D|null;

    start() {
        this._collider = this.getComponent(BoxCollider2D);
        this._collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(self:BoxCollider2D, other:BoxCollider2D) {
        if (other.group === (1 << 1)) {
            console.log("You died!");
            this.gameManager.currentState = GameState.GS_DEATH;
            this.camera.addTrauma(this.trauma);
        }
    }
}
