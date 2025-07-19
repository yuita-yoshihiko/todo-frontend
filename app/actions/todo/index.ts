import { Todo } from "@/actions/todo/types/todo";

export const getAllTodos = async (): Promise<Todo[]> => {
  const response = await fetch("http://localhost:8787/api/todos", {
    cache: "no-store",
  });
  const data = await response.json();
  return data;
};
