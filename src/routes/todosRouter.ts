import { Router } from 'express'
import { HTTP_STATUSES } from '../enums'
import { TodoView } from '../models/todoModel'
import { getTodoById, getAllTodos, createTodo } from '../controllers/todoController'
import { GenericRequest, GenericResponse } from '../types'

export const getTodosRouter = () => {
  const router = Router()

  router.get('/', async (
    req: GenericRequest<{}>,
    res: GenericResponse<{
      body: TodoView[]
    }>
  ) => {
    const foundTodos = await getAllTodos()

    res.status(HTTP_STATUSES.OK_200)
    res.json(foundTodos)
  })

  router.get('/:id', async (
    req: GenericRequest<{
      params: {
        id: string
      }
    }>,
    res: GenericResponse<{
      body: TodoView
    }>
  ) => {
    const foundTodo = await getTodoById(req.params.id)

    if (foundTodo === null) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200)
    res.json(foundTodo)
  })

  router.post('/', async (
    req: GenericRequest<{
      body: {
        title: string,
        description: string,
        categories: string[]
      }
    }>,
    res: GenericResponse<TodoView>
  ) => {
    const createdTodo = await createTodo(
      req.body.title,
      req.body.description,
      req.body.categories
    )

    res.status(HTTP_STATUSES.CREATED_201)
    res.json(createdTodo)
  })

  return router
}