import { Vec2, Component, _decorator, CCInteger, CCFloat, instantiate, Prefab } from "cc";
import { Block } from "./Block";
const { ccclass, property } = _decorator;

@ccclass('SpawnManager')
export class SpawnManager extends Component {
    @property({type: Vec2})
    public xAxisPosition:number = 0;

    @property({type: Vec2})
    public yAxisPosition:number = 0;

    @property({type: Vec2})
    public MaxYaxisPosition:number = 0;

    @property({type: CCInteger})
    public obstaclePreFab:number = 0;

    @property({type: CCFloat})
    public SpawnInterval:number = 0;

    @property({type: CCFloat})
    public spwanRepeat:number = 0;

    @property({type: CCInteger})
    public DelayforFirstSpawn:number = 0;

    @property({type: Prefab})
    public ObstaclePrefab:number = 0;

    @property({type: NodeList})
    public blocks:Block[] = [];

    constructor() {
        super();
    }

    RandomizeYposition() {
        this.yAxisPosition = Math.random() * this.MaxYaxisPosition;
        return this.yAxisPosition;
    }

    spawnBlock(xAxis: number, yAxis: number) {
        const block = new Block;
        this.blocks.push(block);
        block.setPosition(xAxis, yAxis);

        //const node = instantiate(this.ObstaclePrefab);
    }

    spawnFirstBlock(delay: number, xAxis: number, yAxis: number) {
        this.schedule(() => {
            this.spawnBlock(xAxis, yAxis); 
        }, delay);
    }

    spawnBlocks(xAxis: number, yAxis: number) {
        this.schedule(() => {
            this.spawnBlock(xAxis, yAxis); 
        }, this.SpawnInterval, this.spwanRepeat);
    }

}