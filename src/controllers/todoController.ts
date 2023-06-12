import { Todo, TodoDB, getTodoView } from "../models/todoModel"

export async function getAllTodos() {
  const queryTodosResult = await Todo.find().exec()
  const foundTodosDB: TodoDB[] = queryTodosResult.map(d => d.toObject())
  const foundTodosView = foundTodosDB.map(getTodoView)

  return foundTodosView
}

export async function getTodoById(id: string) {
  const queryTodosResult = await Todo.findById(id).exec()

  if (!queryTodosResult) return null

  const foundTodoDB: TodoDB = queryTodosResult.toObject()
  const foundTodoView = getTodoView(foundTodoDB)

  return foundTodoView
}

export async function createTodo(
  title: string,
  description: string,
  categories: string[]
) {
  const todo = new Todo({
    title: title,
    description: description,
    categories: categories
  })

  await todo.save()

  const todoDB = todo.toObject()
  const todoView = getTodoView(todoDB)

  return todoView
}