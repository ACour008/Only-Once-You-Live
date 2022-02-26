
import { _decorator, Component, Label, CCInteger } from 'cc';
const { ccclass, property,type } = _decorator;
 
@ccclass('ScoreKeeper')
export class ScoreKeeper extends Component {

    @property(Label)
    private scoreText!:Label;

    @property(Label)
    private gameOverText!:Label;

    @property(CCInteger)
    private scoreIncreasePerSecond:number = 12;

    @property(CCInteger)
    private scoreIncreaseAmount:number = 50;

    @property(CCInteger)
    private scoreDecreaseAmount:number = 50;

    private _score:number = 0;
    private _isActive:boolean = false;
    private _timer:number = 0;

    public static instance:ScoreKeeper

    onLoad() {
        ScoreKeeper.instance = this;
    }

    start() {
        this.scoreText.string = String(this._score);
    }

    update(deltaTime:number) {
        this.scoreText.string = String(this._score);

        if (this._isActive) {
            this._score += Math.ceil(this.scoreIncreasePerSecond * deltaTime);
        }
    }

    public activate() {
        this.node.active = true;
        this._isActive = true;
        this.reset();
    }

    public deactivate() {
        this.node.active = false;
        this._isActive = false;

        this.gameOverText.string = "Your Final Score: " + String(this._score);
    }

    public addToScore() {
        this._score+= this.scoreIncreaseAmount;
    }

    public subtractFromScore() {
        this._score -= this.scoreDecreaseAmount;
    }

    public getScore() {
        return this._score;
    }

    private reset() {
        this._score = 0;
    }

}
