
import { _decorator, Component, Node, CCString, BoxCollider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { PhysicsGroups } from '../Enums';
import { InstructionDisplay } from './InstructionDisplay';
const { ccclass, property } = _decorator;
 
@ccclass('Instruction')
export class Instruction extends Component {

    @property(CCString)
    private instruction:string = "";

    private _collider:BoxCollider2D|null = null;

    start() {
        this._collider = this.getComponent(BoxCollider2D);

        this._collider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this._collider?.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    private onBeginContact(self:BoxCollider2D, other:BoxCollider2D, contact:IPhysics2DContact) {
        if (other.group == PhysicsGroups.PLAYER) {
            const display = other.node.getComponent(InstructionDisplay);
            display?.setInstructions(this.instruction);
        }
    }

    private onEndContact(self:BoxCollider2D, other:BoxCollider2D, contact:IPhysics2DContact) {
        if (other.group == PhysicsGroups.PLAYER) {
            const display = other.node.getComponent(InstructionDisplay);
            display?.clearInstructions();
        }
    }


}
