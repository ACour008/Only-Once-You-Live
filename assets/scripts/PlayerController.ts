
import { _decorator, Component, Vec2, CCFloat, Node, CCInteger, SystemEvent, System, systemEvent, EventKeyboard, macro, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({type: CCFloat})
    public jumpForce:number = 10;
    
    @property({type: CCFloat})
    public gravityModifier:number = 1;

    @property({type: CCInteger})
    public jumpCountMax:number = 2;

    @property({type: RigidBody2D})
    public rb:RigidBody2D|null = null;

    private _jumpCount:number = 0;

    /* Registers or deregisters key listener */
    /* @param activate - activate the listener or nah
     */
    setInputActive(activate:boolean) {
        if (activate) {
            systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        } else {
            systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        } 
    }

    //
    onKeyDown(event:EventKeyboard) {
        if (event.keyCode === macro.KEY.space && (this._jumpCount < this.jumpCountMax)) {
            if (this.rb) {
                console.log(Vec2.multiplyScalar(new Vec2(0,0), Vec2.UNIT_Y, this.jumpForce))
                this.rb.applyLinearImpulseToCenter(Vec2.multiplyScalar(new Vec2(0,0), Vec2.UNIT_Y, this.jumpForce), true);
                this._jumpCount++;
            }
        }
    }

    start () {
    }

    update() {

    }

}
