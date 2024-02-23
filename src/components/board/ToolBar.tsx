import Brush from "@/tools/Brush";
import {
    LuBrush,
    LuCircle,
    LuDownload,
    LuEraser,
    LuMinus,
    LuSquare,
} from "react-icons/lu";
import Rect from "@/tools/Rect";
import Circle from "@/tools/Circle";
import Line from "@/tools/Line";
import { RefObject, useEffect, useState } from "react";
import Eraser from "@/tools/Eraser";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useParams } from "next/navigation";
import { IPropertyTool } from "@/types/IPropertyTool";

import {
    TDrawAction,
    TStaticDrawBrush,
    TStaticDrawCircle,
    TStaticDrawEraser,
    TStaticDrawLine,
    TStaticDrawRect,
} from "@/types/TStaticDraw";
import drawAction from "@/utils/drawAction";
import Link from "next/link";
import { VscHome } from "react-icons/vsc";
import { BiArrowFromLeft } from "react-icons/bi";
import { SlArrowRight } from "react-icons/sl";
import { FaGripLinesVertical } from "react-icons/fa";

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
        strokeColor: "",
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
            data.forEach((item: TDrawAction) => {
                drawAction(
                    item,
                    canvas.current?.getContext(
                        "2d",
                    ) as CanvasRenderingContext2D,
                );
            });
        });
        socket?.emit("get-points");
        socket?.on("drawing", (data: TDrawAction) => {
            drawAction(
                data,
                canvas.current?.getContext("2d") as CanvasRenderingContext2D,
            );
        });
    }, []);

    useEffect(() => {
        const context = canvas.current?.getContext("2d");
        context!.lineWidth = propertyTool.lineWidth;
        context!.strokeStyle = propertyTool.strokeColor;
    }, [propertyTool]);

    const handleDownload = () => {
        const dataUrl = canvas.current?.toDataURL("image/jpeg");
        const a = document.createElement("a");
        a.href = dataUrl as string;
        a.download = "canvas";
        a.click();
    };

    return (
        <div className=" rounded-r-xl w-16 -left-16 hover:left-0 duration-300 absolute top-1/2 transform -translate-y-1/2 backdrop-blur-sm bg-gray-600/30 flex flex-col justify-between gap-5 py-4">
            <div className="flex items-center rounded-r-lg absolute top-1/2 transform -translate-y-1/2 -right-6 h-20 bg-gray-600/30">
                <FaGripLinesVertical className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col items-center gap-5">
                <Link href={"/boards"}>
                    <VscHome className="h-8 w-8 text-white" />
                </Link>
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
                <div className="w-12 h-8 overflow-hidden rounded-lg relative">
                    <input
                        className="h-[200%] w-[200%] -top-1/2 -left-1/2 absolute cursor-pointer"
                        type="color"
                        onChange={(e) => {
                            setPropertyTool({
                                ...propertyTool,
                                strokeColor: e.target.value,
                            });
                        }}
                    />
                </div>
                <input
                    type="number"
                    className="w-12 h-8 px-2 rounded-lg border-0 focus:outline-none"
                    value={propertyTool.lineWidth}
                    onChange={(e) => {
                        setPropertyTool({
                            ...propertyTool,
                            lineWidth: Number(e.target.value),
                        });
                    }}
                />
                <button onClick={handleDownload}>
                    <LuDownload className="h-8 w-8 text-white cursor-pointer" />
                </button>
            </div>
        </div>
    );
}
