
import { _decorator, Component, Sprite, SpriteFrame, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerFaceController')
export class PlayerFaceController extends Component {
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

    // TODO: Add animator component field to stop animations on death.

    start() {
        this.randomizeFace();
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
        this.eyeSprite.node.active = true;
        this.mouthSprite.node.active = true;
        this.deathMessageNode.active = false;
        this.deathNode.active = false;
    }

    public makeDead() {
        this.eyeSprite.node.active = false;
        this.mouthSprite.node.active = false;
        this.deathMessageNode.active = true;
        this.deathNode.active = true;
    }
}