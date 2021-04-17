
import { _decorator, Component, Vec2, CCFloat,  CCInteger, SystemEvent, systemEvent, EventKeyboard, macro, RigidBody2D, BoxCollider2D, Collider2D, Event, ICollisionEvent, Contact2DType, IPhysics2DContact, PhysicsSystem2D, UITransform, Camera, Rect,} from 'cc';
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

    @property({type: Camera})
    public cam:Camera|null = null;

    private _jump:boolean = false;
    private _onGround:boolean = false;
    private _canDoubleJump: boolean = false;

    setInputActive(activate:boolean) {
        let colliders = this.getComponents(BoxCollider2D);

        if (activate) {
            systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            colliders.forEach(collider=> {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            });
        } else {
            systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            colliders.forEach(collider=> {
                collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            });
        } 
    }

    isGrounded():boolean {
        let transform:UITransform|null = this.getComponent(UITransform);
        let tempRect = transform?.getBoundingBox();
        if (tempRect) {
            let rect = new Rect(tempRect.x, tempRect.y, tempRect.width, tempRect.height+15);
            if (rect) {
                const colliderList = PhysicsSystem2D.instance.testAABB(rect);
                console.log(rect);
            }
        }

        return false;
    }

    // EVENTS

    onKeyDown(event:EventKeyboard) {
        if (event.keyCode === macro.KEY.space) {
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
    }

    update() {
        this.isGrounded();

    }

    lateUpdate() {
        if (this._jump) {
            this.rb?.applyForceToCenter(new Vec2(0, this.jumpForce), true);
        }
    }
}
