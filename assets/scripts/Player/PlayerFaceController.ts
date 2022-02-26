
import { _decorator, Component, Sprite, SpriteFrame, Node, Animation, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerFaceController')
export class PlayerFaceController extends Component {

    @property(Node)
    private bodyNode!:Node;

    @property({type:Sprite})
    private eyeSprite!:Sprite;

    @property({type:Sprite})
    private blinkSprite!:Sprite;

    @property({type:Sprite})
    private moustacheSprite!:Sprite;

    @property({type:Sprite})
    private mouthSprite!:Sprite;
    
    @property({type:[SpriteFrame]})
    private eyeSprites:SpriteFrame[] = [];


    @property({type:[SpriteFrame]})
    private mouthSprites:SpriteFrame[] = [];

    @property(Node)
    private deathMessageNode!:Node;

    @property(Node)
    private deathNode!:Node;

    @property(CCFloat)
    private moustacheProbability:number = 0.5;
    
    private animator:Animation|null = null;

    onLoad() {
        this.animator = this.getComponent(Animation);
    }

    private _randomize(max:number):number {
        return Math.floor(Math.random() * max);
    }

    public randomizeFace():void {
        let eyeIdx = this._randomize(this.eyeSprites.length-1);
        let mouthIdx = this._randomize(this.mouthSprites.length-1);

        this.moustacheSprite.node.active = (Math.random() < this.moustacheProbability);
        this.eyeSprite.spriteFrame = this.eyeSprites[eyeIdx];
        this.mouthSprite.spriteFrame = this.mouthSprites[mouthIdx];
    }

    public makeAlive():void {
        this.animator?.start();
        this.bodyNode.active = true;
        this.eyeSprite.node.active = true;
        this.blinkSprite.node.active = true;
        this.mouthSprite.node.active = true;
        this.deathMessageNode.active = false;
        this.deathNode.active = false;
        this.randomizeFace();
    }

    public makeDead():void {
        this.animator?.stop();
        this.bodyNode.active = false;
        this.eyeSprite.node.active = false;
        this.blinkSprite.node.active = false;
        this.mouthSprite.node.active = false;
        this.moustacheSprite.node.active = false;
        this.deathMessageNode.active = true;
        this.deathNode.active = true;
    }
}