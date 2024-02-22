import * as buffer from "buffer";

export type TStaticDrawRect = {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    lineWidth: number;
};

export type TStaticDrawCircle = {
    color: string;
    lineWidth: number;
    r: number;
    x: number;
    y: number;
};

export type TStaticDrawEraser = {
    color: string;
    lineWidth: number;
    x1: number;
    y1: number;
    x: number;
    y: number;
};

export type TStaticDrawBrush = {
    color: string;
    lineWidth: number;
    x1: number;
    y1: number;
    x: number;
    y: number;
};
