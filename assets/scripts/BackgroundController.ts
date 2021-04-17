
import { _decorator, Component, Node, CCFloat, Vec2, BoxCollider2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {

    @property({type:[Node]})
    public backgrounds:Node[] = [];

    @property({type:CCFloat})
    public speed:number = 5;

    private _repeatWidths:number[] = [];
    private _startPositions:Vec3[] = [];

    start () {
        this.backgrounds.forEach((background, index) => {
            this._startPositions[index] = background.position;
            let collider = background.getComponent(BoxCollider2D);
            if (collider) {
                this._repeatWidths[index] = collider.size.x / 2; 
            }
        });
    }

    update (deltaTime: number) {
        for(let i=0, s=this.speed; i<this.backgrounds.length; i++, s/=2) {
            let x = deltaTime * s;
            let y = this.backgrounds[i].position.y;
            let z = this.backgrounds[i].position.z;
            this.backgrounds[i].position = new Vec3(x, y, z);
        }

        this.backgrounds.forEach( (background, index) => {
            if (background.position.x < this._startPositions[index].x - this._repeatWidths[index]) {
                background.position = this._startPositions[index];
            }
        });
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
