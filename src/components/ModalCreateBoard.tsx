import { useState } from "react";
import { IoClose } from "react-icons/io5";

export function ModalCreateBoard({
    open,
    handleOpenModal,
    handleCreateBoard,
}: {
    open: boolean;
    handleOpenModal: () => void;
    handleCreateBoard: (name: string) => void;
}) {
    const [inputValue, setInputValue] = useState<string>("");

    const handleSendForm = () => {
        handleCreateBoard(inputValue);
        setInputValue("");
    };

    return (
        <>
            <div
                className={`w-full h-[100vh] absolute top-0 bg-black opacity-50 z-[70] ${open ? "" : "hidden"}`}
            />
            <div
                className={`${open ? "" : "hidden"} bg-white flex flex-col justify-between rounded-xl p-4 w-[350px] h-[200px] absolute z-[80] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            >
                <button
                    onClick={handleOpenModal}
                    className="absolute top-2 right-2 hover:opacity-50 duration-300"
                >
                    <IoClose className="h-7 w-7" />
                </button>
                <h3 className="text-xl text-center mt-3">Create board</h3>
                <input
                    type="text"
                    required
                    className="border-b border-black py-1 px-2 focus:outline-none"
                    placeholder="Board name"
                    value={inputValue}
                    onKeyDown={(e) =>
                        e.code === "Enter" ? handleSendForm() : ""
                    }
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    disabled={inputValue.length === 0}
                    className={`bg-black rounded-lg text-white py-2 duration-300 ${inputValue.length === 0 ? "opacity-50" : ""}`}
                    onClick={handleSendForm}
                >
                    Create
                </button>
            </div>
        </>
    );
}
