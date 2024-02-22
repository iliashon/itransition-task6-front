import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Brush from "@/tools/Brush";

export default function useDraw(room: string) {
    const [socket, setSocket] =
        useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
    const [isDownMouse, setIsDownMouse] = useState(false);
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const [context, setContext] = useState<CanvasRenderingContext2D | null>();
    const [initialCoordinates, setInitialCoordinates] = useState<{
        x: number;
        y: number;
    }>();

    useEffect(() => {
        setSocket(io(`http://localhost:4000?room=${room}`));
    }, []);

    socket?.on("drawing", (data) =>
        drawLine(data.x0, data.y0, data.x1, data.y1, false),
    );

    function createCanvasContext(canvas: HTMLCanvasElement) {
        setCanvas(canvas);
        const newContext = canvas.getContext("2d");
        setContext(newContext);
    }

    function drawLine(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        emit: boolean,
    ) {
        context?.moveTo(x0, y0);
        context?.lineTo(x1, y1);
        context?.stroke();
        if (!emit) {
            return;
        } else {
            socket?.emit("drawing", {
                x0: x0,
                y0: y0,
                x1: x1,
                y1: y1,
            });
        }
    }

    function handleMouseDown({ nativeEvent }: { nativeEvent: MouseEvent }) {
        setIsDownMouse(true);
        setInitialCoordinates({
            x: nativeEvent.offsetX,
            y: nativeEvent.offsetY,
        });
    }
    function handleMouseMove({ nativeEvent }: { nativeEvent: MouseEvent }) {
        if (isDownMouse) {
            drawLine(
                initialCoordinates?.x as number,
                initialCoordinates?.y as number,
                nativeEvent.offsetX,
                nativeEvent.offsetY,
                true,
            );
            setInitialCoordinates({
                x: nativeEvent.offsetX,
                y: nativeEvent.offsetY,
            });
        }
    }
    function handleMouseUp({ nativeEvent }: { nativeEvent: MouseEvent }) {
        setIsDownMouse(false);
    }

    return {
        createCanvasContext,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
}
