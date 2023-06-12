import { ObjectId, Schema, model } from 'mongoose'

export type TodoView = {
  id: string
  title: string,
  description: string,
  categories: string[],
  isCompleted: boolean

}

export type TodoDB = {
  title: string,
  description: string,
  isCompleted: boolean,
  categories: string[]
  _id: ObjectId,
  __v: number
}

export const getTodoView = (todoDB: TodoDB): TodoView => {
  return {
    id: todoDB._id.toString(),
    title: todoDB.title,
    description: todoDB.description,
    isCompleted: false,
    categories: todoDB.categories ? todoDB.categories : []
  }
}

const TodoSchema = new Schema<TodoDB>({
  title: { type: String, required: true },
  description: { type: String, required: true, minlength: 0 },
  categories: { type: [String], required: true },
  isCompleted: { type: Boolean, required: false, default: false },
})
export const Todo = model<TodoDB>('Todo', TodoSchema)