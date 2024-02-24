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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IPropertyTool } from "@/types/IPropertyTool";

import { TDrawAction } from "@/types/TStaticDraw";
import drawAction from "@/utils/drawAction";
import Link from "next/link";
import { VscHome } from "react-icons/vsc";
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
    const searchParams = useSearchParams();
    const [propertyTool, setPropertyTool] = useState<IPropertyTool>({
        strokeColor: "#000000",
        lineWidth: 5,
    });
    const [context, setContext] = useState<null | CanvasRenderingContext2D>();
    const router = useRouter();
    const [isOpenBoardName, setIsOpenBoardName] = useState(false);

    const handleActiveTool = (index: number) => {
        const changeActiveTool = activeTool.map((item) => (item = false));
        changeActiveTool[index] = true;
        setActiveTool(changeActiveTool);
        handleSetPropertyTool();
    };

    useEffect(() => {
        const socket = io(`ws://api.itupalski.com?board=${params.board}`, {
            transports: ["websocket"],
        });
        setSocket(socket);
        socket.on("error", () => {
            localStorage.setItem("boards", "There is no such board");
            setTimeout(() => {
                localStorage.removeItem("boards");
            }, 7000);
            router.push("/boards");
        });
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
        setContext(canvas.current?.getContext("2d"));
        handleSetPropertyTool();
    }, []);

    const handleSetPropertyTool = () => {
        if (context) {
            context.lineWidth = propertyTool.lineWidth;
            context.strokeStyle = propertyTool.strokeColor;
        }
    };

    const handleDownload = () => {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.current?.width as number;
        newCanvas.height = canvas.current?.height as number;
        const ctx = newCanvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
        ctx.drawImage(canvas.current as HTMLCanvasElement, 0, 0);
        const a = document.createElement("a");
        a.href = newCanvas.toDataURL("image/jpeg") as string;
        a.download = "canvas";
        a.click();
    };

    return (
        <>
            <div
                className={`absolute duration-300 -top-6 left-1/2 transform -translate-x-1/2 bg-gray-600/30 px-7 py-0.5 rounded-b-xl text-sm -mt-1 ${isOpenBoardName ? "top-1" : ""}`}
            >
                {searchParams.get("name") || "Name not found"}
            </div>
            <div
                onMouseMove={() => setIsOpenBoardName(true)}
                onMouseLeave={() => setIsOpenBoardName(false)}
                className="rounded-r-xl group w-16 -left-16 hover:left-0 duration-300 absolute top-1/2 transform -translate-y-1/2 backdrop-blur-sm bg-gray-600/30 flex flex-col justify-between gap-5 py-4"
            >
                <div className="cursor-pointer group-hover:right-0 group-hover:opacity-0 duration-300 flex items-center rounded-r-lg absolute top-1/2 transform -translate-y-1/2 -right-5 h-20 w-5 bg-gray-600/30">
                    <FaGripLinesVertical className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col items-center gap-5">
                    <Link href={"/boards"}>
                        <VscHome className="h-8 w-8 text-white hover:scale-125 duration-300" />
                    </Link>
                    <button
                        className={`${activeTool[0] ? `scale-100` : ""} duration-200`}
                        onClick={() => {
                            new Brush(canvas.current!, socket);
                            handleActiveTool(0);
                        }}
                    >
                        <LuBrush
                            color={
                                activeTool[0]
                                    ? propertyTool.strokeColor
                                    : "white"
                            }
                            className="h-8 w-8 hover:scale-125 duration-300"
                        />
                    </button>
                    <button
                        className={`${activeTool[1] ? `scale-100` : ""} duration-200`}
                        onClick={() => {
                            new Rect(canvas.current!, socket);
                            handleActiveTool(1);
                        }}
                    >
                        <LuSquare
                            color={
                                activeTool[1]
                                    ? propertyTool.strokeColor
                                    : "white"
                            }
                            className="h-8 w-8 text-white hover:scale-125 duration-300"
                        />
                    </button>
                    <button
                        className={`${activeTool[2] ? `scale-100` : ""} duration-200`}
                        onClick={() => {
                            new Circle(canvas.current!, socket);
                            handleActiveTool(2);
                        }}
                    >
                        <LuCircle
                            color={
                                activeTool[2]
                                    ? propertyTool.strokeColor
                                    : "white"
                            }
                            className="h-8 w-8 text-white hover:scale-125 duration-300"
                        />
                    </button>
                    <button
                        className={`${activeTool[3] ? `scale-100` : ""} duration-200`}
                        onClick={() => {
                            new Line(canvas.current!, socket);
                            handleActiveTool(3);
                        }}
                    >
                        <LuMinus
                            color={
                                activeTool[3]
                                    ? propertyTool.strokeColor
                                    : "white"
                            }
                            className="h-8 w-8 text-white rotate-45 hover:scale-125 duration-300"
                        />
                    </button>
                    <button
                        className={`${activeTool[4] ? `scale-100` : ""} duration-200`}
                        onClick={() => {
                            new Eraser(canvas.current!, socket);
                            handleActiveTool(4);
                        }}
                    >
                        <LuEraser
                            color={
                                activeTool[4]
                                    ? propertyTool.strokeColor
                                    : "white"
                            }
                            className="h-8 w-8 text-white hover:scale-125 duration-300"
                        />
                    </button>
                </div>
                <div className="flex flex-col items-center gap-5">
                    <div className="w-12 h-8 overflow-hidden rounded-lg relative">
                        <input
                            className="w-16 h-12 absolute -top-[5px] -left-[5px] cursor-pointer"
                            type="color"
                            value={propertyTool.strokeColor}
                            onChange={(e) => {
                                setPropertyTool({
                                    ...propertyTool,
                                    strokeColor: e.target.value,
                                });
                                handleSetPropertyTool();
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
                            handleSetPropertyTool();
                        }}
                    />
                    <button onClick={handleDownload}>
                        <LuDownload className="h-8 w-8 text-white cursor-pointer hover:scale-125 duration-300" />
                    </button>
                </div>
            </div>
        </>
    );
}
