
import { _decorator, Component, Node } from 'cc';

export class Utils extends Component {

    static randomRange(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
