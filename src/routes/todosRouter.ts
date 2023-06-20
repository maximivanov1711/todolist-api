import {Router} from 'express'
import {HTTP_STATUSES} from '../enums'
import {TodoView, TodoViewSchema} from '../models/todoModel'
import {getTodoById, getAllTodos, createTodo, deleteTodo, updateTodo} from '../controllers/todoController'
import {GenericRequest, GenericResponse, ErrorResponse} from '../types'
import {validateRequest} from "zod-express-middleware";
import {z} from "zod";
import {TodoNotFoundError} from "../errors";

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

  const getTodoByIdRequestSchema = z.object({
    params: z.object({
      id: TodoViewSchema.shape.id
    })
  })
  router.get('/:id',
    validateRequest(getTodoByIdRequestSchema.shape),
    async (
      req: GenericRequest<z.infer<typeof getTodoByIdRequestSchema>>,
      res: GenericResponse<{
        body: TodoView
      } | ErrorResponse>
    ) => {
      try {
        const foundTodo = await getTodoById(req.params.id)

        res.status(HTTP_STATUSES.OK_200)
        res.json(foundTodo)
      } catch (e) {
        if (e instanceof TodoNotFoundError) {
          res.status(404)
          res.json({
            message: e.message
          })
        }
      }
    })

  const createTodoRequestSchema = z.object({
    body: z.object({
      title: TodoViewSchema.shape.title,
      description: TodoViewSchema.shape.description,
      categories: TodoViewSchema.shape.categories
    })
  })
  router.post('/',
    validateRequest(createTodoRequestSchema.shape),
    async (
      req: GenericRequest<z.infer<typeof createTodoRequestSchema>>,
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

  const updateTodoRequestSchema = z.object({
    params: z.object({
      id: TodoViewSchema.shape.id
    }),
    body: TodoViewSchema.partial().omit({id: true}).strict()
  })
  router.put('/:id',
    validateRequest(updateTodoRequestSchema.shape),
    async (
      req: GenericRequest<z.infer<typeof updateTodoRequestSchema>>,
      res: GenericResponse<TodoView>
    ) => {
      try {
        const updatedTodo = await updateTodo(req.params.id, req.body)

        res.status(HTTP_STATUSES.OK_200)
        res.json(updatedTodo)
      } catch (e) {
        if (e instanceof TodoNotFoundError) {
          res.status(404)
          res.json({
            message: e.message
          })
        }
      }
    }
  )

  const deleteTodoRequestSchema = z.object({
    params: z.object({
      id: TodoViewSchema.shape.id
    })
  })
  router.delete('/:id',
    validateRequest(deleteTodoRequestSchema.shape),
    async (
      req: GenericRequest<z.infer<typeof deleteTodoRequestSchema>>,
      res: GenericResponse<{}>
    ) => {
      try {
        await deleteTodo(req.params.id)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
      } catch (e) {
        if (e instanceof TodoNotFoundError) {
          res.status(404)
          res.json({
            message: e.message
          })
        }
      }
    }
  )

  return router
}