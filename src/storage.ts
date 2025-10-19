import { LocalStorage } from "@raycast/api"
import { Todo } from "./types"

export async function saveTodos(todos: Todo[]) {
    await LocalStorage.setItem("todos", JSON.stringify(todos))
}

export async function loadTodos(): Promise<Todo[]> {
    const storedTodos = await LocalStorage.getItem<string>("todos")
    return storedTodos ? JSON.parse(storedTodos): []
}