"use client";

import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline, MdDraw } from "react-icons/md";
import Image from "next/image";
import { IBoardInfo } from "@/types/IBoardInfo";
import { ModalCreateBoard } from "@/components/ModalCreateBoard";
const socket = io("http://localhost:4000", { autoConnect: false });

export default function Board() {
    const [boards, setRooms] = useState<IBoardInfo[]>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const handleCreateBoard = (name: string) => {
        socket.emit("create-board", { name: name });
        handleOpenModal();
    };

    const handleDeleteBoard = (name: string) => {
        socket.emit("delete-board", name);
    };

    const handleOpenModal = () => {
        setIsOpenModal(!isOpenModal);
    };

    useEffect(() => {
        socket.connect();
        socket.on("get-boards", (data) => {
            const boardsArr: IBoardInfo[] = [];
            for (const board in data) {
                boardsArr.push({
                    id: board,
                    name: data[board].name,
                    image: data[board].preview,
                });
            }
            setRooms(boardsArr);
        });
        socket.emit("get-boards");
    }, []);

    return (
        <>
            <ModalCreateBoard
                open={isOpenModal}
                handleOpenModal={handleOpenModal}
                handleCreateBoard={handleCreateBoard}
            />
            <Header />
            <div className="mt-24 mx-6">
                <div className="flex justify-between">
                    <h2 className="text-4xl">Boards</h2>
                    <button
                        onClick={handleOpenModal}
                        className="bg-black text-white px-4 flex justify-center items-center gap-3 rounded-xl"
                    >
                        Create board
                        <FaPlus />
                    </button>
                </div>
                <ul className="mt-10 flex justify-between flex-wrap gap-3">
                    {boards
                        ? boards.map((board) => {
                              return (
                                  <li
                                      key={board.id}
                                      className="w-80 h-52 border flex flex-col rounded-xl"
                                  >
                                      <div className="w-full h-3/4 border-b rounded-t-xl overflow-hidden">
                                          <Image
                                              className="w-full h-full object-cover object-center"
                                              src={board.image || "/photo.jpg"}
                                              alt=""
                                              width={50}
                                              height={50}
                                          />
                                      </div>
                                      <div className="flex h-1/4 items-center justify-between px-4">
                                          <span className="font-bold text-xl">
                                              {board.name}
                                          </span>
                                          <div className="flex gap-3">
                                              <button
                                                  onClick={() =>
                                                      handleDeleteBoard(
                                                          board.id,
                                                      )
                                                  }
                                                  className="bg-red-500 px-3 py-1 rounded-xl hover:opacity-70 duration-300"
                                              >
                                                  <MdDeleteOutline className="h-7 w-7 text-white" />
                                              </button>
                                              <a
                                                  href={`boards/${board.id}`}
                                                  className="bg-green-500 px-3 py-1 rounded-xl hover:opacity-70 duration-300"
                                              >
                                                  <MdDraw className="h-7 w-7 text-white " />
                                              </a>
                                          </div>
                                      </div>
                                  </li>
                              );
                          })
                        : ""}
                </ul>
                {boards?.length === 0 ? (
                    <div className="text-center mt-32">
                        <h2 className="text-xl font-light">
                            The list of boards is empty
                        </h2>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    );
}
