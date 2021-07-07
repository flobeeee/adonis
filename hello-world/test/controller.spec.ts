import test from 'japa';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('controllers testing', () => {
  test('ensure read all user', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200);
    const res = JSON.parse(text);
    assert.equal(res.length, 2);
  })

  test('ensure create a user', async (assert) => {
    const { text } = await supertest(BASE_URL).post('/').send({ 'user_id': 'testing1', 'name': '테스팅유저1' }).expect(201);
    const res = JSON.parse(text);
    assert.equal(res.message, 'created');

    await supertest(BASE_URL).post('/').send({ 'user_id': 'badRequest' }).expect(400);

  })

  test('ensure read a user', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/1').expect(200);
    const res = JSON.parse(text);
    assert.equal(res.name, '유저1');

    await supertest(BASE_URL).get('/999').expect(404);
  })

  test('ensure update user name', async (assert) => {
    const { text } = await supertest(BASE_URL).patch('/1').send({ 'name': '변경된이름' }).expect(200);
    const res = JSON.parse(text);
    assert.equal(res['message'], 'updated');

    await supertest(BASE_URL).patch('/999').expect(404);

    const { text: errBody } = await supertest(BASE_URL).patch('/1').expect(400);
    const errBodyRes = JSON.parse(errBody);
    assert.equal(errBodyRes['message'], 'required name');
  })

  test('ensure delete a user', async (assert) => {
    await supertest(BASE_URL).delete('/999').expect(404);

    await supertest(BASE_URL).delete('/1').expect(200);
    const { text } = await supertest(BASE_URL).get('/').expect(200);
    const res = JSON.parse(text);
    assert.equal(res.length, 2);
  })

})
