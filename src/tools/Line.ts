import Tool from "@/tools/Tool";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default class Line extends Tool {
    private isMouseDown: boolean;
    private startX: number | null;
    private startY: number | null;
    private saved: string | null;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
        this.isMouseDown = false;
        this.startX = null;
        this.startY = null;
        this.saved = null;
        this.listen();
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
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.context?.moveTo(e.offsetX, e.offsetY);
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(e: MouseEvent) {
        if (this.isMouseDown) {
            this.draw(e.offsetX, e.offsetY);
        }
    }
    draw(x: number, y: number) {
        const img = new Image();
        img.src = this.saved!;
        img.onload = () => {
            this.context?.clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height,
            );
            this.context?.drawImage(
                img,
                0,
                0,
                this.canvas.width,
                this.canvas.height,
            );
            this.context?.beginPath();
            this.context?.moveTo(this.startX!, this.startY!);
            this.context?.lineTo(x, y);
            this.context?.stroke();
        };
    }
}
