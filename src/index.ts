import { app } from './app'

const port = process.env.PORT || 5000
export const server = app.listen(port, () => {
  console.log(`Todo-List server listening on port ${port}`)
})
