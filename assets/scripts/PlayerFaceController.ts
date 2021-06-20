
import { _decorator, Component, Sprite, SpriteFrame, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerFaceController')
export class PlayerFaceController extends Component {

    @property(Node)
    public bodyNode!:Node;

    @property({type:Sprite})
    public eyeSprite!:Sprite;

    @property({type:Sprite})
    public moustacheSprite!:Sprite;

    @property({type:Sprite})
    public mouthSprite!:Sprite;
    
    @property({type:[SpriteFrame]})
    public eyeSprites:SpriteFrame[] = [];

    @property({type:[SpriteFrame]})
    public mouthSprites:SpriteFrame[] = [];

    @property(Node)
    public deathMessageNode!:Node;

    @property(Node)
    public deathNode!:Node;

    @property(Animation)
    public animator!:Animation;

    start() {
        // this.randomizeFace();
    }

    private _randomize(max:number):number {
        return Math.floor(Math.random() * max);
    }

    public randomizeFace() {
        let eyeIdx = this._randomize(this.eyeSprites.length);
        let mouthIdx = this._randomize(this.mouthSprites.length);

        this.moustacheSprite.node.active = (Math.random() < 0.15);
        this.eyeSprite.spriteFrame = this.eyeSprites[eyeIdx];
        this.mouthSprite.spriteFrame = this.mouthSprites[mouthIdx];
    }

    public makeAlive() {
        this.animator.start();
        this.bodyNode.active = true;
        this.eyeSprite.node.active = true;
        this.mouthSprite.node.active = true;
        this.deathMessageNode.active = false;
        this.deathNode.active = false;
        this.randomizeFace();
    }

    public makeDead() {
        this.animator.stop();
        this.bodyNode.active = false;
        this.eyeSprite.node.active = false;
        this.mouthSprite.node.active = false;
        this.moustacheSprite.node.active = false;
        this.deathMessageNode.active = true;
        this.deathNode.active = true;
    }
}