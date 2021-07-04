import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure read all user', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.length, 2)
  })

  test('ensure create a user', async (assert) => {
    // const { text } = await (await supertest(BASE_URL).post('/')).body 바디에 어떻게 넣지?
    // const res = JSON.parse(text)
    const user = new User()
    user.user_id = 'testing1'
    user.name = '테스팅유저1'
    await user.save()
    assert.equal(user.name, '테스팅유저1')
  })

  test('ensure read a user', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/1').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.name, '유저1')
  })

  test('ensure update user name', async (assert) => {
    const { text } = await supertest(BASE_URL).patch('/1').expect(400) // 바디 없어서
    const res = JSON.parse(text)
    assert.equal(res['message'], 'required name')
  })

  test('ensure delete a user', async (assert) => {
    await supertest(BASE_URL).delete('/99').expect(404)

    await supertest(BASE_URL).delete('/1').expect(200)
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    const res = JSON.parse(text)
    assert.equal(res.length, 2)
  })

})
