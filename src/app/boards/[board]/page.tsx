"use client";

import { useEffect, useRef, useState } from "react";
import ToolBar from "@/components/board/ToolBar";

export default function Page() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [sizeCanvas, setSizeCanvas] = useState<{
        width: number;
        height: number;
    }>();

    useEffect(() => {
        setSizeCanvas({
            width: window.innerWidth - 80,
            height: window.innerHeight,
        });
    }, []);

    return (
        <>
            <ToolBar canvas={canvas} />
            <canvas
                className="bg-white float-right"
                ref={canvas}
                width={sizeCanvas?.width}
                height={sizeCanvas?.height}
            ></canvas>
        </>
    );
}
