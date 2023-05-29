import express from 'express'
import { GenericRequest, Response } from '../types/types'

export const getTodosRouter = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.send('all todos')
  })

  router.post('/', (req, res) => {
    res.send('new todo created')
  })

  return router
}