import { _decorator, Prefab, Vec3, Component, Node, instantiate, PhysicsSystem2D, Vec2, CCFloat, game, TERRAIN_HEIGHT_BASE, SystemEvent, director } from 'cc';
import { PlayerController } from "./PlayerController";
import { MoveLeft } from "./MoveLeft";
import { SpawnManager } from './SpawnManager';
import { EventHandler } from "./EventHandler";
import { BackgroundController } from "./BackgroundController";

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

    @property({type:BackgroundController})
    public backgroundController:BackgroundController|null = null;

    @property({type:EventHandler})
    public eventHandler:EventHandler|null = null;

    @property({type:SpawnManager})
    public groundSpawner:SpawnManager|null = null;

    @property({type:Node})
    public mainMenu:Node|null = null;

    @property({type:Node})
    public dialogueMenu:Node|null = null;

    @property({type:Node})
    public creditsMenu:Node|null = null;

    @property({type:Node})
    public pauseMenu:Node|null = null;

    @property({type:MoveLeft})
    public StartingGround:MoveLeft|null = null;
    
    private _currentState = GameState.GS_MENU;

    set currentState(state:GameState) {
        switch(state) {
            case GameState.GS_MENU:
                if (this.eventHandler) {
                    this.eventHandler.deregisterEvent('pause', this.onPause, this);
                }
                if (this.mainMenu) { this.mainMenu.active = true }
                if (this.groundSpawner) { this.groundSpawner.setSpawnActive(false) }
                if (this.backgroundController) { this.backgroundController.setBackgroundsActive(true)}
                if (this.StartingGround) { this.StartingGround.active = false }
                if (this.dialogueMenu) { this.dialogueMenu.active = false}
                if (this.creditsMenu) { this.creditsMenu.active = false;}
                if (this.pauseMenu) { this.pauseMenu.active = false; }
                this.playerController?.setInputActive(false);
                break;
            case GameState.GS_PLAY_START:
                if (this.eventHandler) {
                    this.eventHandler.deregisterEvent('pause', this.onPause, this);
                }
                if(this.mainMenu) {this.mainMenu.active = false}
                if (this.groundSpawner) { this.groundSpawner.setSpawnActive(false) }
                if (this.backgroundController) { this.backgroundController.setBackgroundsActive(true)}
                if (this.StartingGround) { this.StartingGround.active = false}
                if (this.dialogueMenu) { this.dialogueMenu.active = true }
                if (this.creditsMenu) { this.creditsMenu.active = false;}
                if (this.pauseMenu) { this.pauseMenu.active = false; }
                this.playerController?.setInputActive(false);
                break;
            case GameState.GS_PLAYING:
                setTimeout( () => {
                    if (this.eventHandler) {
                        this.eventHandler.registerEvent('pause', this.onPause, this);
                    }
                    if (this.mainMenu) this.mainMenu.active = false
                    if (this.StartingGround) { this.StartingGround.active = true }
                    if (this.dialogueMenu) { this.dialogueMenu.active = false}
                    this.groundSpawner?.setSpawnActive(true);
                    this.playerController?.setInputActive(true);
                    this.backgroundController?.setBackgroundsActive(true);
                    if (this.creditsMenu) { this.creditsMenu.active = false;}
                    this.eventHandler?.emitEvent("gs-playing");
                }, 0.1);
                break;
            case GameState.GS_DEATH:
                if (this.eventHandler) {
                    this.eventHandler.deregisterEvent('pause', this.onPause, this);
                }
                this.playerController?.setInputActive(false);
                this.groundSpawner?.setSpawnActive(false);
                this.backgroundController?.setBackgroundsActive(false);
                if (this.creditsMenu) { this.creditsMenu.active = false;}
                if (this.pauseMenu) { this.pauseMenu.active = false; }
                setTimeout(()=> {
                    this.resetAll();
                    this.currentState = GameState.GS_PLAY_START;

                }, 5000)
                break;
        }
    }

    resetAll() {
        this.playerController?.reset();
        this.StartingGround?.reset();
    }

    start () {
       PhysicsSystem2D.instance.enable = true;
       PhysicsSystem2D.instance.gravity = new Vec2(0, this.gravity);

       if(this.eventHandler) {
           this.eventHandler.registerEvent("player-death", this.onPlayerDeath, this);
       }

       this.currentState = GameState.GS_MENU;
    }

    public startGame() {
        this.currentState = GameState.GS_PLAY_START;
    }

    public startPlaying() {
        this.currentState = GameState.GS_PLAYING;
    }

    public onPause() {
        if (this.pauseMenu) {
            if (director.isPaused()) {
                this.pauseMenu.active = false;
                director.resume();
            } else {
                this.pauseMenu.active = true;
                director.pause();
            }
        }
    }

    public quitGame() {
        game.end();
    }

    public toggleCredits() {
        if (this.mainMenu && this.creditsMenu) {
            this.mainMenu.active = !this.mainMenu.active;
            this.creditsMenu.active = !this.creditsMenu.active;
        }
    }

    onPlayerDeath() {
        this.currentState = GameState.GS_DEATH;
    }
}
