import { Request, Response } from 'express'

export type GenericRequest<T> = Request<
  T extends { params: infer P } ? P : {},
  {},
  T extends { body: infer B } ? B : {},
  T extends { query: infer Q } ? Q : {}
>

export type GenericResponse<T> = Response<
  T extends { body: infer B } ? B : {}
>

