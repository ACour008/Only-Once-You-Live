import { _decorator, EPhysics2DDrawFlags, Component, Node, PhysicsSystem2D, Vec2, CCFloat, game } from 'cc';
import { PlayerController } from "./PlayerController";
import { SpawnManager } from './SpawnManager';
const { ccclass, property } = _decorator;


enum GameState {
    GS_MENU,
    GS_PLAY_START,
    GS_PLAYING,
    GS_DEATH,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type:CCFloat})
    public gravity:number = -2000.0;

    @property({type:PlayerController})
    public playerController:PlayerController|null = null;

    @property({type:SpawnManager})
    public groundSpawner:SpawnManager|null = null;

    @property({type:Node})
    public mainMenu:Node|null = null;
    
    private _currentState = GameState.GS_MENU;

    set currentState(state:GameState) {
        switch(state) {
            case GameState.GS_MENU:
                if (this.mainMenu) { this.mainMenu.active = true }
                if (this.groundSpawner) { this.groundSpawner.setSpawnActive(false) }
                this.playerController?.setInputActive(false);
                break;
            case GameState.GS_PLAY_START:
                break;
            case GameState.GS_PLAYING:
                setTimeout( () => {
                    if (this.mainMenu) { this.mainMenu.active = false }
                    if (this.groundSpawner) { 
                        this.groundSpawner.setSpawnActive(true);
                    }
                    this.playerController?.setInputActive(true);
                }, 0.1);
                break;
            case GameState.GS_DEATH:
                break;
        }
    }
    start () {
       PhysicsSystem2D.instance.enable = true;
       PhysicsSystem2D.instance.gravity = new Vec2(0, this.gravity);
       PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;

       this.currentState = GameState.GS_MENU;
    }

    public startGame() {
        this.currentState = //GameState.GS_PLAY_START;
        GameState.GS_PLAYING;
    }

    public quitGame() {
        game.end();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
