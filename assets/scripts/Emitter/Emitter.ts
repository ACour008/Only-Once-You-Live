
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

 
@ccclass('Emitter')
export class Emitter extends Component {

    public static instance:Emitter|null = null;

    onLoad() {
        if (Emitter.instance === null) {
            Emitter.instance = this;
        } else {
            this.destroy();
        }
    }

    public registerEvent(eventName:string, callback:Function, target?:any) {
        this.node.on(eventName, callback, target);
    }

    public unregisterEvent(eventName:string, callback:Function, target?:any) {
        this.node.on(eventName, callback, target);
    }

    public emitEvent(eventName:string) {
        this.node.emit(eventName);
    }

}
