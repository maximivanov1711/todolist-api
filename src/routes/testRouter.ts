import { Router } from 'express'
import { HTTP_STATUSES } from '../enums'
import { Todo } from '../models/todoModel'


export const getTestRouter = () => {
  const router = Router()

  router.get('/clearAllData', async (req, res) => {
    await Todo.deleteMany({})

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  })

  return router
}