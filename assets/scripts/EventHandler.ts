
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventHandler')
export class EventHandler extends Component {

    emitEvent(event:string, args?:any) {
        this.node.emit(event, args);
    }

    registerEvent(event:string, callback:any, bind:any) {
        this.node.on(event, callback, bind);
    }

    deregisterEvent(event:string, callback:any, bind:any) {
        this.node.off(event, callback, bind);
    }
}
