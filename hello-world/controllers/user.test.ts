import { Router } from '@adonisjs/http-server/build/standalone';
import request from 'supertest';

describe('userController test', () => {
  describe('read', () => {
    it('should return an array', () => {
      request(Router).get('/').then((res) =>{
        expect(res).toBe([{}]);
      })
    })
  });

  // describe('create', () => {
  //   it('should create a user', () => {
  //     console.log(result)
  //     const beforeCreate = result.length;
  //     request(Router).post('/').body('user3').then(() =>{
  //       request(Router).get('/').then((res) =>{
  //         result = res;
  //         expect(res).toBeInstanceOf(Array);
  //       })
  //       expect(result).toBeGreaterThan(beforeCreate);
  //     })
  //   })
  // })
})

// 3. 테스팅 할 때마다 데이터 초기화! , Japa 이용해서 테스팅