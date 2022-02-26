
import { _decorator, Component, Prefab, Node, CCFloat, Collider2D, instantiate, macro, 
    randomRange, randomRangeInt, Contact2DType, IPhysics2DContact, CCInteger } from 'cc';
import { Obstacle } from './Obstacle';
import { PhysicsGroups } from '../Enums';
const { ccclass, property } = _decorator;

const OFFSETS = [0, 180, 270, 360];
 
@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    
    @property([Prefab])
    private obstaclePrefabs:Array<Prefab> = [];

    @property(Collider2D)
    private respawnPoint!:Collider2D;

    @property(CCFloat)
    private spawnIntervalInSecs:number = 4;

    @property(CCInteger)
    private spawnLimit:number = 3;

    @property(CCFloat)
    private minForceSpeed:number = -15;

    @property(CCFloat)
    private maxForceSpeed:number = -25;

    @property(Node)
    private playerNode!:Node;

    private _spawnedObstacles:Array<Node>  = [];

    reset() {
        this._spawnedObstacles.forEach((obstacle) => obstacle.destroy() );
    }

    public activate(active:boolean):void {
        if (active) {
            this.schedule(this.spawnObstacles, this.spawnIntervalInSecs, macro.REPEAT_FOREVER);
            this.respawnPoint.on(Contact2DType.END_CONTACT, this.respawnPoint_onContactEnd, this);
        }
        else {
            this.unschedule(this.spawnObstacles);
            this.respawnPoint.off(Contact2DType.END_CONTACT, this.respawnPoint_onContactEnd, this);
        }
    }

    private spawnObstacles():void {

        const limit = randomRangeInt(1, this.spawnLimit + 1);
        this.schedule(this._spawn, 1, limit);
    }

    private _spawn() {
        const prefab:Prefab = this.getPrefab();
        const obstacle:Node = instantiate(prefab);
        const component:Obstacle|null = obstacle.getComponent(Obstacle);

        if (component) {
            component.setOffset(this.playerNode.position.y);
            component.setForceX(randomRange(this.minForceSpeed, this.maxForceSpeed));
        }

        this._spawnedObstacles.push(obstacle);
        obstacle.setParent(this.respawnPoint.node);
    }

    private getPrefab():Prefab {
        let randomIndex = randomRangeInt(0, this.obstaclePrefabs.length);
        return this.obstaclePrefabs[randomIndex];
    }

    private respawnPoint_onContactEnd(self:Collider2D, other:Collider2D, contact:IPhysics2DContact) {

        if (other.group === PhysicsGroups.OBSTACLE) {
            this.scheduleOnce( () => {
                const node = other.node;
                const index = this._spawnedObstacles.indexOf(node);
                this._spawnedObstacles.splice(index, 1);
                node.destroy();
            });
        }
    }
}
