
import { _decorator, Component, AudioSource, AudioClip, SliderComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property({type: AudioClip })
    public jumpClip:AudioClip|null = null;

    @property({type: AudioClip })
    public deathClip:AudioClip|null = null;

    @property({type:AudioClip})
    public deathLaughClip:AudioClip|null = null;

    @property({type: AudioClip })
    public mouseClickClip:AudioClip|null = null;

    @property({type:AudioClip})
    public mouseConfirmClick:AudioClip|null = null;

    @property({type: SliderComponent})
    public musicVolumeSlider:SliderComponent|null = null;

    @property({type: SliderComponent})
    public sfxVolumeSlider:SliderComponent|null = null;

    private _musicSource:AudioSource|null = null;
    private _sfxSource:AudioSource|null = null;

    get musicSource() { return this._musicSource; }
    get sfxSource() { return this._sfxSource; }

 
    start () {
        let sources = this.getComponents(AudioSource);
        this._musicSource = sources[1]
        this._sfxSource = sources[0];

        if (this._musicSource && this.musicVolumeSlider) {
            this.musicVolumeSlider.progress = this._musicSource.volume;
        }

        if (this._sfxSource && this.sfxVolumeSlider) {
            this.sfxVolumeSlider.progress = this._sfxSource.volume;
        }
    }

    public adjustMusicVolume() {
        if(this._musicSource && this.musicVolumeSlider) {
            this._musicSource.volume = this.musicVolumeSlider.progress;
        }
    }

    public adjustSfxVolume() {
        if(this._sfxSource && this.sfxVolumeSlider) {
            this._sfxSource.volume = this.sfxVolumeSlider.progress;
        }
    }

    public onPlaySound(event:Event|null, customEventData:string) {
        switch(customEventData) {
            case "jump":
                if (this.jumpClip) this._sfxSource?.playOneShot(this.jumpClip, this.sfxSource?.volume);
                break;
            case "click":
                if (this.mouseClickClip) this._sfxSource?.playOneShot(this.mouseClickClip, this._sfxSource?.volume);
                break;
            case "confirm":
                if (this.mouseConfirmClick) this._sfxSource?.playOneShot(this.mouseConfirmClick, this._sfxSource.volume);
                break;
            case "death":
                if (this.deathClip) this._sfxSource?.playOneShot(this.deathClip, this._sfxSource.volume);
                break;
            case "laugh":
                if (this.deathLaughClip) this._sfxSource?.playOneShot(this.deathLaughClip, this._sfxSource.volume);    
        }
    }
}