import {Todo, TodoDB, getTodoView, TodoView} from '../models/todoModel'
import {TodoNotFoundError} from "../errors";

export async function getAllTodos() {
  const queryTodosResult = await Todo.find().exec()
  const foundTodosDB: TodoDB[] = queryTodosResult.map(d => d.toObject())
  const foundTodosView = foundTodosDB.map(getTodoView)

  return foundTodosView
}

export async function getTodoById(id: string) {
  const queryTodosResult = await Todo.findById(id).exec()

  if (!queryTodosResult) throw new TodoNotFoundError(`Todo with id "${id}" not found`)

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

export async function updateTodo(id: string, updatedFields: object) {
  const updatedTodo = await Todo.findByIdAndUpdate(id, updatedFields, {new: true})

  if (updatedTodo === null) throw new TodoNotFoundError(`Todo with id "${id}" not found`)

  const updatedTodoDB = updatedTodo.toObject()
  const updatedTodoView = getTodoView(updatedTodoDB)

  return updatedTodoView
}

export async function deleteTodo(id: string) {
  const removedTodo = await Todo.findByIdAndRemove(id)

  if (removedTodo === null) throw new TodoNotFoundError(`Todo with id "${id}" not found`)
}