import Brush from "./Brush";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { TStaticDrawCircle, TStaticDrawEraser } from "@/types/TStaticDraw";

export default class Eraser extends Brush {
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
    ) {
        super(canvas, socket);
    }

    draw(x: number, y: number) {
        this.context!.strokeStyle = "white";
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
            method: "eraser",
            points: finalRect,
            image: this.canvas.toDataURL(),
        });
        this.startY = y;
        this.startX = x;
        this.context?.stroke();
    }
    static draw(
        { x, y, x1, y1, lineWidth, color }: TStaticDrawEraser,
        context: CanvasRenderingContext2D,
    ) {
        if (context) {
            context?.beginPath();
            context.moveTo(x, y);
            context?.lineTo(x1, y1);
            context?.stroke();
            context!.lineCap = "round";
            context!.lineWidth = lineWidth;
            context!.strokeStyle = color;
        }
    }
}
