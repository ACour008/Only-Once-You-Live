import { _decorator, Component, Node, CCFloat, Vec2, BoxCollider2D, Vec3 } from 'cc';
import { BackgroundMovement } from "./BackgroundMovement";
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {

    @property({type:[Node]})
    public backgrounds:Node[] = [];

    setBackgroundsActive(active:boolean) {
        this.backgrounds.forEach(background => {
            let component = background.getComponent(BackgroundMovement);
            if (component) {
                component.setActive(active);
            }
        });
    }
}
