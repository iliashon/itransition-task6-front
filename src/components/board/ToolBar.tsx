import Brush from "@/tools/Brush";
import { LuBrush, LuCircle, LuEraser, LuMinus, LuSquare } from "react-icons/lu";
import Rect from "@/tools/Rect";
import Circle from "@/tools/Circle";
import Line from "@/tools/Line";
import { RefObject, useEffect, useState } from "react";
import Eraser from "@/tools/Eraser";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useParams } from "next/navigation";
import { IPropertyTool } from "@/types/IPropertyTool";
import Tool from "@/tools/Tool";
import {
    TStaticDrawBrush,
    TStaticDrawCircle,
    TStaticDrawEraser,
    TStaticDrawRect,
} from "@/types/TStaticDraw";

export default function ToolBar({
    canvas,
}: {
    canvas: RefObject<HTMLCanvasElement>;
}) {
    const [activeTool, setActiveTool] = useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [socket, setSocket] =
        useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
    const params = useParams();
    const [propertyTool, setPropertyTool] = useState<IPropertyTool>({
        fillColor: "#ffffff",
        strokeColor: "#000000",
        lineWidth: 5,
    });

    const handleActiveTool = (index: number) => {
        const changeActiveTool = activeTool.map((item) => (item = false));
        changeActiveTool[index] = true;
        setActiveTool(changeActiveTool);
    };

    useEffect(() => {
        const socket = io(`http://localhost:4000?board=${params.board}`);
        setSocket(socket);
        socket?.on("get-points", (data) => {
            data.forEach((item: any) => {
                switch (item.method) {
                    case "rect":
                        Rect.draw(
                            item.points as TStaticDrawRect,
                            canvas.current?.getContext(
                                "2d",
                            ) as CanvasRenderingContext2D,
                        );
                        break;
                    case "circle":
                        Circle.draw(
                            item.points as TStaticDrawCircle,
                            canvas.current?.getContext(
                                "2d",
                            ) as CanvasRenderingContext2D,
                        );
                        break;
                    case "line":
                        console.log(item);
                        break;
                    case "eraser":
                        console.log(item);
                        Eraser.draw(
                            item.points as TStaticDrawEraser,
                            canvas.current?.getContext(
                                "2d",
                            ) as CanvasRenderingContext2D,
                        );
                        break;
                    case "brush":
                        console.log(item);
                        Brush.draw(
                            item.points as TStaticDrawBrush,
                            canvas.current?.getContext(
                                "2d",
                            ) as CanvasRenderingContext2D,
                        );
                        break;
                }
            });
        });
        socket?.emit("get-points");
    }, []);

    useEffect(() => {
        const context = canvas.current?.getContext("2d");
        context!.lineWidth = propertyTool.lineWidth;
        context!.strokeStyle = propertyTool.strokeColor;
        context!.fillStyle = propertyTool.fillColor;
    }, [propertyTool]);

    return (
        <div className="h-[80vh] mt-[10vh] rounded-xl ml-5 w-16 bg-gray-400 absolute top-0 flex flex-col justify-between left-0 py-4">
            <div className="flex flex-col items-center gap-5">
                <button
                    className={`${activeTool[0] ? "scale-125" : ""} duration-200`}
                    onClick={() => {
                        new Brush(canvas.current!, socket);
                        handleActiveTool(0);
                    }}
                >
                    <LuBrush className="h-8 w-8 text-white" />
                </button>
                <button
                    className={`${activeTool[1] ? "scale-125" : ""} duration-200`}
                    onClick={() => {
                        new Rect(canvas.current!, socket);
                        handleActiveTool(1);
                    }}
                >
                    <LuSquare className="h-8 w-8 text-white" />
                </button>
                <button
                    className={`${activeTool[2] ? "scale-125" : ""} duration-200`}
                    onClick={() => {
                        new Circle(canvas.current!, socket);
                        handleActiveTool(2);
                    }}
                >
                    <LuCircle className="h-8 w-8 text-white" />
                </button>
                <button
                    className={`${activeTool[3] ? "scale-125" : ""} duration-200`}
                    onClick={() => {
                        new Line(canvas.current!, socket);
                        handleActiveTool(3);
                    }}
                >
                    <LuMinus className="h-8 w-8 text-white rotate-45" />
                </button>
                <button
                    className={`${activeTool[4] ? "scale-125" : ""} duration-200`}
                    onClick={() => {
                        new Eraser(canvas.current!, socket);
                        handleActiveTool(4);
                    }}
                >
                    <LuEraser className="h-8 w-8 text-white" />
                </button>
            </div>
            <div className="flex flex-col items-center gap-5">
                <input
                    type="color"
                    onChange={(e) => {
                        setPropertyTool({
                            ...propertyTool,
                            strokeColor: e.target.value,
                        });
                    }}
                />
                <input
                    type="number"
                    className="w-12"
                    value={propertyTool.lineWidth}
                    onChange={(e) => {
                        setPropertyTool({
                            ...propertyTool,
                            lineWidth: Number(e.target.value),
                        });
                    }}
                />
                <input
                    type="color"
                    onChange={(e) => {
                        setPropertyTool({
                            ...propertyTool,
                            fillColor: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
}
