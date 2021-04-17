import { Vec2, Component, _decorator, CCInteger } from "cc";
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    @property({type: Vec2})
    public xAxisPosition:number = 0;

    @property({type: Vec2})
    public yAxisPosition:number = 0;

    @property({type: CCInteger})
    public speed:number = 0;

    constructor() {
        super()
    }

    despawnBlock() {
        this.destroy();
    }

    setPosition(xAxis: number, Yaxis: number) {
        this.xAxisPosition = xAxis;
        this.yAxisPosition = Yaxis;
    }
}