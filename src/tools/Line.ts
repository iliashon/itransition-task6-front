import Tool from "@/tools/Tool";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { TStaticDrawBrush, TStaticDrawLine } from "@/types/TStaticDraw";

export default class Line extends Tool {
    private isMouseDown: boolean;
    private startX: number | null;
    private startY: number | null;
    private saved: string | null;
    private lastX: number | null;
    private lastY: number | null;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
        this.isMouseDown = false;
        this.startX = null;
        this.startY = null;
        this.lastX = null;
        this.lastY = null;
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
        const finalRect = {
            x: this.startX,
            y: this.startY,
            x1: this.lastX,
            y1: this.lastY,
            color: this.context?.strokeStyle,
            lineWidth: this.context?.lineWidth,
        };
        this.socket?.emit("drawing", {
            method: "line",
            points: finalRect,
        });
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
            this.lastX = x;
            this.lastY = y;
            this.context?.stroke();
        };
    }
    static draw(
        { x, y, x1, y1, lineWidth, color }: TStaticDrawLine,
        context: CanvasRenderingContext2D,
    ) {
        context?.beginPath();
        context?.moveTo(x, y);
        context?.lineTo(x1, y1);
        context?.stroke();
        context!.lineCap = "round";
        context!.lineWidth = lineWidth;
        context!.strokeStyle = "#000000";
    }
}
