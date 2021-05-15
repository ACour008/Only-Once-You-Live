
import { _decorator, Component, Node, Label } from 'cc';
import { ACEventHandler } from './ACEventHandler';
import { GameState } from "./GameManager";

const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {

    @property({type:Node})
    public mainMenu:Node|null = null;

    @property({type:Node})
    public optionsMenu:Node|null = null;

    @property({type:Node})
    public creditsMenu:Node|null = null;

    @property({type:Node})
    public initDialogueBox:Node|null = null;

    @property({type:Node})
    public pauseMenu:Node|null = null;

    @property({type:Label})
    public quitNotificationLabel:Label|null = null;

    start() {
        ACEventHandler.instance?.registerEvent('quit-button-down', this.onQuitButtonDown, this);
        ACEventHandler.instance?.registerEvent('quit-button-up', this.onQuitButtonUp, this);
    }

    onQuitButtonDown() {
        if (this.quitNotificationLabel) {
            this.quitNotificationLabel.string = "Keep Holding";
        }
    }

    onQuitButtonUp() {
        if (this.quitNotificationLabel) {
            this.quitNotificationLabel.string = "Hold";
        }
    }

    public setOptionsMenu(event:Event, customEventData:string ) {
        if (this.optionsMenu) {
            this.optionsMenu.active = (customEventData === "true");
        }
    }

    public setPause(pause:boolean, state:GameState) {
        if (state === GameState.GS_PLAY_START && !pause) {
            this.setMenusForState(state);
            if (this.pauseMenu) { this.pauseMenu.active = false }
        }
        else {
            if (this.pauseMenu) { this.pauseMenu.active = pause; }
        }
    }

    public setCreditMenu() {
        if (this.mainMenu && this.creditsMenu) {
            this.creditsMenu.active = !this.creditsMenu.active;
            this.mainMenu.active = !this.mainMenu.active;
        }
    }

    public setInitDialogueBox(active:boolean) {
        if (this.initDialogueBox) { this.initDialogueBox.active = active; }
    }

    public setMenusForState(state:GameState) {
        switch(state) {
            case GameState.GS_MENU:
                this._setMenuState();
                break;
            case GameState.GS_PLAY_START:
                this._setPlayStartState();
                break;
            case GameState.GS_PLAYING:
                this._setPlayingState();
                break;
            case GameState.GS_DEATH:
                this._setDeathState();
                break;

        }
    }

    private _setMenuState() {
        if (this.mainMenu) { this.mainMenu.active = true }
        if (this.initDialogueBox) { this.initDialogueBox.active = false}
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.pauseMenu) { this.pauseMenu.active = false; }
        if (this.optionsMenu) { this.optionsMenu.active = false;}
    }

    private _setPlayStartState() {
        if (this.mainMenu) {this.mainMenu.active = false }
        if (this.initDialogueBox) { this.initDialogueBox.active = true }
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.pauseMenu) { this.pauseMenu.active = false; }
        if (this.optionsMenu) { this.optionsMenu.active = false;}
    }

    private _setPlayingState() {
        if (this.mainMenu) this.mainMenu.active = false
        if (this.initDialogueBox) { this.initDialogueBox.active = false }
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.optionsMenu) { this.optionsMenu.active = false;}
    }

    private _setDeathState() {
        if (this.mainMenu) { this.mainMenu.active = false }
        if (this.initDialogueBox) { this.initDialogueBox.active = false; }
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.pauseMenu) { this.pauseMenu.active = false; }
        if (this.optionsMenu) { this.optionsMenu.active = false;}
    }

}
