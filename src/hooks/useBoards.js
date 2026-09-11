import { useContext } from "react";
import BoardContext from "../context/BoardContext";

export function useBoards() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error("useBoards must be used inside BoardProvider");
  }

  return context;
}
