import Tool from "@/tools/Tool";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { TStaticDrawCircle } from "@/types/TStaticDraw";

export default class Circle extends Tool {
    private isMouseDown: boolean;
    private startX: number | null;
    private startY: number | null;
    private radius: number | null;
    private saved: string | null;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
        this.isMouseDown = false;
        this.startX = null;
        this.startY = null;
        this.radius = null;
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
            r: this.radius,
            color: this.context?.strokeStyle,
            lineWidth: this.context?.lineWidth,
        };
        this.socket?.emit("drawing", {
            method: "circle",
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
            let r = Math.sqrt(width ** 2 + height ** 2);
            this.draw(this.startX as number, this.startY as number, r);
        }
    }
    draw(x: number, y: number, r: number) {
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
            this.context?.arc(x, y, r, 0, 2 * Math.PI);
            this.radius = r;
            this.context?.stroke();
        };
    }

    static draw(
        { x, y, r, lineWidth, color }: TStaticDrawCircle,
        context: CanvasRenderingContext2D,
    ) {
        context?.beginPath();
        context?.arc(x, y, r, 0, 2 * Math.PI);
        context!.lineWidth = lineWidth;
        context!.strokeStyle = color;
        context?.stroke();
    }
}
