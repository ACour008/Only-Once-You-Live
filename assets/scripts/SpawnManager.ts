import { Vec3, Component, Node, _decorator, CCInteger, CCFloat, instantiate, Prefab, macro, UITransform } from "cc";
import { Obstacle } from "./Obstacle";
import { MoveLeft } from "./MoveLeft";
import { Utils } from "./Utils";
const { ccclass, property } = _decorator;

@ccclass('SpawnManager')
export class SpawnManager extends Component {

    @property({type:CCFloat})
    public StartXPosition:number = 0;

    @property({type: CCFloat})
    public MaxYaxisPosition:number = 0;

    @property({type: CCFloat})
    public SpawnInterval:number = 0;

    @property({type: CCInteger})
    public DelayforFirstSpawn:number = 0;

    @property({type: Prefab})
    public ObstaclePrefab:Prefab|null = null;

    @property({type: MoveLeft})
    public startingBlock:MoveLeft|null = null;

    constructor() {
        super();
    }

    randomizeSpawnPosition():Vec3 {
        let yAxis = Math.random() * this.MaxYaxisPosition
        return new Vec3(0, yAxis, 0);
    }

    randomizeSpawnLength(node:Node) {
        let transform:UITransform|null = node.getComponent(UITransform);
        if (transform) {
            transform.width = Utils.randomRange(64, 64*4);
        }
    }

    spawnObstacle() {
        let vec = this.randomizeSpawnPosition();
        if (this.ObstaclePrefab) {
            let obstacle:Node = instantiate(this.ObstaclePrefab);
            obstacle.position = this.randomizeSpawnPosition();
            this.randomizeSpawnLength(obstacle);
            this.node.addChild(obstacle);
        }
    }

    setSpawnActive(active:boolean) {
        if (active) {
            this.schedule(this.spawnObstacle, this.SpawnInterval, macro.REPEAT_FOREVER, this.DelayforFirstSpawn);
        } else {
            this.unschedule(this.spawnObstacle);
        }

        if (this.startingBlock) {
            this.startingBlock.setActive(active);
        }
    }

}