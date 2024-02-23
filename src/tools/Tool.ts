import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default class Tool {
    public canvas: HTMLCanvasElement;
    public socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    public context: CanvasRenderingContext2D | null;
    public id: string | null;
    constructor(
        canvas: HTMLCanvasElement,
        socket?: Socket<DefaultEventsMap, DefaultEventsMap>,
        id?: string,
    ) {
        this.canvas = canvas;
        this.socket = socket || null;
        this.id = id || null;
        this.context = canvas.getContext("2d");
        this.destroyEvents();
    }

    destroyEvents() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}
