
import { _decorator, Component, Node } from 'cc';
import { Ground } from '../Platforms/Ground';
const { ccclass, property } = _decorator;
 
@ccclass('TutorialManager')
export class TutorialManager extends Component {

    @property([Ground])
    private startingGrounds:Array<Ground> = [];

    public activate() {
        this.startingGrounds.forEach((startingGround) => startingGround?.activate(true));
    }

    public deactivate() {
        this.startingGrounds.forEach((startingGround) => startingGround?.activate(false));
    }

    public reset() {
        this.startingGrounds.forEach((startingGround) => startingGround?.reset());
    }
}
