import { _decorator, EPhysics2DDrawFlags, Component, Node, PhysicsSystem2D, Vec2, CCFloat } from 'cc';
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;


enum GameState {
    GS_MENU,
    GS_PLATFORMER,
    GS_RUNNER_INIT,
    GS_RUNNER_PLAY,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type:CCFloat})
    public gravity:number = -2000.0;

    @property({type:PlayerController})
    public playerController:PlayerController|null = null;
    
    private _currentState = GameState.GS_RUNNER_PLAY;

    set currentState(state:GameState) {
        switch(state) {
            case GameState.GS_MENU:
                break;
            case GameState.GS_PLATFORMER:
                break;
            case GameState.GS_RUNNER_INIT:
                break;
            case GameState.GS_RUNNER_PLAY:
                setTimeout( () => {
                    this.playerController?.setInputActive(true);
                }, 0.1);
        }
    }
    start () {
       PhysicsSystem2D.instance.enable = true;
       PhysicsSystem2D.instance.gravity = new Vec2(0, this.gravity);
       PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;

       this.currentState = GameState.GS_RUNNER_PLAY;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
