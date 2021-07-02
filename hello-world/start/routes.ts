/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async () => {
//   return 'hello world'
// })

class User {
  public index: number;
  public id: string;

  constructor(
    index: number,
    id: string,
  ) {
    this.index = index;
    this.id = id;
  }
}

const user1: User = new User(1, 'user1');
const user2: User = new User(2, 'user2');

let userDB: User[] = [user1, user2];
let getnextIdx = (userDB: User[]): number => {
  return userDB.length +1;
} 

// 모든 유저 조회 (Read)
Route.get('/', ({ response }) => {
  response.send(userDB);
})

// 유저 추가 (Create)
Route.post('/', ({ request, response }) => {
  const newUser = request.body().id;
  if (!newUser) {
    return response.status(400).send({ 'message': 'required id' });
  }
  userDB.push(new User(getnextIdx(userDB), newUser));
  response.send(userDB[getnextIdx(userDB) -1]);
})
// 유저 중복아이디 있는지 확인

// 유저 아이디 변경 (Update)
Route.patch('/:index', ({ request, params , response}) => {
  const userId = request.body().id;
  const index = params.index -1;
  if (!userId) {
    return response.status(400).send({ 'message': 'required id' });
  }
  userDB[index]['id'] = userId;
  response.send(`changed as ${userDB[index]['id']}`);
})

// 유저 삭제 (Delete)
Route.delete('/:index', ({ params, response }) => {
  const index = params.index;
  if (!index) {
    return response.status(400).send({ 'message': 'required index' });
  }
  if (Number(index) > userDB.length) {
    return response.status(404).send({ 'message': `user index : ${index} not found`});
  }
  userDB = userDB.filter((user) => user.index !== Number(index));
  response.send({ 'message' : `deleted index : ${index}` });
})