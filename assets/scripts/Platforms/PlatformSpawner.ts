import { _decorator, Component, Node, Prefab, instantiate, Vec3, BoxCollider2D, CCFloat, 
         Contact2DType, Collider2D, IPhysics2DContact, randomRange, clamp, Vec2, randomRangeInt, PHYSICS_2D_PTM_RATIO, UITransform } from 'cc';
import { PhysicsGroups } from '../Enums';
import { Emitter } from '../Emitter/Emitter';
import { Platform } from './Platform';

const { ccclass, property } = _decorator;
const PLAYER_JUMP_TIMES = [1.284, 1.435, 0.62];

@ccclass('PlatformSpawner')
export class PlatformSpawner extends Component {

    @property([Prefab])
    private platformPrefabs:Array<Prefab> = [];

    @property(CCFloat)
    private xVelocityStart:number = -15;

    @property(CCFloat) 
    private xVelocityIncrease:number = -2.5;

    @property(CCFloat)
    private xVelocityMax:number = -50;

    @property(CCFloat)
    private minSpawnHeight:number = -400;

    @property(CCFloat)
    private maxSpawnHeight:number = 400;

    @property(CCFloat)
    private zoomCameraOutAtVelocity = -36;

    @property(Collider2D)
    private respawnPoint!:Collider2D;

    @property(Collider2D)
    private destroyPoint!:Collider2D;

    private _platforms:Array<Node> = [];
    private _platformSpeed:number = 0;
    private _platformSpeedChanged:boolean = false;
    private _previousSpawnYPosition:number = 0;
    private _previousPlatformHeight:number|null = 0;

    onLoad() {
        this._platformSpeed = this.xVelocityStart;
    }

    start() {
        Emitter.instance?.registerEvent('reset-speed', this.onResetSpeed, this);
    }

    activate(active:boolean):void {
        if (active) {
            Emitter.instance?.registerEvent('go-faster', this.onGoFaster, this);

            this.destroyPoint?.on(Contact2DType.BEGIN_CONTACT, this.destroyPoint_onBeginContact, this);
            this.respawnPoint?.on(Contact2DType.END_CONTACT, this.respawnPoint_onContactEnd, this);
            
            this.spawnPlatform(new Vec3());
        }
        else {
            Emitter.instance?.unregisterEvent('go-faster', this.onGoFaster, this);
            this.destroyPoint?.off(Contact2DType.BEGIN_CONTACT, this.destroyPoint_onBeginContact, this);
            this.respawnPoint?.off(Contact2DType.END_CONTACT, this.respawnPoint_onContactEnd, this);
        }
    }

    reset():void {
        this._platforms.forEach((platform) => platform.destroy() );
    }

    destroyPoint_onBeginContact(self:Collider2D, other:Collider2D, contact:IPhysics2DContact|null):void {

        const node:Node = other.node;
        const otherGroup = other.group;

        if (otherGroup === PhysicsGroups.PLATFORM) {
            this.scheduleOnce(()=> {
                const platformIndex = this._platforms.indexOf(node);
                this._platforms.splice(platformIndex, 1);

                node.destroy();
            });
        }
    }

    respawnPoint_onContactEnd(self:Collider2D, other:Collider2D):void {
        if (other.group === PhysicsGroups.PLATFORM) {
            const newRespawnTime = this.getNewRespawnTime(other.node);
            
            // ("new Respawn: " + newRespawnTime);
            setTimeout( () => {
                this.checkPlatformSpeed();
                this.spawnPlatform();
            }, newRespawnTime);
        }
    }

    onGoFaster() {
        this._platformSpeed += this.xVelocityIncrease;
        this._platformSpeedChanged = true;
    }

    onResetSpeed() {
        this._platformSpeed = this.xVelocityStart;
        this._platformSpeedChanged = false;
    }

    getPrefab():Prefab {
        const randomIndex = randomRangeInt(0, this.platformPrefabs.length)
        return this.platformPrefabs[randomIndex];
    }

    spawnPlatform(spawnPosition?:Vec3):void {
        const prefab = this.getPrefab();
        const platform:Node = instantiate(prefab);
        const newPosition = (spawnPosition) ? spawnPosition : this.getNewPlatformPosition(platform);
        const platformComponent = platform.getComponent(Platform);

        this._platformSpeed = clamp(this._platformSpeed, this.xVelocityStart, this.xVelocityMax);

        //console.log("New Position: " + newPosition);
        // console.log("Current velocity: " + this._platformSpeed);

        platformComponent?.setForce(new Vec2(this._platformSpeed, 0));

        this._platforms.push(platform);
        platform.setParent(this.node);
        platform.setPosition(newPosition);
        
        this._previousSpawnYPosition = newPosition.y;
        this._previousPlatformHeight = this.getHeightFrom(platform);
    }

    getNewPlatformPosition(platform:Node):Vec3 {
        
        let newPosition = new Vec3(0, 0, 0);

        if (this._previousPlatformHeight) {
            const currentPlatformHeight = platform.getComponent(UITransform)?.height as number;
            const spawnLocationOptions = [
                this._previousSpawnYPosition + this._previousPlatformHeight,
                this._previousSpawnYPosition - currentPlatformHeight
            ];

            const randomIndex = randomRangeInt(0, spawnLocationOptions.length);
            const newYPosition = clamp(spawnLocationOptions[randomIndex], this.minSpawnHeight, this.maxSpawnHeight);
            
            newPosition = new Vec3(0, newYPosition, 0);
        }

        return newPosition;
    }

    getNewRespawnTime(other:Node):number {
        const distance = Math.abs(-750 - other.position.x) / PHYSICS_2D_PTM_RATIO;
        const randomIndex = randomRangeInt(0, PLAYER_JUMP_TIMES.length);
        const jumpTime = PLAYER_JUMP_TIMES[randomIndex];

        return Math.floor( (distance / Math.abs(this._platformSpeed)) + jumpTime * 1000);
    }

    getHeightFrom(platform:Node):number|null {
        const transform:UITransform|null = platform.getComponent(UITransform);
        if (transform !== null) {
            return transform.height;
        }
        return null;
    }

    checkPlatformSpeed():void {
        if ( (this._platformSpeed % this.zoomCameraOutAtVelocity === 0) && (this._platformSpeedChanged === true) ) {
            Emitter.instance?.emitEvent("zoom-out-cam");
            this._platformSpeedChanged = false;
        }
    }
}
