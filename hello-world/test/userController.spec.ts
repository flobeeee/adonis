import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/users`

test.group('UserControllers', () => {
  test('cgetAction', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/get/1').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.data.length, 10)

    await supertest(BASE_URL).get('/get/3').expect(204)

    const { text: errRoute } = await supertest(BASE_URL).get('/get/0').expect(404)
    const err = JSON.parse(errRoute)
    assert.include(err.message, 'Cannot GET:/users/get/0')
  })

  test('postAction', async (assert) => {
    const { text } = await supertest(BASE_URL).post('/').send({
      'user_id': 'posttest', 'name': '테스팅유저1', 'password': 'test'
    }).expect(201)
    const res = JSON.parse(text)
    assert.equal(res.user_id, 'posttest')
    assert.equal(res.name, '테스팅유저1')

    const { text: errUnique } = await supertest(BASE_URL).post('/').send({
      'user_id': 'user2', 'name': '중복테스트', 'password': 'test'
    }).expect(400)
    const err = JSON.parse(errUnique)
    assert.equal(err['errors'][0]['message'], 'unique validation failure')

    const { text: errValidMin } = await supertest(BASE_URL).post('/').send({
      'user_id': 'a', 'password': 'test'
    }).expect(400)
    const errLengthMin = JSON.parse(errValidMin)
    assert.equal(errLengthMin['errors'][0]['message'], 'minLength validation failed')
    assert.equal(errLengthMin['errors'][1]['message'], 'required validation failed')

    const { text: errValidMax } = await supertest(BASE_URL).post('/').send({
      'user_id': '123456789101112', 'password': 'test'
    }).expect(400)
    const errLengthMax = JSON.parse(errValidMax)
    assert.equal(errLengthMax['errors'][0]['message'], 'maxLength validation failed')
  })

  test('getAction', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/1').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.name, '유저1')

    await supertest(BASE_URL).get('/999').expect(404);

    const { text: errRoute } = await supertest(BASE_URL).get('/hi').expect(404)
    const err = JSON.parse(errRoute)
    assert.include(err.message, 'Cannot GET:/users/hi')
  })

  test('patchNameAction', async (assert) => {
    const { text } = await supertest(BASE_URL).patch('/1').send({ 'name': '변경된이름', 'password': '1111' }).expect(200)
    const res = JSON.parse(text)
    assert.equal(res.name, '변경된이름')

    await supertest(BASE_URL).patch('/1').expect(400)
    await supertest(BASE_URL).patch('/1').send({ 'password': '1112' }).expect(401)
    await supertest(BASE_URL).patch('/999').expect(400)

    const { text: errRoute } = await supertest(BASE_URL).patch('/hello').expect(404)
    const err = JSON.parse(errRoute)
    assert.include(err.message, 'Cannot PATCH:/users/hello')
  })

  test('ensure delete a user', async (assert) => {
    await supertest(BASE_URL).delete('/1').expect(204)

    await supertest(BASE_URL).get('/1').expect(404)

    await supertest(BASE_URL).delete('/999').expect(404)

    const { text: errRoute } = await supertest(BASE_URL).delete('/bye').expect(404)
    const err = JSON.parse(errRoute)
    assert.include(err.message, 'Cannot DELETE:/users/bye')
  })

})
