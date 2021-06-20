import { _decorator, Component, PhysicsSystem2D, PHYSICS_2D_PTM_RATIO, Vec2, systemEvent, game, director, AudioSource, AudioClip, SliderComponent, Slider, RenderingSubMesh, SystemEventType, macro, EventKeyboard, Game, Label, EPhysics2DDrawFlags} from 'cc';
import { PlayerMovement2D } from "./PlayerMovement2D";
import { PlayerFaceController } from './PlayerFaceController';
import { MenuManager } from "./MenuManager";
import { AudioManager } from "./AudioManager";
import { PlatformSpawner } from "./PlatformSpawner";
import { Ground } from "./Ground";
import { ACEventHandler } from './ACEventHandler';

const { ccclass, property } = _decorator;


export enum GameState {
    GS_MENU,
    GS_PLAY_START,
    GS_PLAYING,
    GS_DEATH,
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type:PlayerMovement2D})
    public playerMovementController:PlayerMovement2D|null = null;

    @property(PlayerFaceController)
    public playerFaceController:PlayerFaceController|null = null;

    @property({type:AudioSource})
    public musicSource:AudioSource|null = null;

    @property({type:PlatformSpawner})
    public platformSpawner:PlatformSpawner|null = null;

    @property({type:Ground})
    public ground!:Ground;

    @property({type:MenuManager})
    public menuManager:MenuManager|null = null;

    @property({type:AudioManager})
    public audioManager:AudioManager|null = null;
    
    private _currentState = GameState.GS_MENU;
    private _quitTimer:number = 0;
    private _qIsPressed:number = 0;
    private _cIsPressed:number = 0;

    set currentState(state:GameState) {
        this._currentState = state;
        
        switch(state) {
            case GameState.GS_MENU:
                systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDownMenuState, this);
                systemEvent.on(SystemEventType.KEY_UP, this.onKeyUpMenuState, this);
                systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDownExceptMenuState, this);

                this.menuManager?.setMenusForState(GameState.GS_MENU);
                this.playerMovementController?.setInputActive(false);
                this.playerFaceController?.makeAlive();
                this.platformSpawner?.activate(false);
                this.ground.reset();
                break;
            case GameState.GS_PLAY_START:
                systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDownMenuState, this);
                systemEvent.off(SystemEventType.KEY_UP, this.onKeyUpMenuState, this);
                systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDownExceptMenuState, this);

                this.menuManager?.setMenusForState(GameState.GS_PLAY_START);
                this.playerMovementController?.setInputActive(false);
                this.playerFaceController?.makeAlive();
                this.platformSpawner?.activate(false);
                this.ground.activate(false);
                break;
            case GameState.GS_PLAYING:
                setTimeout( () => {
                    this.menuManager?.setMenusForState(GameState.GS_PLAYING)
                    this.playerMovementController?.setInputActive(true);
                    this.platformSpawner?.activate(true);
                    this.ground.activate(true);
                }, 0.1);
                break;
            case GameState.GS_DEATH:
                this.menuManager?.setMenusForState(GameState.GS_DEATH)
                this.playerMovementController?.setInputActive(false);
                this.playerFaceController?.makeDead();
                this.platformSpawner?.activate(false);

                setTimeout(()=> {
                    this._resetAll();
                    this.currentState = GameState.GS_PLAY_START;
                }, 3500)
                break;
        }
    }

    // GAME EVENTS

    start () {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = new Vec2(0, -9.81 * PHYSICS_2D_PTM_RATIO);
        
        // ACEventHandler.instance?.registerEvent("player-death", this.onPlayerDeath, this);
        
        this.currentState = GameState.GS_MENU;
    }

    update(deltaTime:number) {
        if ( ((this._quitTimer + 2500) < Date.now()) && this._qIsPressed > 0 ) {
            this.quitGame();
        }
    }

    onKeyDownMenuState(event:EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.q:
                if (this._qIsPressed === 0) { 
                    this._quitTimer = Date.now();
                    ACEventHandler.instance?.emitEvent("quit-button-down");
                }
                this._qIsPressed += 1;
                break;
        }
    }

    onKeyUpMenuState(event:EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.q:
                this._qIsPressed = 0;
                ACEventHandler.instance?.emitEvent("quit-button-up");
                break;
            case macro.KEY.c:
                if (this._cIsPressed === 0) {
                    this.menuManager?.setCreditMenu();
                }
                this._cIsPressed += 1;
                break;
        }
    }

    onKeyDownExceptMenuState(event:EventKeyboard) {
        switch(event.keyCode) {
            case macro.KEY.escape:
                let fakeEvent = new Event("fake");
                (director.isPaused) ? this.setPause(fakeEvent, "true") : this.setPause(fakeEvent, "false");
                break;
        }
    }

    onPlayerDeath() {
        this.currentState = GameState.GS_DEATH;
    }

    // GAME FUNCTIONS

    private _resetAll() {
        this.playerMovementController?.reset();
        this.ground.reset();
        this.platformSpawner?.reset();
    }

    public restart() {
        this.currentState = GameState.GS_MENU;
    }

    public startGame() {
        setTimeout( () => this.currentState = GameState.GS_PLAY_START, 0.1);
    }

    public startPlaying() {
        this.currentState = GameState.GS_PLAYING;
    }

    public quitGame() {
        game.end();
    }

    public setPause(event:Event|null, customEventData:string) {
        let paused = customEventData === "true";
        setTimeout( () => {
            if (this.menuManager) { 
                this.menuManager.setPause(paused, this._currentState);
            }
            this._pause(paused);
        }, 0.1);
    }

    private _pause(pause:boolean) {
        (pause) ? director.pause() : director.resume();
    }

    public resetCButton() {
        this._cIsPressed = 0;
    }
}
