import Rect from "@/tools/Rect";
import {
    TAllStaticDrawTypes,
    TStaticDrawBrush,
    TStaticDrawCircle,
    TStaticDrawEraser,
    TStaticDrawLine,
    TStaticDrawRect,
} from "@/types/TStaticDraw";
import Circle from "@/tools/Circle";
import Line from "@/tools/Line";
import Eraser from "@/tools/Eraser";
import Brush from "@/tools/Brush";

export default function drawAction(
    data: {
        method: string;
        points: TAllStaticDrawTypes;
    },
    context: CanvasRenderingContext2D,
) {
    switch (data.method) {
        case "rect":
            Rect.draw(data.points as TStaticDrawRect, context);
            break;
        case "circle":
            Circle.draw(data.points as TStaticDrawCircle, context);
            break;
        case "line":
            Line.draw(data.points as TStaticDrawLine, context);
            break;
        case "eraser":
            Eraser.draw(data.points as TStaticDrawEraser, context);
            break;
        case "brush":
            Brush.draw(data.points as TStaticDrawBrush, context);
            break;
    }
}
