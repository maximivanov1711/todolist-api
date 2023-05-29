import { Request, Response as ExpressResponse } from 'express'

export type GenericRequest<T> = Request<
  T extends { params: infer P } ? P : {},
  {},
  T extends { body: infer B } ? B : {},
  T extends { query: infer Q } ? Q : {}
>

export type Response = ExpressResponse