import Tool from "@/tools/Tool";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default class Brush extends Tool {
    private isMouseDown: boolean;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
        this.isMouseDown = false;
        this.listen();
        this.context!.lineWidth = 5;
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseUpHandler(e: MouseEvent) {
        this.isMouseDown = false;
    }
    mouseDownHandler(e: MouseEvent) {
        this.isMouseDown = true;
        this.context?.beginPath();
        this.context?.moveTo(e.offsetX, e.offsetY);
    }
    mouseMoveHandler(e: MouseEvent) {
        if (this.isMouseDown) {
            this.draw(e.offsetX, e.offsetY);
        }
    }

    draw(x: number, y: number) {
        this.context?.lineTo(x, y);
        this.context?.stroke();
    }
}
