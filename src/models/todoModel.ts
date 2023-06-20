import mongoose, {model, Schema} from 'mongoose'
import {z} from 'zod'

export const TodoViewSchema = z.object({
  id: z.string().refine((id: string) => {
    try {
      new mongoose.Types.ObjectId(id)
      return true
    } catch (e) {
      return false
    }
  }, {
    message: 'Id should be a valid ObjectId'
  }),
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  }).max(256, {message: 'Title should be shorter than 256 symbols'}),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  categories: z.array(z.string()),
  isCompleted: z.boolean()
})
export const TodoDBSchema = z.object({
  ...TodoViewSchema.shape,
  _id: z.instanceof(mongoose.Types.ObjectId),
  __v: z.number()
})

export type TodoView = z.infer<typeof TodoViewSchema>
export type TodoDB = z.infer<typeof TodoDBSchema>

const _TodoDBSchema = new Schema<TodoDB>({
  title: {type: String, required: true},
  description: {type: String, required: true, minlength: 0},
  categories: {type: [String], required: true},
  isCompleted: {type: Boolean, required: false, default: false},
})
export const Todo = model<TodoDB>('Todo', _TodoDBSchema)

export const getTodoView = (todoDB: TodoDB): TodoView => {
  return {
    id: todoDB._id.toString(),
    title: todoDB.title,
    description: todoDB.description,
    isCompleted: todoDB.isCompleted,
    categories: todoDB.categories
  }
}

