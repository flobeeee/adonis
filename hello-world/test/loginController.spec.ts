import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('LoginController', () => {
  let auth

  test('postLoginAction', async (assert) => {
    const { text } = await supertest(BASE_URL).post('/login').send({
      'user_id': 'user2', 'password': '2222'
    }).expect(200)

    const { text: errAuth } = await supertest(BASE_URL).post('/login').send({
      'user_id': 'user3', 'password': '2222'
    }).expect(400)
    assert.equal(errAuth, 'Invalid credentials')

    auth = JSON.parse(text)

  })

  test('getMypageAction', async (assert) => {
    const { text } = await supertest(BASE_URL)
      .get('/mypage')
      .auth(auth.token, { type: 'bearer' })
      .send({
        'user_id': 'user2', 'password': '2222'
      }).expect(200)
    const res = JSON.parse(text)
    assert.equal(res.name, '유저2')

    await supertest(BASE_URL)
      .get('/mypage')
      .auth(auth.token + 1, { type: 'bearer' })
      .send({
        'user_id': 'user2', 'password': '2222'
      }).expect(401)
  })
})