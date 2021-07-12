import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/login`

test.group('AuthController', () => {
  let auth // token 테스트

  test('postLoginAction', async (assert) => {
    const ok = await supertest(BASE_URL).post('/').send({
      'user_id': 'user2', 'password': '2222'
    }).expect(200)

    const errAuth = await supertest(BASE_URL).post('/').send({
      'user_id': 'user3', 'password': '2222'
    }).expect(400)
    assert.equal(errAuth.text, 'Invalid credentials')

    auth = ok.body
  })

  test('getMypageAction', async (assert) => {
    const ok = await supertest(BASE_URL)
      .get('/mypage')
      .auth(auth.token, { type: 'bearer' })
      .expect(200)
    assert.equal(ok.body.name, '유저2')

    await supertest(BASE_URL)
      .get('/mypage')
      .auth(auth.token + 1, { type: 'bearer' })
      .expect(401)
  })
})