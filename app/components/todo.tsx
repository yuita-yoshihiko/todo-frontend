"use client";

import { Todo as TodoType } from "@/actions/todo/types/todo";
import { PenIcon, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

interface TodoProps {
  todo: TodoType;
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "タイトルは2文字以上で入力してください。" }),
});

export const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const { title } = value;
    try {
      const response = await fetch(
        `http://localhost:8787/api/todos/${todo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ title }),
        }
      );

      if (!response.ok) {
        throw new Error("サーバーエラーが発生しました。");
      }
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error("フォーム送信エラー:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8787/api/todos/${id}/delete`, {
        method: "PUT",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Todo削除に失敗しました");
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Todo"
                  {...field}
                  className="p-4 py-8 text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="p-8">
          保存
        </Button>
      </form>
    </Form>
  ) : (
    <div className="flex border rounded-md p-4 shadow-sm w-full justify-between">
      <p className="text-lg">{todo.title}</p>
      <div className="flex space-x-2">
        <PenIcon className="cursor-pointer" onClick={() => handleEdit()} />
        <Trash
          className="cursor-pointer"
          onClick={() => handleDelete(todo.id)}
        />
      </div>
    </div>
  );
};
