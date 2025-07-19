import { Todo as TodoType } from "@/actions/todo/types/todo";
import { Todo } from "@/components/todo";

interface TodoListProps {
  todos: TodoType[];
}

export const TodoList = ({ todos }: TodoListProps) => {
  return (
    <div className="w-1/2 flex flex-col space-y-1">
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
