
import { _decorator, Component } from 'cc';
import { CameraShake } from '../Camera/CameraShake';
import { Emitter } from '../Emitter/Emitter';
import { GameManager} from '../GameManager';
import { GameState } from '../Enums';
const { ccclass, property, type } = _decorator;

@ccclass('DeathGround')
export class DeathGround extends Component {

    @property(CameraShake)
    private camera!:CameraShake;

    @property(GameManager)
    private gameManager!:GameManager;
    

    start() {
        Emitter.instance?.registerEvent('player-died', this.onPlayerDied, this);
    }

    onPlayerDied() {
        this.gameManager.currentState = GameState.GS_DEATH;
        this.gameManager.audioMgr?.onPlaySound(null, "death");
        this.camera.shake();
    }
}
