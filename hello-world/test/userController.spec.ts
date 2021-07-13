import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/users`

test.group('UserControllers', () => {
  test('cgetAction', async (assert) => {
    const ok = await supertest(BASE_URL).get('/get/1').expect(200)
    assert.equal(ok.body.data.length, 10)

    await supertest(BASE_URL).get('/get/3').expect(204)

    const errRoute = await supertest(BASE_URL).get('/get/0').expect(404)
    assert.include(errRoute.text, 'Cannot GET:/users/get/0')
  })

  test('postAction', async (assert) => {
    const created = await supertest(BASE_URL).post('/').send({
      'user_id': 'posttest', 'name': '테스팅유저1', 'password': 'test'
    }).expect(201)
    assert.equal(created.body.userId, 'posttest')
    assert.equal(created.body.name, '테스팅유저1')

    const errUnique = await supertest(BASE_URL).post('/').send({
      'user_id': 'user2', 'name': '중복테스트', 'password': 'test'
    }).expect(400)
    assert.equal(errUnique.body.errors[0].message, 'Username not available')

    const errValidMin = await supertest(BASE_URL).post('/').send({
      'user_id': 'a', 'password': 'test'
    }).expect(400)
    assert.equal(errValidMin.body.errors[0].message, 'user_id has at least 2 length or more words')
    assert.equal(errValidMin.body.errors[1].message, 'Missing value for name')

    const errValidMax = await supertest(BASE_URL).post('/').send({
      'user_id': '123456789101112', 'password': 'test'
    }).expect(400)
    assert.equal(errValidMax.body.errors[0].message, 'user_id length limit exceeded')
  })

  test('getAction', async (assert) => {
    const ok = await supertest(BASE_URL).get('/1').expect(200)
    assert.equal(ok.body.name, '유저1')

    await supertest(BASE_URL).get('/999').expect(404);

    const errRoute = await supertest(BASE_URL).get('/hi').expect(404)
    assert.include(errRoute.text, 'Cannot GET:/users/hi')
  })

  test('patchNameAction', async (assert) => {
    const ok = await supertest(BASE_URL).patch('/1').send({ 'name': '변경된이름' }).expect(200)
    assert.equal(ok.body.name, '변경된이름')

    const errValudRequired = await supertest(BASE_URL).patch('/2').expect(400)
    assert.equal(errValudRequired.body.errors[0].message, 'Missing value for name')

    await supertest(BASE_URL).patch('/1').expect(400)
    await supertest(BASE_URL).patch('/1').send({ 'password': '1112' }).expect(400)
    await supertest(BASE_URL).patch('/999').expect(400)

    const errRoute = await supertest(BASE_URL).patch('/hello').expect(404)
    assert.include(errRoute.text, 'Cannot PATCH:/users/hello')
  })

  test('ensure delete a user', async (assert) => {
    await supertest(BASE_URL).delete('/1').expect(204)

    await supertest(BASE_URL).get('/1').expect(404)

    await supertest(BASE_URL).delete('/999').expect(404)

    const errRoute = await supertest(BASE_URL).delete('/bye').expect(404)
    assert.include(errRoute.text, 'Cannot DELETE:/users/bye')
  })

})
