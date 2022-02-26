
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('InstructionDisplay')
export class InstructionDisplay extends Component {

    @property(Label)
    private instructions:Label|null = null;

    public setInstructions(instruction:string):void {
        if (this.instructions) {
            this.instructions.string = instruction;
            this.instructions.node.active = true;
        }
    }

    public clearInstructions():void {
        if (this.instructions) {
            this.instructions.string = "";
            this.instructions.node.active = false;
        }
    }
}

