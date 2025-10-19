import { ActionPanel, Action, Form, showToast, List as RaycastList, Icon, Toast} from "@raycast/api"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Todo } from "./types"
import { saveTodos, loadTodos } from "./storage"

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchTodos() {
            const loadedTodos = await loadTodos()
            setTodos(loadedTodos)
            setIsLoading(false)
        }
    }, [])

    async function addTodo(values: { title: string; description: string}) {
        const newTodo: Todo = {
            id: uuidv4(),
            title: values.title,
            description: values.description,
            completed: false,
            createdAt: new Date(),
        }

        const updatedTodos = [...todos, newTodo]
        setTodos(updatedTodos)
        await saveTodos(updatedTodos)

        showToast({
            style: Toast.Style.Success,
            title: "Todo Added",
            message: `"${values.title}" has been added to your todo list.`,
        })
    }

    async function toggleTodo(todoId: string) {
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )

        setTodos(updatedTodos)
        await saveTodos(updatedTodos)
    }

    async function deleteTodo(todoId: string) {
        const updatedTodos = todos.filter(todo => todo.id !== todoId)
        setTodos(updatedTodos)
        await saveTodos(updatedTodos)

        showToast({
            style: Toast.Style.Success,
            title: "Todo Deleted",
            message: `The todo has been deleted from your list.`,
        })
    }

    return (
        <RaycastList isLoading={isLoading}>
            <RaycastList.Section title="Todo List">
                {todos.map((todo) => (
                    <RaycastList.Item
                        key={todo.id}
                        title={todo.title}
                        subtitle={todo.description}
                        icon={todo.completed ? Icon.Checkmark : Icon.Circle}
                        actions={
                            <ActionPanel>
                                <Action
                                    title={todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
                                    onAction={() => toggleTodo(todo.id)}
                                />
                                <Action
                                    title="Delete Todo"
                                    style={Action.Style.Destructive}
                                    onAction={() => deleteTodo(todo.id)}
                                />
                            </ActionPanel>
                        }
                    />
                ))}
            </RaycastList.Section>
        </RaycastList>
    )
}