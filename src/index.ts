import express from 'express'
import mongoose from 'mongoose'
import { getTodosRouter } from './routes/todos'

const app = express()
const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)


const mongodb_uri = 'mongodb+srv://maximivanov1711:iamaxim2004@cluster0.dpoadpm.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongodb_uri)

app.use('/todos', getTodosRouter())

const port = 3000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
