
import { _decorator, Component, InstanceMaterialType } from 'cc';
const { ccclass } = _decorator;

@ccclass('ACEventHandler')
export class ACEventHandler extends Component {

    static instance:ACEventHandler;

    // Singleton baby
    constructor() {
        super();
        if (ACEventHandler.instance) {
            return ACEventHandler.instance;
        }
        ACEventHandler.instance = this;
    }

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