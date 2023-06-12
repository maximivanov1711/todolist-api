import { app } from '../src/app'
import request from 'supertest'
import { TodoView } from '../src/models/todoModel'
import { HTTP_STATUSES } from '../src/enums'

describe('GET /todos', () => {
  beforeEach(async () => {
    await request(app).get('/__test__/clearAllData/')
  })

  it('should return 200 and empty array when send without parameters', async () => {
    await request(app)
      .get('/todos')
      .expect(HTTP_STATUSES.OK_200, [])
  })
})

describe('POST /todos', () => {
  it('should create a new todo and return 201 with created todo', async () => {
    const newTodo = {
      title: 'New todo',
      description: '',
      categories: []
    }

    const createTodoResponse = await request(app)
      .post('/todos')
      .send(newTodo)
      .expect(201)

    const createdTodo = createTodoResponse.body
    expect(createdTodo).toMatchObject<TodoView>({
      ...newTodo,
      id: expect.any(String),
      isCompleted: false,
    })
  })
})