import { _decorator, Node, Component, Vec3, RigidBody2D, PhysicsSystem2D,
         EventKeyboard, Vec2, input, Input, CCFloat,BoxCollider2D, CCInteger,
         tween, Contact2DType, KeyCode, IPhysics2DContact, Animation, Quat, Collider2D} from 'cc';
import { AudioManager } from '../Audio/AudioManager';
import { Emitter } from '../Emitter/Emitter';
import { Obstacle } from '../Platforms/Obstacle';
import { ScoreKeeper } from '../Scoring/ScoreKeeper';
import { PhysicsGroups } from '../Enums';

const { ccclass, property } = _decorator;


@ccclass('PlayerMovement2D')
export class PlayerMovement2D extends Component {

    @property({type:Vec2, tooltip: "The up velocity of the jump"})
    private jumpVelocity:Vec2 = new Vec2();

    // @property({type:CCFloat, tooltip: "Adds latency to button push to add forgiveness if player presses jump again but has not yet hit the floor"})
    // private jumpDelay:number = 0.25;

    @property({type:CCInteger, tooltip: "Maximum number of jumps"})
    private maxJumps:number = 2;

    // @property({type:CCFloat, tooltip: "Added to RigidBody2D linear damping when player is stopping or changing directions"})
    // private linearDrag:number = 4;

    @property({type:CCFloat, tooltip: "Scales gravity. Used bring the player down faster when falling"})
    private gravity: number = 1;

    @property({type:CCFloat, tooltip: "This is used to adjust the rate that the player falls back to the ground"})
    private fallMultiplier: number = 5;

    @property({type:Node, tooltip: "The node of the Player body sprite. Usually the child of the first Player node"})
    private characterBodyNode:Node|null = null;
    
    @property(AudioManager)
    private audioManager!:AudioManager;

    private _isAlive = false;

    private _keys:Map<number, boolean> = new Map();
    private _isGrounded:boolean = false;
    private _timesJumped:number = 0;
    private _jumped:boolean = false;
    private _canFlip:boolean = true;
    private _animator:Animation|null = null;

    private _startingPos:Vec3 = new Vec3(-900, -192.5, 0);

    private _rb:RigidBody2D| null = null;
    private _collider:BoxCollider2D|null = null;

    private _registerListeners():void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this._collider?.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        this._collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    
    private _unregisterListeners():void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        this._collider?.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    isKeyPressed(key:number):boolean|undefined {
        return this._keys.get(key);
    }

    isGrounded():boolean {
        let result = false;

        if (this._collider) {
            const colliderList = PhysicsSystem2D.instance.testAABB(this._collider.worldAABB);
            colliderList.forEach(collider => {

                const isTouchingGound = collider.group === PhysicsGroups.PLATFORM 
                    || collider.group == PhysicsGroups.GROUND;
            
                if (isTouchingGound) {
                    result = true;
                }
            });
        }
        return result;
    }

    public isAlive():boolean {
        return this._isAlive;
    }

    public disable() {
        this.setInputActive(false);
        this._isAlive = false;
        this.node.rotation = new Quat(0,0,0,0);
    }

    public enable() {
        this.setInputActive(true);
        this._isAlive = true;
    }
    
    private setInputActive(active:boolean):void {
        (active === true) ? this._registerListeners() : this._unregisterListeners();
    }

    reset():void {
        if (this._rb) { this._rb.linearVelocity = new Vec2(0,0); }
        this.node.position = this._startingPos;
        this.node.rotation = new Quat(0, 0, 0, 0);
        this._animator?.play("blink-1");
    }

    start () {
      this._rb = this.getComponent(RigidBody2D);
      this._collider = this.getComponent(BoxCollider2D);
      this._animator = this.getComponent(Animation);

      this._keys.set(KeyCode.SPACE, false);
    }

    onKeyDown(event:EventKeyboard):void {
        this._keys.set(event.keyCode, true);
    }

    onKeyUp(event:EventKeyboard):void {
        this._keys.set(event.keyCode, false);
    }

    onPostSolve(self:Collider2D, other:Collider2D, contact:IPhysics2DContact) {
        if (other.group === PhysicsGroups.OBSTACLE) {
            if (this._rb) this._rb.linearVelocity = new Vec2(0, this._rb.linearVelocity.y);
            other.node.getComponent(Obstacle)?.destroySelf();
        }
    }

    onBeginContact(self:BoxCollider2D, other:BoxCollider2D, contact:IPhysics2DContact) {
        let shouldPreventJumpOnLanding = this._timesJumped > 0;
        let isTouchingPlatform:boolean = other.group === PhysicsGroups.PLATFORM;
        let isTouchingObstacle:boolean = other.group === PhysicsGroups.OBSTACLE;
        let isTouchingGround:boolean = other.group === PhysicsGroups.GROUND;
        let isTouchingDeathGround:boolean = other.group === PhysicsGroups.DEATH_GROUND;

        if (isTouchingPlatform) {
            ScoreKeeper.instance.addToScore();
        }

        if (isTouchingDeathGround && this._isAlive) {
            this.killPlayer();
        }

        if (isTouchingObstacle) {
            this.audioManager.onPlaySound(null, 'hit');
            this.bouncePlayer();
            this._timesJumped = 0;
        }

        if (this.isGrounded() && shouldPreventJumpOnLanding) {
            this._keys.set(KeyCode.SPACE, false);
            this.jumpSqueeze(1.15, 0.5, 0.1);
        }

        if (isTouchingPlatform || isTouchingGround) {
            this._timesJumped = 0;
            this._canFlip = true;
            this._jumped = false;
            this._animator?.play("blink-1");
        }
    }

    lateUpdate(deltaTime:number) {
        let isAbleToJump = !this._jumped;
        let isAboutToJump = this.isKeyPressed(KeyCode.SPACE) && isAbleToJump;
        let alreadyJumped = this._jumped && !this.isKeyPressed(KeyCode.SPACE);
        // let shouldSlamDown = this.isKeyPressed(KeyCode.KEY_S) && !this.isGrounded();

        if (isAboutToJump) {
            this.doJump();
            this._jumped = true;
        }

        if (alreadyJumped) {
            this._jumped = false;
        }

        if (isAboutToJump && (this._timesJumped === 2) && this._canFlip) {
            this._animator?.play("flip");
            this._canFlip = false;
        }

        // if (shouldSlamDown) {
        //     this.slamDown();
        //     this._keys.set(KeyCode.KEY_S, false);
        // }

        this.modifyPhysics();
    }

    doJump():void {
        if (this._timesJumped >= this.maxJumps) return;

        if (this._rb) {

                this.audioManager.onPlaySound(null, "jump");
                
                this._rb.linearVelocity = new Vec2(0, 0);
                this._rb.applyForceToCenter(this.jumpVelocity, true);
                this.jumpSqueeze(0.85, 1.15, 0.1);

                ++this._timesJumped;
        }
    }

    bouncePlayer():void {
        this.node.position = new Vec3(this._startingPos.x, this.node.position.y);
        
        if (this._rb) {
            this._rb.linearVelocity = new Vec2(0, 0);
            this._rb.applyLinearImpulseToCenter(new Vec2(0, 100), true);
        }
        this.modifyPhysics();
    }

    slamDown() {
        if (this._rb) {
            this.node.rotation = new Quat(0, 0, 0, 0);
            this._rb.linearVelocity = new Vec2(0,0);
            this._rb.applyLinearImpulseToCenter(new Vec2(0, -250), true);
        }
    }

    modifyPhysics():void {
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
                else if(this._rb.linearVelocity.y > 0 && !this.isKeyPressed(KeyCode.SPACE)) {
                    // if moving upwards, but released the jump key, change jump height
                    this._rb.gravityScale = this.gravity * (this.fallMultiplier / 2);
                }
            }
        }
    }

    jumpSqueeze(xSqueeze:number, ySqueeze:number, seconds:number):void {
        let originalSize:Vec3 = Vec3.ONE;
        let newSize:Vec3 = new Vec3(xSqueeze, ySqueeze, originalSize.z);
        tween(this.characterBodyNode?.scale).to(seconds/2, newSize).to(seconds/2, originalSize).start();
    }

    killPlayer():void {
        this._timesJumped = 0;
        Emitter.instance?.emitEvent('player-died');
    }
}
