import { TTodo } from './todo';

export type TBoard = {
  id: string;
  name: string;
  todos: TTodo[];
};
