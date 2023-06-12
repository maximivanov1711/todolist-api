import express from 'express'
import mongoose from 'mongoose'
import { getTodosRouter } from './routes/todosRouter'
import { getTestRouter } from './routes/testRouter'

const MONGODB_URI = 'mongodb+srv://maximivanov1711:iamaxim2004@cluster0.dpoadpm.mongodb.net/?retryWrites=true&w=majority'
async function setupDB() {
  const Str = mongoose.Schema.Types.String as any
  Str.checkRequired((v: any) => v != null)
  await mongoose.connect(MONGODB_URI)
}
setupDB()

export const app = express()

app.use(express.json())

app.use('/todos', getTodosRouter())
app.use('/__test__', getTestRouter())


