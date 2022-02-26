import { _decorator, Component, KeyCode, Input, input,  game,
         director, EventKeyboard, Animation, CCFloat, Camera, Collider2D, Contact2DType, IPhysics2DContact} from 'cc';
import { PlayerMovement2D } from './Player/PlayerMovement2D';
import { PlayerFaceController } from './Player/PlayerFaceController';
import { MenuManager } from "./UI/MenuManager";
import { AudioManager } from "./Audio/AudioManager";
import { PlatformSpawner } from './Platforms/PlatformSpawner';
import { ScoreKeeper } from './Scoring/ScoreKeeper';
import { FollowTarget } from './Camera/FollowTarget';
import { Emitter } from './Emitter/Emitter';
import { TutorialManager } from './Tutorial/TutorialManager';
import { ObstacleSpawner } from './Platforms/ObstacleSpawner';
import { PhysicsGroups, GameState } from './Enums';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type:PlayerMovement2D})
    private playerMovementController:PlayerMovement2D|null = null;

    @property(PlayerFaceController)
    private playerFaceController:PlayerFaceController|null = null;

    @property(PlatformSpawner)
    private platformSpawner:PlatformSpawner|null = null;

    @property(ObstacleSpawner)
    private obstacleSpawner:ObstacleSpawner|null = null;

    @property(TutorialManager)
    private tutorial!:TutorialManager;

    @property({type:MenuManager})
    private menuManager:MenuManager|null = null;

    @property({type:AudioManager})
    private audioManager:AudioManager|null = null;

    @property({type:Animation})
    private devilLaugh:Animation|null = null;

    @property(Camera)
    private playerCamera!:Camera;

    @property(CCFloat)
    private deathAnimationDurationInSecs:number = 0.75;

    @property(CCFloat)
    private restartDelayInMS:number = 3500

    @property(CCFloat)
    private advanceSpeedTimeInSecs:number = 10;

    @property(CCFloat)
    private platformStartDelayInMS:number = 11000;

    @property(CCFloat)
    private obstacleStartDelayInMS:number = 22000;

    @property(ScoreKeeper)
    private scoreKeeper!:ScoreKeeper;

    @property(Collider2D)
    private startScoreCollider!:Collider2D;

    get audioMgr():AudioManager|null { return this.audioManager; }
    
    private _targetFollower:FollowTarget|null = null;
    private _timeouts:Array<number> = [];
    private _currentState = GameState.GS_MENU;
    private _cIsPressed:number = 0;

    set currentState(state:GameState) {
        this._currentState = state;
        
        switch(state) {
            case GameState.GS_MENU:
                this.handleInputForMenuState();
                this.setComponentsForMenuState();
                break;
            case GameState.GS_INTRO:
                this.handleInputForIntro();
                this.setComponentsForIntro();
                break;
            case GameState.GS_PLAYING:
                this.setComponentsForPlayingState();
                break;
            case GameState.GS_DEATH:
                this.setComponentsForDeathState();
                setTimeout(()=> { this.playDeathAnimations(); }, this.deathAnimationDurationInSecs);
                setTimeout(()=> { this.resetToPlayStartState(); }, this.restartDelayInMS)
                break;
        }
    }

    start() {
        this._targetFollower = this.playerCamera.getComponent(FollowTarget);
        this.currentState = GameState.GS_MENU;

    }

    onKeyUpMenuState(event:EventKeyboard):void {
        switch(event.keyCode) {
            case KeyCode.KEY_C:
                if (this._cIsPressed === 0) {
                    this.menuManager?.setCreditMenu();
                }
                this._cIsPressed += 1;
                break;
        }
    }

    onKeyDownEscape(event:EventKeyboard):void {
        switch(event.keyCode) {
            case KeyCode.ESCAPE:
                if (this._currentState == GameState.GS_INTRO) {
                    this.currentState = GameState.GS_MENU;
                }
                else {
                    (director.isPaused) ? this.setPause(null, "true") : this.setPause(null, "false");
                }
                break;
        }
    }

    // GAME FUNCTIONS

    private _resetAll():void {
        this.playerMovementController?.reset();
        this.tutorial.reset();
        this.platformSpawner?.reset();
        this.obstacleSpawner?.reset();
        this.scoreKeeper.deactivate();
    }

    public restart():void {
        this._resetAll();
        this.currentState = GameState.GS_MENU;
    }

    public startGame():void {
        setTimeout( () => this.currentState = GameState.GS_INTRO, 0.1);
    }

    public startPlaying():void {
        this.currentState = GameState.GS_PLAYING;
    }

    public quitGame():void {
        game.end();
    }

    public setPause(event:Event|null, customEventData:string):void {
        let paused = customEventData === "true";
        
        if (paused === true) {
            this.menuManager?.clearAllMenus();
            this.menuManager?.openPauseMenu();
        } else {
            this.menuManager?.closePauseMenu();

            switch (this._currentState) {
                case GameState.GS_MENU:
                    this.menuManager?.setMenuState();
                    break;
                case GameState.GS_INTRO:
                    this.menuManager?.setIntroState();
                    break;
                case GameState.GS_PLAYING:
                    this.menuManager?.setPlayingState();
                    break;
                case GameState.GS_DEATH:
                    this.menuManager?.setDeathState();
                    break;
            }
        }

        this._pause(paused);
    }

    private _pause(pause:boolean):void {
        (pause) ? director.pause() : director.resume();
    }

    public resetCButton():void {
        this._cIsPressed = 0;
    }

    private handleInputForMenuState() {
        input.on(Input.EventType.KEY_UP, this.onKeyUpMenuState, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDownEscape, this);
    }

    private handleInputForIntro() {
        input.off(Input.EventType.KEY_UP, this.onKeyUpMenuState, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDownEscape, this);
    }

    private setComponentsForMenuState() {
        this.menuManager?.setMenuState();
        this.playerMovementController?.disable();
        this.playerFaceController?.makeAlive();
        this.platformSpawner?.activate(false);
        this.obstacleSpawner?.activate(false);
        this.tutorial.reset();
        this._targetFollower?.activate();
    }

    private setComponentsForIntro() {
        this.menuManager?.setIntroState();
        this.playerMovementController?.disable();
        this.playerFaceController?.makeAlive();
        this.platformSpawner?.activate(false);
        this.obstacleSpawner?.activate(false);
        this.tutorial.deactivate();
        this._targetFollower?.activate(true);
    }

    private setComponentsForPlayingState() {
        this.menuManager?.setPlayingState();
        this.playerMovementController?.enable();
        this.tutorial.activate();
        
        this._timeouts.push(setTimeout( () => this.platformSpawner?.activate(true), this.platformStartDelayInMS));
        this._timeouts.push(setTimeout( () => this.obstacleSpawner?.activate(true), this.obstacleStartDelayInMS));
        this.startScoreCollider.on(Contact2DType.BEGIN_CONTACT, this.startScoreCollider_beginContact, this);
    }

    private setComponentsForDeathState() {
        Emitter.instance?.emitEvent('reset-speed');

        this.menuManager?.setDeathState();
        this.playerMovementController?.disable();
        this.playerFaceController?.makeDead();
        this.platformSpawner?.activate(false);
        this.obstacleSpawner?.activate(false);
        this.scoreKeeper.deactivate();
        this._targetFollower?.deactivate();
        this.startScoreCollider.off(Contact2DType.BEGIN_CONTACT, this.startScoreCollider_beginContact, this)
        
        this.clearTimeoutsAndSchedules();
    }

    private playDeathAnimations() {
        this.devilLaugh?.play();
        this.audioManager?.onPlaySound(null, 'laugh');
    }

    private resetToPlayStartState() {
        this._resetAll();
        this.currentState = GameState.GS_INTRO;
    }

    private startScoreCollider_beginContact(self:Collider2D, other:Collider2D, contact:IPhysics2DContact) {
        if (other.group === PhysicsGroups.PLAYER) {
            this.scoreKeeper.activate();
            this.schedule( () => this.goFaster(), this.advanceSpeedTimeInSecs);
        }
    }

    private goFaster():void {
        Emitter.instance?.emitEvent('go-faster')
    }

    private clearTimeoutsAndSchedules():void {
        this._timeouts.forEach( (timeout, index) => {
            clearTimeout(timeout);
            this._timeouts.splice(index, 1);
        });

        this.unscheduleAllCallbacks();
    }
}
