import Brush from "./Brush";

export default class Eraser extends Brush {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    draw(x: number, y: number) {
        this.context!.strokeStyle = "white";
        this.context!.lineWidth = 10;
        this.context?.lineTo(x, y);
        this.context?.stroke();
    }
}
