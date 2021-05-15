
import { _decorator, Component, Node, Prefab, instantiate, Vec3, SpriteFrame, BoxCollider2D, CCFloat, NodePool, Contact2DType, Collider2D, IPhysics2DContact} from 'cc';
import { Utils } from "./Utils";
const { ccclass, property } = _decorator;

@ccclass('PlatformSpawner')
export class PlatformSpawner extends Component {

    @property({type:Prefab})
    public platformPrefab!:Prefab;

    @property({type:Node})
    private respawnPoint!:Node;

    @property({type:CCFloat})
    public minScreenBoundary:number = -410;

    @property({type:CCFloat})
    public maxScreenBoundary:number = 410;

    private _speedMulitplier:number = 1;
    private _respawnCollider!:BoxCollider2D;
    private _platformPool!:NodePool;
    private _lastPlatformYPos = 0;

    activate(active:boolean) {
        if (active) {
            this._respawnCollider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this._respawnCollider?.on(Contact2DType.END_CONTACT, this.onContactEnd, this);
            this.spawnPlatform(new Vec3());
        }
        else {
            this._respawnCollider?.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onLoad() {
        this._respawnCollider = this.respawnPoint.getComponent(BoxCollider2D)!;
        this.fillPlatformPool();
    }

    onBeginContact(self:Collider2D, other:Collider2D, contact:IPhysics2DContact|null) {
        if (other.group === (1 << 3)) {
            let newYPos = this._lastPlatformYPos + Utils.randomRange(-340, 340);
            if (newYPos > this.maxScreenBoundary) { newYPos = this.maxScreenBoundary; }
            if (newYPos < this.minScreenBoundary) { newYPos = this.minScreenBoundary; }

            this.scheduleOnce(()=> this.spawnPlatform(new Vec3(0, newYPos, 0)));
            this._lastPlatformYPos = newYPos;
        }
    }

    onContactEnd(self:Collider2D, other:Collider2D) {
        if (other.group === (1 << 3)) {
            this.scheduleOnce(()=> this.destroyPlatform(other.node));
        }
    }

    onDestroy() {
        this._platformPool.clear();
    }

    fillPlatformPool() {
        this._platformPool = new NodePool();
        const amt = 10;
        for (let i = 0; i < amt; i++) {
            this._platformPool.put(instantiate(this.platformPrefab));
        }
    }

    spawnPlatform(spawnPos:Vec3) {
        if (this._platformPool.size() <= 0 ) { return; }
        const platform = this._platformPool.get() as Node;
        
        this.node.addChild(platform);
        platform.setPosition(spawnPos);
        platform.parent = this.node;
    }

    destroyPlatform(platform:Node) {
        this._platformPool.put(platform);
    }
}
