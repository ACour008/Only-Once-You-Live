
import { _decorator, Component, Node, Prefab, instantiate, Vec3, BoxCollider2D, CCFloat, NodePool, Contact2DType, Collider2D, IPhysics2DContact, utils} from 'cc';
import { Utils } from "./Utils";
const { ccclass, property } = _decorator;

@ccclass('PlatformSpawner')
export class PlatformSpawner extends Component {

    @property({type:Prefab})
    public platformPrefab!:Prefab;

    @property({type:Prefab})
    public obstaclePrefab!:Prefab;

    @property({type:Node})
    public playerNode!:Node;

    @property({type:Node})
    private respawnPoint!:Node;

    @property({type:CCFloat})
    public minScreenBoundary:number = -400;

    @property({type:CCFloat})
    public maxScreenBoundary:number = 400;

    private _speedMulitplier:number = 1;
    private _respawnCollider!:BoxCollider2D;
    private _platformPool!:NodePool;
    private _obstaclePool!:NodePool;
    private _lastPlatformYPos = 0;
    private _platforms:Node[] = [];
    private _obstacles:Node[] = [];

    activate(active:boolean) {
        if (active) {
            this._respawnCollider?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this._respawnCollider?.on(Contact2DType.END_CONTACT, this.onContactEnd, this);
            this.spawnPlatform(new Vec3());
            this.schedule(this.spawnObstacle, Utils.randomRange(3, 6));
        }
        else {
            this._respawnCollider?.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.unschedule(this.spawnObstacle);
        }
    }

    reset() {
        this.destoryAllPlatforms();
        this._platformPool.clear();
        this.fillPools();
        this._lastPlatformYPos = 0;
    }

    onLoad() {
        this._respawnCollider = this.respawnPoint.getComponent(BoxCollider2D)!;
        this.fillPools();
    }

    onBeginContact(self:Collider2D, other:Collider2D, contact:IPhysics2DContact|null) {
        if (other.group === (1 << 3)) {
            let newYPos = this._lastPlatformYPos + Utils.randomRange(-335, 335);
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
        if (other.group === (1 << 7)) {
            console.log("destroy obstacle")
            this.scheduleOnce(()=> this.destroyObstacle(other.node));
        }
    }

    onDestroy() {
        this._platformPool.clear();
    }

    fillPools() {
        this._platformPool = new NodePool();
        this._obstaclePool = new NodePool();
        const amt = 50;
        for (let i = 0; i < amt; i++) {
            this._platformPool.put(instantiate(this.platformPrefab));
            this._obstaclePool.put(instantiate(this.obstaclePrefab));
        }
    }

    spawnPlatform(spawnPos:Vec3) {
        if (this._platformPool.size() <= 0 ) { 
            console.log("ran out of platforms.")
            return;
        }
        const platform = this._platformPool.get() as Node;
        this._platforms.push(platform);
        
        this.node.addChild(platform);
        platform.setPosition(spawnPos);
        platform.parent = this.node;
    }

    spawnObstacle() {
        if (this._obstaclePool.size() <= 0 ) {
            console.log("ran out of obstacles")
            return;
        }

        const obstacle = this._obstaclePool.get() as Node;
        let pos = new Vec3(this.node.position.x, this.playerNode.position.y, this.node.position.z);
        if (pos.y > this.maxScreenBoundary) { pos.y = this.maxScreenBoundary }
        if (pos.y < this.minScreenBoundary) { pos.y = this.minScreenBoundary }
        this._obstacles.push(obstacle);

        this.node.addChild(obstacle)
        obstacle.setPosition(pos);
        obstacle.parent = this.node;
    }

    destroyPlatform(platform:Node) {
        this._platformPool.put(platform);
        this._platforms.splice(this._platforms.indexOf(platform), 1);
        
    }
    destroyObstacle(obstacle:Node) {
        this._obstaclePool.put(obstacle)
        this._obstacles.splice(this._obstacles.indexOf(obstacle), 1);
    }

    destoryAllPlatforms(){
        this._platforms.forEach( (platform) => {
            this.destroyPlatform(platform);
        });

        this._obstacles.forEach( (obstacle) => this.destroyObstacle(obstacle));
    }
}
