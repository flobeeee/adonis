import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/login`

test.group('AuthController', () => {
  let auth // token 테스트

  test('postLoginAction', async (assert) => {
    const ok = await supertest(BASE_URL).post('/').send({
      'user_id': 'user2', 'password': '2222'
    }).expect(200)
    auth = ok.body // token 할당

    const errAuth = await supertest(BASE_URL).post('/').send({
      'user_id': 'user3', 'password': '2222'
    }).expect(401)
    assert.equal(errAuth.text, 'invalid ID or wrong password')

    const valid = await supertest(BASE_URL).post('/').send({
      'user_id': '1', 'password': '2222'
    }).expect(401)
    assert.equal(valid.text, 'invalid ID or wrong password')
  })

  test('getMypageAction', async (assert) => {
    const ok = await supertest(BASE_URL)
      .get('/mypage')
      // .auth(auth.token, { type: 'bearer' })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect(200)
    assert.equal(ok.body.email, 'test2@gmail.com')

    await supertest(BASE_URL)
      .get('/mypage')
      .set('Authorization', 'Bearer ' + auth.token + 1)
      .expect(401)
  })

  test('putAction', async (assert) => {
    const ok = await supertest(BASE_URL)
      .put('/2')
      .send({ 'email': 'change@gmail.com', 'password': 'change' })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect(200)
    assert.equal(ok.body.email, 'change@gmail.com')
    // 비밀번호 변경 후 로그인 테스트
    await supertest(BASE_URL).post('/')
      .send({ 'user_id': 'user2', 'password': 'change' }).expect(200)

    const valid = await supertest(BASE_URL)
      .put('/2')
      .send({ 'email': '12345678901112', 'password': 'change' })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect(400)
    assert.equal(valid.body.errors[0].message, 'email validation failed')

    await supertest(BASE_URL)
      .put('/3')
      .send({ 'email': 'notoken@gmail.com', 'password': 'change' })
      .set('Authorization', 'Bearer ')
      .expect(401)

    const wrongToken = await supertest(BASE_URL)
      .put('/3')
      .send({ 'email': 'wrongtoken@gmail.com', 'password': 'change' })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect(401)
    assert.equal(wrongToken.text, 'wrong token')
  })
})