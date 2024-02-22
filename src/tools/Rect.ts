import Tool from "@/tools/Tool";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { IPropertyTool } from "@/types/IPropertyTool";
import { TStaticDrawRect } from "@/types/TStaticDraw";

export default class Rect extends Tool {
    private isMouseDown: boolean;
    private startX: number | null;
    private startY: number | null;
    private saved: string | null;
    private width: number | null;
    private height: number | null;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
        this.isMouseDown = false;
        this.startX = null;
        this.startY = null;
        this.width = null;
        this.height = null;
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
            w: this.width,
            h: this.height,
            color: this.context?.strokeStyle,
            lineWidth: this.context?.lineWidth,
        };
        this.socket?.emit("drawing", {
            method: "rect",
            points: finalRect,
        });
    }
    mouseDownHandler(e: MouseEvent) {
        this.isMouseDown = true;
        this.context?.beginPath();
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(e: MouseEvent) {
        if (this.isMouseDown) {
            const width = e.offsetX - this.startX!;
            const height = e.offsetY - this.startY!;
            this.draw(
                this.startX as number,
                this.startY as number,
                width,
                height,
            );
        }
    }
    draw(x: number, y: number, w: number, h: number) {
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
            this.context?.rect(x, y, w, h);
            this.width = w;
            this.height = h;
            this.context?.stroke();
        };
    }

    static draw(
        { x, y, w, h, lineWidth, color }: TStaticDrawRect,
        context: CanvasRenderingContext2D,
    ) {
        context?.beginPath();
        context?.rect(x, y, w, h);
        context!.lineWidth = lineWidth;
        context!.strokeStyle = color;
        context?.stroke();
    }
}
