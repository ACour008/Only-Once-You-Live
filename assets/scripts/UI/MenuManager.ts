
import { _decorator, Component, Node, Label, CCString } from 'cc';
import { GameState } from '../Enums';

const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {

    @property({type:Node})
    private mainMenu:Node|null = null;

    @property({type:Node})
    private optionsMenu:Node|null = null;

    @property({type:Node})
    private creditsMenu:Node|null = null;

    @property({type:Node})
    private initDialogueBox:Node|null = null;

    @property({type:Node})
    private pauseMenu:Node|null = null;

    @property(Node)
    private deathScreen:Node|null = null;

    @property({type:Label})
    private quitNotificationLabel:Label|null = null;

    @property(CCString)
    private quitKeyUpMessage:string = "Hold";
    @property(CCString)
    private quitKeyDownMessage:string = "Keep Holding";

    onQuitButtonDown():void {
        if (this.quitNotificationLabel) {
            this.quitNotificationLabel.string = this.quitKeyDownMessage;
        }
    }

    onQuitButtonUp():void {
        if (this.quitNotificationLabel) {
            this.quitNotificationLabel.string = this.quitKeyUpMessage;
        }
    }

    public setOptionsMenu(event:Event, customEventData:string ):void {
        if (this.optionsMenu) {
            this.optionsMenu.active = (customEventData === "true");
        }
    }

    public setCreditMenu():void {
        if (this.mainMenu && this.creditsMenu) {
            this.creditsMenu.active = !this.creditsMenu.active;
            this.mainMenu.active = !this.mainMenu.active;
        }
    }

    public setInitDialogueBox(active:boolean):void {
        if (this.initDialogueBox) { this.initDialogueBox.active = active; }
    }

    public clearAllMenus() {
        if (this.mainMenu) { this.mainMenu.active = false }
        if (this.initDialogueBox) { this.initDialogueBox.active = false}
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.optionsMenu) { this.optionsMenu.active = false;}
        if (this.deathScreen) { this.deathScreen.active = false; }
    }

    public openPauseMenu() {
        if (this.pauseMenu) { this.pauseMenu.active = true; }
    }

    public closePauseMenu() {
        if (this.pauseMenu) { this.pauseMenu.active = false; }
    }

    public setMenuState():void {
        if (this.mainMenu) { this.mainMenu.active = true }
        if (this.initDialogueBox) { this.initDialogueBox.active = false}
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.optionsMenu) { this.optionsMenu.active = false;}
        if (this.deathScreen) { this.deathScreen.active = false; }
    }

    public setIntroState():void {
        if (this.mainMenu) {this.mainMenu.active = false }
        if (this.initDialogueBox) { this.initDialogueBox.active = true }
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.optionsMenu) { this.optionsMenu.active = false;}
        if (this.deathScreen) { this.deathScreen.active = false; }
    }

    public setPlayingState():void {
        if (this.mainMenu) this.mainMenu.active = false
        if (this.initDialogueBox) { this.initDialogueBox.active = false }
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.optionsMenu) { this.optionsMenu.active = false;}
        if (this.deathScreen) { this.deathScreen.active = false; }
    }

    public setDeathState():void {
        if (this.mainMenu) { this.mainMenu.active = false }
        if (this.initDialogueBox) { this.initDialogueBox.active = false; }
        if (this.creditsMenu) { this.creditsMenu.active = false;}
        if (this.optionsMenu) { this.optionsMenu.active = false;}
        if (this.deathScreen) { this.deathScreen.active = true; }
    }

}
