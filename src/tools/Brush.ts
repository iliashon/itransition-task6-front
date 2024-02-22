import Tool from "@/tools/Tool";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { TStaticDrawBrush, TStaticDrawEraser } from "@/types/TStaticDraw";

export default class Brush extends Tool {
    private isMouseDown: boolean;
    public startX: number | null;
    public startY: number | null;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
        this.isMouseDown = false;
        this.listen();
        this.context!.lineWidth = 5;
        this.startX = null;
        this.startY = null;
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
        this.startX = e.offsetX;
        this.startY = e.offsetY;
    }
    mouseMoveHandler(e: MouseEvent) {
        if (this.isMouseDown) {
            this.draw(e.offsetX, e.offsetY);
        }
    }

    draw(x: number, y: number) {
        this.context?.lineTo(x, y);
        const finalRect = {
            x: this.startX,
            y: this.startY,
            x1: x,
            y1: y,
            color: this.context?.strokeStyle,
            lineWidth: this.context?.lineWidth,
        };
        this.socket?.emit("drawing", {
            method: "brush",
            points: finalRect,
        });
        this.startY = y;
        this.startX = x;
        this.context?.stroke();
    }

    static draw(
        { x, y, x1, y1, lineWidth, color }: TStaticDrawBrush,
        context: CanvasRenderingContext2D,
    ) {
        context?.beginPath();
        context?.moveTo(x, y);
        context?.lineTo(x1, y1);
        context!.lineWidth = lineWidth;
        context!.strokeStyle = "#000000";
        context?.stroke();
    }
}
