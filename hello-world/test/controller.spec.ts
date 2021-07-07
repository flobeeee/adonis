import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/users`

test.group('controllers testing', () => {
  test('ensure read all user', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/get/1').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.data.length, 2)
  })

  test('ensure create a user', async (assert) => {
    const { text } = await supertest(BASE_URL).post('/').send({ 'user_id': 'testing1', 'name': '테스팅유저1' }).expect(201)
    const res = JSON.parse(text)
    assert.equal(res.user_id, 'testing1')
    assert.equal(res.name, '테스팅유저1')

    await supertest(BASE_URL).post('/').send({ 'user_id': 'badRequest' }).expect(400)

  })

  test('ensure read a user', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/1').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.name, '유저1')

    await supertest(BASE_URL).get('/999').expect(404);
    // todo 숫자가 아닌 index 받아서 에러처리 테스트
  })

  test('ensure update user name', async (assert) => {
    const { text } = await supertest(BASE_URL).patch('/1').send({ 'name': '변경된이름' }).expect(200)
    const res = JSON.parse(text)
    assert.equal(res.name, '변경된이름')

    await supertest(BASE_URL).patch('/999').expect(404)

    const { text: errBody } = await supertest(BASE_URL).patch('/1').expect(400)
    const errBodyRes = JSON.parse(errBody)
    assert.equal(errBodyRes['message'], 'required name')
    // todo 숫자가 아닌 index 받아서 에러처리 테스트
  })

  test('ensure delete a user', async (assert) => {
    await supertest(BASE_URL).delete('/999').expect(404)
    await supertest(BASE_URL).delete('/1').expect(204)

    const { text } = await supertest(BASE_URL).get('/get/1').expect(200)
    const res = JSON.parse(text)
    assert.equal(res['data'].length, 2)
    // todo 숫자가 아닌 index 받아서 에러처리 테스트
  })

})
