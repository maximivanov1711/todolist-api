import {app} from '../src/app'
import request from 'supertest'
import {TodoView} from '../src/models/todoModel'
import {HTTP_STATUSES} from '../src/enums'

async function createTestTodo() {
  const createTodoResponse = await request(app)
    .post('/todos')
    .send({
      title: 'New todo ' + +(new Date()),
      description: '',
      categories: []
    })

  const createdTodo = createTodoResponse.body

  return createdTodo
}

describe('GET /todos', () => {
  beforeEach(async () => {
    await request(app).get('/__test__/clearAllData/')
  })

  it('should return 200 and empty array when send without parameters', async () => {
    await request(app)
      .get('/todos')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return created todo', async () => {
    const newTodo = {
      title: 'New todo',
      description: '',
      categories: []
    }

    await request(app)
      .post('/todos')
      .send(newTodo)
      .expect(HTTP_STATUSES.CREATED_201)

    const getTodosResponse = await request(app)
      .get('/todos')
      .expect(HTTP_STATUSES.OK_200)

    const allTodos = getTodosResponse.body
    expect(allTodos).toHaveLength(1)
    const createdTodo = allTodos[0]
    expect(createdTodo).toMatchObject<TodoView>({
      ...newTodo,
      description: '',
      categories: [],
      id: expect.any(String),
      isCompleted: false,
    })
  });
})

describe('POST /todos', () => {
  it('when correct data sent should create a new todo and return 201 with created todo', async () => {
    const newTodo = {
      title: 'New todo',
      description: '',
      categories: []
    }

    const createTodoResponse = await request(app)
      .post('/todos')
      .send(newTodo)
      .expect(HTTP_STATUSES.CREATED_201)

    const createdTodo = createTodoResponse.body
    expect(createdTodo).toMatchObject<TodoView>({
      ...newTodo,
      id: expect.any(String),
      isCompleted: false,
    })
  })

  it('when incorrect data sent should return 400', async () => {
    const newTodo1 = {}

    await request(app)
      .post('/todos')
      .send(newTodo1)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    const newTodo2 = {
      title: 1
    }

    await request(app)
      .post('/todos')
      .send(newTodo2)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    const newTodo3 = {
      title: 'New todo',
      description: 'abc'.repeat(100)
    }

    await request(app)
      .post('/todos')
      .send(newTodo3)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    const newTodo4 = {
      title: 'New todo',
      categories: [1, 2, 3]
    }

    await request(app)
      .post('/todos')
      .send(newTodo4)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })
})

describe('PUT /todos/:id', () => {
  it('should update existing todo and return updated todo', async () => {
    const createdTodo = await createTestTodo()

    const updatedFields1 = {
      title: createdTodo.title + ' updated',
      description: 'New description',
      categories: [...createdTodo.categories, 'school'],
      isCompleted: true
    }

    const updateTodoRequest1 = await request(app)
      .put('/todos/' + createdTodo.id)
      .send(updatedFields1)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdTodo,
        ...updatedFields1
      })
    const updatedTodo1 = updateTodoRequest1.body

    const updatedFields2 = {
      title: 'New title'
    }

    await request(app)
      .put('/todos/' + createdTodo.id)
      .send(updatedFields2)
      .expect(HTTP_STATUSES.OK_200, {
        ...updatedTodo1,
        ...updatedFields2
      })
  })

  it('should return 400 when truing to update not existing field', async () => {
    const createdTodo = await createTestTodo()

    const updatedFields = {
      someField: 'blabla'
    }

    await request(app)
      .put('/todos/' + createdTodo.id)
      .send(updatedFields)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app)
      .get('/todos/' + createdTodo.id)
      .expect(HTTP_STATUSES.OK_200, createdTodo)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete existing todo and return 204', async () => {
    const data = {
      title: 'New todo',
      description: '',
      categories: []
    }
    const createTodoResponse = await request(app)
      .post('/todos')
      .send(data)

    const createdTodo = createTodoResponse.body

    await request(app)
      .delete('/todos/' + createdTodo.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get('/todos/' + createdTodo.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('should return 404 when trying to delete not existing todo', async () => {
    await request(app)
      .delete('/todos/000f1f77bcf86cd799439011')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('should return 400 when passing invalid todo id', async () => {
    await request(app)
      .delete('/todos/-1')
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app)
      .delete('/todos/abc')
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })
})