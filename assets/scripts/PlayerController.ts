
import { _decorator, Component, Vec2, Node, CCFloat, Prefab, Color, CCInteger, SystemEvent, systemEvent, EventKeyboard, macro, SpriteFrame, RigidBody2D, BoxCollider2D, Collider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D, Sprite, instantiate, Canvas, Vec3, UITransform,} from 'cc';
import { EventHandler } from "./EventHandler";
const { ccclass, property } = _decorator;


@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({type: Vec3})
    public startPosition:Vec3 = new Vec3(-450, -85, 0);

    @property({type:CCInteger, tooltip: "Number of extra jumps allowed (after initial jump)"})
    public numJumps:number = 2;

    @property({type: CCFloat})
    public jumpForce:number = 30;

    @property({type: RigidBody2D})
    public rb:RigidBody2D|null = null;

    @property({type: [SpriteFrame]})
    public faceSprites:SpriteFrame[] = [];

    @property({type:Node})
    public bodyNode:Node|null = null

    @property({type:Node})
    public faceNode:Node|null = null;

    @property({type:Prefab})
    public deathPrefab:Prefab|null = null;

    @property({type:Node})
    public deathMessageNode:Node|null = null;

    @property({type:EventHandler})
    public eventHandler:EventHandler|null = null;

    private _footCollider: BoxCollider2D|null = null;
    private _bodyCollider: BoxCollider2D|null = null;
    private _jump:boolean = false;
    private _keyWentUp = false;
    private _numJumps:number = 0;
    private _onGround:boolean = false;
    private _currentBodyColor:Color = Color.WHITE;

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

    reset() {
        this._activeChildren();
        this.node.position = this.startPosition;
        if (this.deathMessageNode) this.deathMessageNode.active = false;
        if (this._footCollider && this._bodyCollider) {
            this._footCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this._bodyCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
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
            this._keyWentUp = false;
        }
    }

    onKeyUp(event:EventKeyboard) {
        this._jump = false;
        this._keyWentUp = true;
    }

    onBeginContact(selfCollider:Collider2D, otherCollider:Collider2D, contact:IPhysics2DContact|null) {
        if (otherCollider.tag === 5) {
            this.onDeath();
        }
    }

    onEndContact(selfCollider:Collider2D, otherCollider:Collider2D, contact:IPhysics2DContact|null) {
    }

    onDeath() {
        if (this._footCollider && this._bodyCollider) {
            this._footCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this._bodyCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        if (this.deathPrefab) {
            this._deactiveChildren();
            let deathNode:Node = instantiate(this.deathPrefab);
            let deathSprite = deathNode.getComponent(Sprite);

            deathNode.position = new Vec3(this.node.position.x, this.node.position.y - 34, 0);
            if (deathSprite) deathSprite.color = Color.RED;
            this.node.parent?.addChild(deathNode);

            if (this.deathMessageNode) {
                this.deathMessageNode.active = true;
            }

            if (this.eventHandler) {
                this.eventHandler.emitEvent("player-death");
            }
        }
    }
    
    private _deactiveChildren() {
        this.node.children.forEach(child => {
            if (child.name !== "Camera") {
                child.active = false;
            }
        });
    }
    private _activeChildren() {
        this.node.children.forEach(child => {
            if (child.name !== "Camera") {
                child.active = true;
            }
        });
    }


    start () {
    
        let bodySprite = this.bodyNode?.getComponent(Sprite);
        let faceSprite = this.faceNode?.getComponent(Sprite);

        if(bodySprite && faceSprite) {
            bodySprite.color = Color.WHITE;
            this._currentBodyColor = bodySprite.color;

            let rIdx = Math.floor(Math.random() * this.faceSprites.length);
            faceSprite.spriteFrame = this.faceSprites[rIdx];
        }

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
        else if (this._jump && this._numJumps === 0 && this._onGround && this._keyWentUp) {
            if (this.rb) {
                this.rb.linearVelocity = new Vec2(0, this.jumpForce);
                this._jump = false;
            }
        }

        if (this.node.position.x < -1500) {
            this.onDeath();
            this.eventHandler?.emitEvent("player-death");
        }
    }

    lateUpdate() {
        if (this.node.active) {
            this._onGround = (this.checkForGround()) ? true : false;
        }
    }
}
