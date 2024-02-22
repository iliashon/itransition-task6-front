"use client";

import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa";
const socket = io("http://localhost:4000", { autoConnect: false });

interface IBoardTitle {
    name: string;
    id: string;
}

export default function Board() {
    const [boards, setRooms] = useState<IBoardTitle[]>();
    const handleCreateRoom = () => {
        const name = prompt("Name room");
        socket.emit("create-board", { name: name });
    };

    useEffect(() => {
        socket.connect();
        socket.on("get-boards", (data) => {
            const boardsArr: IBoardTitle[] = [];
            for (const board in data) {
                boardsArr.push({
                    id: board,
                    name: data[board].name,
                });
            }
            setRooms(boardsArr);
        });
        socket.emit("get-boards");
    }, []);

    return (
        <>
            <Header />
            <div className="mt-24 mx-6">
                <div className="flex justify-between">
                    <h2 className="text-4xl">Boards</h2>
                    <button
                        onClick={handleCreateRoom}
                        className="bg-black text-white px-4 flex justify-center items-center gap-3 rounded-xl"
                    >
                        Create board
                        <FaPlus />
                    </button>
                </div>
                <div className="mt-10 flex justify-between flex-wrap gap-3">
                    {boards
                        ? boards.map((board) => {
                              return (
                                  <a
                                      href={`boards/${board.id}`}
                                      key={board.id}
                                      className="w-52 h-36 border flex justify-center items-center rounded-xl"
                                  >
                                      <span>{board.name}</span>
                                  </a>
                              );
                          })
                        : "Rooms is empty"}
                </div>
            </div>
        </>
    );
}
