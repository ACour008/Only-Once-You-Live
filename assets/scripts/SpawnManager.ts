import { Vec3, Component, Node, _decorator, CCInteger, CCFloat, instantiate, Prefab, macro, UITransform } from "cc";
import { Utils } from "./Utils";
const { ccclass, property } = _decorator;

const yPositions = [50, 100, 150, 75, 25, 125];

@ccclass('SpawnManager')
export class SpawnManager extends Component {


    @property({type: CCFloat})
    public SpawnInterval:number = 0;

    @property({type: CCInteger})
    public DelayforFirstSpawn:number = 0;

    @property({type: [Prefab]})
    public ObstaclePrefabs:Prefab[] = [];

    private _lastSpawn:number = -1;

    randomizeSpawnPosition():Vec3 {
        let randomIndex = Math.floor(Math.random() * yPositions.length);
        let yAxis = yPositions[randomIndex];
        return new Vec3(0, yAxis, 0);
    }

    spawnObstacle() {
        let vec = this.randomizeSpawnPosition();

        if (this.ObstaclePrefabs) {
            let idx = Math.floor(Math.random() * this.ObstaclePrefabs.length);
            if (this._lastSpawn > -1 && this._lastSpawn === idx) {
                idx = idx % this.ObstaclePrefabs.length;
            }
            let obstacle:Node = instantiate(this.ObstaclePrefabs[idx]);
            obstacle.position = vec;
            this.node.addChild(obstacle);
            console.log(obstacle.position);
            
        }
    }

    setSpawnActive(active:boolean) {
        if (active) {
            this.schedule(this.spawnObstacle, this.SpawnInterval, macro.REPEAT_FOREVER, this.DelayforFirstSpawn);
        } else {
            this.unscheduleAllCallbacks();
        }
    }

}