
import { _decorator, Component, AudioSource, AudioClip, SliderComponent } from 'cc';
import { ACEventHandler } from './ACEventHandler';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    @property({type: AudioClip })
    public jumpClip:AudioClip|null = null;

    @property({type: AudioClip })
    public deathClip:AudioClip|null = null;

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

        ACEventHandler.instance?.registerEvent("play-sound", this.onPlaySound, this);
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

    onPlaySound(soundName:string) {
        switch(soundName) {
            case "jump":
                if (this.jumpClip) this._sfxSource?.playOneShot(this.jumpClip, this.sfxSource?.volume);
                break;
            case "click":
                if (this.mouseClickClip) this._sfxSource?.playOneShot(this.mouseClickClip, this._sfxSource?.volume);
                break;
            case "confirm":
                if (this.mouseConfirmClick) this._sfxSource?.playOneShot(this.mouseConfirmClick, this._sfxSource.volume);
                break;
        }
    }
}