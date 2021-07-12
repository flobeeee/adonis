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
    // console.log('test 17', errAuth.error)
    assert.include(errAuth.text, 'Invalid credentials')

    // todo 없는 유저 찾는 경우
    // todo 유효성검사 메세지 확인 테스트
    const valid = await supertest(BASE_URL).post('/').send({
      'user_id': '1', 'password': '2222'
    }).expect(400)
    assert.include(valid.text, 'Invalid credentials')
    // assert.equal(valid.text, 'value has at least 2 length or more words')

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