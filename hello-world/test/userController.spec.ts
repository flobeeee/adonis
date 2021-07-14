import Alarm from 'App/Models/Alarm'
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
      'user_id': 'posttest', 'email': 'posttest@gmail.com', 'password': 'test', 'passwordConfirmation': 'test'
    }).expect(201)
    assert.equal(created.body.userId, 'posttest')
    assert.equal(created.body.email, 'posttest@gmail.com')
    // alarm 레코드 생성 확인
    const alarm = await Alarm.findBy('user_id', created.body.id)
    assert.equal(alarm?.$attributes.user_id, created.body.id)

    const errUnique = await supertest(BASE_URL).post('/').send({
      'user_id': 'user2', 'email': 'unique@gmail.com', 'password': 'test', 'passwordConfirmation': 'test'
    }).expect(400)
    assert.equal(errUnique.body.errors[0].message, 'Username not available')

    const errValidMin = await supertest(BASE_URL).post('/').send({
      'user_id': 'a', 'password': 'test', 'passwordConfirmation': 'test'
    }).expect(400)
    assert.equal(errValidMin.body.errors[0].message, 'user_id has at least 2 length or more words')
    assert.equal(errValidMin.body.errors[1].message, 'Missing value for email')

    const errValid = await supertest(BASE_URL).post('/').send({
      'user_id': '123456789101112', 'password': 'test', 'passwordConfirmation': 'tttt'
    }).expect(400)
    assert.equal(errValid.body.errors[0].message, 'user_id length limit exceeded')
    assert.equal(errValid.body.errors[1].message, 'Missing value for email')
    assert.equal(errValid.body.errors[2].message, 'confirmed validation failed')

  })

  test('getAction', async (assert) => {
    const ok = await supertest(BASE_URL).get('/1').expect(200)
    assert.equal(ok.body.email, 'test1@gmail.com')

    await supertest(BASE_URL).get('/999').expect(404);

    const errRoute = await supertest(BASE_URL).get('/hi').expect(404)
    assert.include(errRoute.text, 'Cannot GET:/users/hi')
  })

  test('patchEmailAction', async (assert) => {
    const ok = await supertest(BASE_URL).patch('/1').send({ 'email': 'changed@gmail.com' }).expect(200)
    assert.equal(ok.body.email, 'changed@gmail.com')

    const errValudRequired = await supertest(BASE_URL).patch('/2').expect(400)
    assert.equal(errValudRequired.body.errors[0].message, 'Missing value for email')

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
