import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { TBoard } from '../types/board';
import { TTodo } from '../types/todo';
import { persist } from 'zustand/middleware';

type BoardStore = {
  boardList: TBoard[];
  addBoard: (name: string) => void;
  addTodo: (boardId: string, content: string) => void;
  removeBoard: (boardId: string) => void;
  removeTodo: (boardId: string, todoId: string) => void;
  editBoard: (boardId: string, name: string) => void;
  editTodo: (boardId: string, todoId: string, content: string) => void;
  moveBoard: (boardId: string, dropIndex: number) => void;
  moveTodo: (
    dragBoardId: string,
    dropBoardId: string,
    dragTodoId: string,
    dropTodoIndex: number
  ) => void;
};

export const useBoardStore = create(
  persist<BoardStore>(
    (set) => ({
      boardList: [],
      addBoard: (name: string) =>
        set((state) => {
          const newBoard: TBoard = {
            id: uuidv4(),
            name,
            todos: [],
          };

          return { boardList: [newBoard, ...state.boardList] };
        }),
      addTodo: (boardId: string, content: string) =>
        set((state) => {
          const newTodo: TTodo = {
            id: uuidv4(),
            content,
          };

          const newList = state.boardList.map((board) => {
            if (board.id === boardId) {
              return {
                ...board,
                todos: [newTodo, ...board.todos],
              };
            }
            return board;
          });
          return { boardList: newList };
        }),
      removeBoard: (boardId: string) =>
        set((state) => {
          const newList = state.boardList.filter(
            (board) => board.id !== boardId
          );
          return { boardList: newList };
        }),
      removeTodo: (boardId: string, todoId: string) =>
        set((state) => {
          const newList = state.boardList.map((board) => {
            if (board.id === boardId) {
              return {
                ...board,
                todos: board.todos.filter((todo) => todo.id !== todoId),
              };
            }
            return board;
          });
          return { boardList: newList };
        }),
      editBoard: (boardId: string, name: string) =>
        set((state) => {
          const newList = state.boardList.map((board) => {
            if (board.id === boardId) {
              return {
                ...board,
                name,
              };
            }
            return board;
          });
          return { boardList: newList };
        }),
      editTodo: (boardId: string, todoId: string, content: string) =>
        set((state) => {
          const newList = state.boardList.map((board) => {
            if (board.id === boardId) {
              return {
                ...board,
                todos: board.todos.map((todo) => {
                  if (todo.id === todoId) {
                    return {
                      ...todo,
                      content,
                    };
                  }
                  return todo;
                }),
              };
            }
            return board;
          });
          return { boardList: newList };
        }),
      moveBoard: (boardId: string, dropIndex: number) => {
        set((state) => {
          const dragIndex = state.boardList.findIndex(
            (board) => board.id === boardId
          );
          const dragBoard = state.boardList[dragIndex];
          const newList = [...state.boardList];
          newList.splice(dragIndex, 1);
          newList.splice(dropIndex, 0, dragBoard);

          return { boardList: newList };
        });
      },
      moveTodo: (
        dragBoardId: string,
        dropBoardId: string,
        dragTodoId: string,
        dropTodoIndex: number
      ) => {
        set((state) => {
          if (dragBoardId === dropBoardId) {
            const boardIndex = state.boardList.findIndex(
              (board) => board.id === dragBoardId
            );
            const board = state.boardList[boardIndex];
            const dragTodoIndex = board.todos.findIndex(
              (todo) => todo.id === dragTodoId
            );
            const dragTodo = board.todos[dragTodoIndex];

            const newBoard = {
              ...board,
              todos: board.todos.filter((todo) => todo.id !== dragTodoId),
            };
            newBoard.todos.splice(dropTodoIndex, 0, dragTodo);

            const newList = [...state.boardList];
            newList.splice(boardIndex, 1, newBoard);

            return { boardList: newList };
          } else {
            const dragBoardIndex = state.boardList.findIndex(
              (board) => board.id === dragBoardId
            );
            const dropBoardIndex = state.boardList.findIndex(
              (board) => board.id === dropBoardId
            );
            const dragBoard = state.boardList[dragBoardIndex];
            const dropBoard = state.boardList[dropBoardIndex];
            const dragTodoIndex = dragBoard.todos.findIndex(
              (todo) => todo.id === dragTodoId
            );
            const dragTodo = dragBoard.todos[dragTodoIndex];

            const newDragBoard = {
              ...dragBoard,
              todos: dragBoard.todos.filter((todo) => todo.id !== dragTodoId),
            };
            const newDropBoard = {
              ...dropBoard,
              todos: [...dropBoard.todos],
            };
            newDropBoard.todos.splice(dropTodoIndex, 0, dragTodo);

            const newList = [...state.boardList];
            newList.splice(dragBoardIndex, 1, newDragBoard);
            newList.splice(dropBoardIndex, 1, newDropBoard);

            return { boardList: newList };
          }
        });
      },
    }),
    {
      name: 'board-store', 
    }
  )
);
