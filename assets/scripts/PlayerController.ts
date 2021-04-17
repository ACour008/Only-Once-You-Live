
import { _decorator, Component, Vec2, Vec3, CCFloat,  CCInteger, SystemEvent, systemEvent, EventKeyboard, macro, RigidBody2D, BoxCollider2D, Collider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D, UITransform, Camera, Rect, TERRAIN_HEIGHT_BASE,} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({type:CCInteger, tooltip: "Number of extra jumps allowed (after initial jump)"})
    public numJumps:number = 2;

    @property({type: CCFloat})
    public jumpForce:number = 30;

    @property({type: RigidBody2D})
    public rb:RigidBody2D|null = null;

    private _footCollider: BoxCollider2D|null = null;
    private _bodyCollider: BoxCollider2D|null = null;
    private _jump:boolean = false;
    private _numJumps:number = 0;
    private _onGround:boolean = false;

    setInputActive(activate:boolean) {
        if (activate) {
            systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            if (this._footCollider && this._bodyCollider) {
                this._footCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                this._bodyCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
        } else {
            systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            if (this._footCollider && this._bodyCollider) {
                this._footCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                this._bodyCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
        } 
    }

    checkForGround():boolean {
        let result = false;
        if (this._footCollider) {
            const colliderList = PhysicsSystem2D.instance.testAABB(this._footCollider.worldAABB);
            colliderList.forEach(collider => {
                if (collider.tag === 2) {
                    result = true;
                }
            });
        }
        return result;
    }

    // EVENTS

    onKeyDown(event:EventKeyboard) {
        if (event.keyCode === macro.KEY.space || event.keyCode === macro.KEY.up) {
            this._jump = true;
        }
    }

    onKeyUp(event:EventKeyboard) {
        this._jump = false;
    }

    onBeginContact(selfCollider:Collider2D, otherCollider:Collider2D, contact:IPhysics2DContact|null) {
    }

    onEndContact(selfCollider:Collider2D, otherCollider:Collider2D, contact:IPhysics2DContact|null) {
    }

    start () {
        this._numJumps = this.numJumps;
        let colliders = this.getComponents(BoxCollider2D);
        colliders.forEach(collider => {
            if (collider.tag === 0) {
                this._bodyCollider = collider;
            }
            if (collider.tag === 1) {
                this._footCollider = collider;
            }
        });
    }

    update() {
        if (this._onGround) {
            this._numJumps = this.numJumps;
        }

        if (this._jump && this._numJumps > 0) {
            if (this.rb) {
                this.rb.linearVelocity = new Vec2(0, this.jumpForce);
                this._numJumps--;
                this._jump = false;
            }
        }
        else if (this._jump && this._numJumps === 0 && this._onGround) {
            if (this.rb) {
                this.rb.linearVelocity = new Vec2(0, this.jumpForce);
                this._jump = false;
            }
        }
    }

    lateUpdate() {
        this._onGround = (this.checkForGround()) ? true : false;
    }
}
