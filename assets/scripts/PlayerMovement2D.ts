
import { _decorator, Node, Component, Vec3, RigidBody2D, PhysicsSystem2D, SystemEvent, EventKeyboard, macro, Vec2, systemEvent, CCFloat, Collider2D, BoxCollider2D, CCInteger, tween } from 'cc';
import { ACEventHandler } from './ACEventHandler';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement2D')
export class PlayerMovement2D extends Component {

    @property({type:Vec2, tooltip: "The up velocity of the jump"})
    public jumpVelocity:Vec2 = new Vec2();

    @property({type:CCFloat, tooltip: "Adds latency to button push to add forgiveness if player presses jump again but has not yet hit the floor"})
    public jumpDelay:number = 0.25;

    @property({type:CCInteger, tooltip: "Maximum number of jumps"})
    public maxJumps:number = 2;

    @property({type:CCFloat, tooltip: "Added to RigidBody2D linear damping when player is stopping or changing directions"})
    public linearDrag:number = 4;

    @property({type:CCFloat, tooltip: "Scales gravity. Used bring the player down faster when falling"})
    public gravity: number = 1;

    @property({type:CCFloat, tooltip: "This is used to adjust the rate that the player falls back to the ground"})
    public fallMultiplier: number = 5;

    @property({type:Node, tooltip: "The node of the Player body sprite. Usually the child of the first Player node"})
    public characterBodyNode:Node|null = null;

    private _keys:Map<number, boolean> = new Map();
    private _isGrounded:boolean = false;
    private _jumpTimer:number = 0;
    private _numOfJumps:number = 0;
    private _canJump:number = 0;

    private _startingPos:Vec3 = new Vec3(-711.815, -85, 0);

    private _rb:RigidBody2D| null = null;
    private _bodyCollider:Collider2D|null = null;
    private _footCollider:Collider2D|null = null;

    private _initColliders() {
        let colliders = this.getComponents(BoxCollider2D);
        colliders.forEach(collider=> {
          if (collider.tag === 0) {
              this._bodyCollider = collider;
          }
          if (collider.tag === 1) {
              this._footCollider = collider;
          }
      });
    }

    private _registerListeners() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private _unregisterListeners() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    isKeyPressed(key:number) {
        return this._keys.get(key);
    }

    isGrounded() {
        let result = false;
        if (this._footCollider) {
            const colliderList = PhysicsSystem2D.instance.testAABB(this._footCollider.worldAABB);
            colliderList.forEach(collider => {
                if (collider.group === (1 << 2) || collider.group === (1 << 3)) {
                    result = true;
                }
            });
        }
        return result;
    }

    setInputActive(active:boolean) {
        if (active) {
            this._registerListeners();
        } else {
            this._unregisterListeners();
        }
    }

    reset() {
        this.node.position = this._startingPos;
    }

    // EVENT FUNCTIONS

    start () {
      this._rb = this.getComponent(RigidBody2D);
      this._initColliders();

      this._keys.set(macro.KEY.space, false);
    }

    onKeyDown(event:EventKeyboard) {
        this._keys.set(event.keyCode, true);
        if (this._canJump === 0) {
            this._canJump = 1;
        }
    }

    onKeyUp(event:EventKeyboard) {
        this._keys.set(event.keyCode, false);
        if (this._canJump === this.maxJumps) {
            this._canJump = 0;
        }
    }

    update(deltaTime:number) {
        let wasOnGround = this._isGrounded;
        this._isGrounded = this.isGrounded();

        if (!wasOnGround && this._isGrounded) {
            this.jumpSqueeze(1.15, 0.85, 0.1);
        }; 

        if (this._canJump === 1) {
            this._jumpTimer = Date.now() + this.jumpDelay;
        }
    }


    lateUpdate(deltaTime:number) {
        if ( this.isKeyPressed(macro.KEY.space) && this._canJump === 1 && this._jumpTimer > Date.now() ) {
                this.doJump(deltaTime);
        }
        this.modifyPhysics();
    }

    doJump(dt:number) {
        if (this._canJump === 0 || this._canJump === this.maxJumps) {
            return;
        }

        if (this._rb) {

            if (this._isGrounded) {
                this._numOfJumps = 0;
            }
            if ( this._isGrounded || this._numOfJumps < this.maxJumps ) {
                ACEventHandler.instance?.emitEvent("play-sound", "jump");
                
                this._rb.linearVelocity = new Vec2(this._rb.linearVelocity.x, 0);
                this._rb.applyForceToCenter(this.jumpVelocity, true);
                this._jumpTimer = 0;
                this.jumpSqueeze(0.85, 1.15, 0.1);
                ++this._numOfJumps;
                this._isGrounded = false;
            }
            this._canJump = this.maxJumps;
            this._keys.set(macro.KEY.space, false);
        }
    }

    modifyPhysics() {
        if (this._rb) {
            if (this._isGrounded) {
                this._rb.linearDamping = 0
                this._rb.gravityScale = 0;
            } else {
                // Is up in air
                this._rb.gravityScale = this.gravity;
                this._rb.linearDamping = 0;

                if (this._rb.linearVelocity.y < 0) {
                    // if falling
                    this._rb.gravityScale = this.gravity * this.fallMultiplier;
                } 
                else if(this._rb.linearVelocity.y > 0 && !this.isKeyPressed(macro.KEY.space)) {
                    // if moving upwards, but released the jump key, change jump height
                    this._rb.gravityScale = this.gravity * (this.fallMultiplier / 2);
                }
            }
        }
    }

    jumpSqueeze(xSqueeze:number, ySqueeze:number, seconds:number) {
        let originalSize:Vec3 = Vec3.ONE;
        let newSize:Vec3 = new Vec3(xSqueeze, ySqueeze, originalSize.z);
        tween(this.characterBodyNode?.scale).to(seconds/2, newSize).to(seconds/2, originalSize).start();
    }
}
