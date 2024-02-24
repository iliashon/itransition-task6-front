"use client";

import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline, MdDraw } from "react-icons/md";
import Image from "next/image";
import { IBoardInfo } from "@/types/IBoardInfo";
import { ModalCreateBoard } from "@/components/ModalCreateBoard";
import { ClipLoader } from "react-spinners";
import { Alert } from "@mui/material";
import Link from "next/link";
const socket = io("ws://api.itupalski.com", {
    autoConnect: false,
    transports: ["websocket"],
});

export default function Board() {
    const [boards, setRooms] = useState<IBoardInfo[]>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isLoadingGetBoards, setIsLoadingGetBoards] = useState(false);
    const [errorNotBoard, setErrorNotBoard] = useState<null | string>(null);
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
        setIsLoadingGetBoards(true);
        socket.connect();
        socket.on("get-boards", (data) => {
            setIsLoadingGetBoards(true);
            const boardsArr: IBoardInfo[] = [];
            for (const board in data) {
                boardsArr.push({
                    id: board,
                    name: data[board].name,
                    image: data[board].preview,
                });
            }
            setRooms(boardsArr);
            setIsLoadingGetBoards(false);
        });
        socket.emit("get-boards");
    }, []);

    useEffect(() => {
        setErrorNotBoard(localStorage.getItem("boards"));
        setTimeout(() => {
            setErrorNotBoard(null);
        }, 7000);
    }, []);

    return (
        <>
            <Header />
            <ModalCreateBoard
                open={isOpenModal}
                handleOpenModal={handleOpenModal}
                handleCreateBoard={handleCreateBoard}
            />
            <div className="mt-24 mx-6">
                <div className="flex justify-between">
                    <h2 className="text-4xl">Boards</h2>
                    <button
                        onClick={handleOpenModal}
                        className="bg-black text-white text-sm px-4 flex justify-center items-center gap-3 rounded-xl"
                    >
                        New board
                        <FaPlus />
                    </button>
                </div>
                <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-10">
                    {boards
                        ? boards.map((board) => {
                              return (
                                  <li
                                      key={board.id}
                                      className="h-52 border flex flex-col rounded-xl"
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
                                              <Link
                                                  href={`boards/${board.id}?name=${board.name}`}
                                                  className="bg-green-500 px-3 py-1 rounded-xl hover:opacity-70 duration-300"
                                              >
                                                  <MdDraw className="h-7 w-7 text-white " />
                                              </Link>
                                          </div>
                                      </div>
                                  </li>
                              );
                          })
                        : ""}
                </ul>
                {isLoadingGetBoards ? (
                    <div className="text-center mt-32">
                        <ClipLoader className="w-12 h-12" />
                    </div>
                ) : (
                    ""
                )}
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
            {errorNotBoard ? (
                <Alert className="absolute bottom-4 left-4" severity="error">
                    {errorNotBoard}
                </Alert>
            ) : (
                ""
            )}
        </>
    );
}
